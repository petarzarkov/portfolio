/**
 * Identity and links. Everything else about the site is generated
 * by `scripts/gen`.
 */
export const site = {
  name: 'Petar Zarkov',
  role: 'Software Engineering Manager',
  location: 'Sofia, Bulgaria',
  email: 'pzarko1@gmail.com',
  github: 'https://github.com/petarzarkov',
  linkedin: 'https://www.linkedin.com/in/%E2%98%95-petar-zarkov-7989a670/',
  youtube: 'https://www.youtube.com/@RustBeats',
  profile: 'https://petarzarkov.github.io/petarzarkov/',
  url: 'https://petarzarkov.com',

  /**
   * The one line a visitor with thirty seconds actually reads. His own, and
   * better than anything written to order.
   */
  tagline: "Vibe Janitor — I delete code that you don't need.",
  experience: '20+ years',

  /**
   * A CV to download, as a path under `public/`.
   *
   * Null until there is a file to serve, and the About page renders the button
   * only when it is set - so the affordance a hiring manager looks for is wired
   * up and waiting, and a missing PDF can never ship as a broken download.
   * Drop the file in `public/` and put its path here.
   */
  cv: null as string | null,
  /** Used by the hero and the social card. Breadth, not a specialism. */
  builds:
    'Frameworks, games, smart contracts, trading systems and the pipelines that ship them.',
} as const;
