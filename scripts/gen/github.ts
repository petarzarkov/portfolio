/**
 * The GitHub half of the pipeline: one paginated repository query and one
 * contributions query, over the GraphQL API with plain `fetch`.
 *
 * `viewer` rather than `user(login:)` throughout. The language totals are the
 * denominator the skills map is drawn from, and public-only would badly
 * under-report - the account's private contributions outnumber its public ones.
 * `viewer` needs a token whose owner is the user, which is what `GH_DATA_TOKEN`
 * is for (docs/03-data-pipeline.md).
 */

const ENDPOINT = 'https://api.github.com/graphql';

/**
 * `GH_DATA_TOKEN` in CI. `GITHUB_TOKEN` is accepted for convenience but cannot
 * read `viewer.contributionsCollection` or private repos, so a run with only
 * that produces a thinner snapshot rather than an error.
 */
export const token = (): string | null =>
  process.env.GH_DATA_TOKEN ?? process.env.GITHUB_TOKEN ?? null;

export class OfflineError extends Error {
  constructor(cause: string) {
    super(`GitHub is unreachable: ${cause}`);
    this.name = 'OfflineError';
  }
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

/**
 * One GraphQL request, retried on 5xx and on the secondary rate limit. A
 * transport failure raises `OfflineError`, which the orchestrator treats as
 * "leave the committed snapshot alone" rather than as a build failure.
 */
export const graphql = async <T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> => {
  const auth = token();
  if (auth === null) throw new OfflineError('no GH_DATA_TOKEN or GITHUB_TOKEN');

  let lastError = 'unknown';

  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await Bun.sleep(2 ** attempt * 250);

    let response: Response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${auth}`,
          'Content-Type': 'application/json',
          // GitHub rejects a GraphQL request with no User-Agent.
          'User-Agent': 'petarzarkov-portfolio-generator',
        },
        body: JSON.stringify({ query, variables }),
      });
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      continue;
    }

    if (response.status >= 500 || response.status === 429) {
      lastError = `HTTP ${response.status}`;
      continue;
    }

    if (!response.ok) {
      // 401/403 is a bad or under-scoped token: retrying cannot fix it.
      throw new OfflineError(
        `HTTP ${response.status} ${await response.text()}`,
      );
    }

    const body = (await response.json()) as GraphQLResponse<T>;
    if (body.errors && body.errors.length > 0) {
      throw new Error(
        `GraphQL: ${body.errors.map((e) => e.message).join('; ')}`,
      );
    }
    if (!body.data) throw new Error('GraphQL returned no data');
    return body.data;
  }

  throw new OfflineError(`${lastError} after 4 attempts`);
};

export interface RawRepo {
  name: string;
  description: string | null;
  homepageUrl: string | null;
  url: string;
  isArchived: boolean;
  isFork: boolean;
  isPrivate: boolean;
  stargazerCount: number;
  forkCount: number;
  createdAt: string;
  pushedAt: string | null;
  licenseInfo: { spdxId: string | null } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  languages: {
    totalSize: number;
    edges: { size: number; node: { name: string; color: string | null } }[];
  } | null;
  latestRelease: { tagName: string; publishedAt: string | null } | null;
  openGraphImageUrl: string | null;
}

const REPOS_QUERY = `
query Repos($cursor: String) {
  viewer {
    repositories(
      first: 50
      after: $cursor
      ownerAffiliations: OWNER
      orderBy: { field: PUSHED_AT, direction: DESC }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name description homepageUrl url
        isArchived isFork isPrivate
        stargazerCount forkCount createdAt pushedAt
        licenseInfo { spdxId }
        repositoryTopics(first: 25) { nodes { topic { name } } }
        languages(first: 25, orderBy: { field: SIZE, direction: DESC }) {
          totalSize
          edges { size node { name color } }
        }
        latestRelease { tagName publishedAt }
        openGraphImageUrl
      }
    }
  }
}`;

interface ReposPage {
  viewer: {
    repositories: {
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
      nodes: RawRepo[];
    };
  };
}

/** Every repo the account owns, private included, newest push first. */
export const fetchRepos = async (): Promise<RawRepo[]> => {
  const repos: RawRepo[] = [];
  let cursor: string | null = null;

  // Bounded: 20 pages of 50 is 1000 repos, well past the account's 155, and it
  // means a pageInfo that never reports `hasNextPage: false` cannot spin here.
  for (let page = 0; page < 20; page++) {
    const data: ReposPage = await graphql<ReposPage>(REPOS_QUERY, { cursor });
    const { nodes, pageInfo } = data.viewer.repositories;
    repos.push(...nodes);
    if (!pageInfo.hasNextPage) return repos;
    cursor = pageInfo.endCursor;
  }

  return repos;
};

export interface RawContributions {
  totalCommitContributions: number;
  restrictedContributionsCount: number;
  totalPullRequestContributions: number;
  totalPullRequestReviewContributions: number;
  totalIssueContributions: number;
  contributionCalendar: {
    totalContributions: number;
    weeks: {
      contributionDays: { date: string; contributionCount: number }[];
    }[];
  };
}

const CONTRIBUTIONS_QUERY = `
query Contributions {
  viewer {
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

/**
 * The trailing year. `restrictedContributionsCount` is non-zero only when
 * *Settings -> Profile -> Include private contributions on my profile* is on;
 * without it the calendar shows a fraction of the real activity.
 */
export const fetchContributions = async (): Promise<RawContributions> => {
  const data = await graphql<{
    viewer: { contributionsCollection: RawContributions };
  }>(CONTRIBUTIONS_QUERY);
  return data.viewer.contributionsCollection;
};
