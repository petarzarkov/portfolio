import { useMemo } from 'react';
import {
  Spotlight,
  spotlight,
  type SpotlightActionData,
} from '@mantine/spotlight';
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconExternalLink,
  IconFileText,
  IconSearch,
  IconUser,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { site } from '@config';
import { projects } from '@data';

/**
 * Command palette over every project and section.
 *
 * Built entirely from the generated snapshot, so a newly tagged repository is
 * searchable the next morning with no code change. For the audience this site
 * is aimed at, a working Cmd-K is a stronger signal than any animation.
 */
export const Palette = () => {
  const navigate = useNavigate();

  const actions = useMemo((): SpotlightActionData[] => {
    const sections: SpotlightActionData[] = [
      {
        id: 'projects',
        label: 'Projects',
        description: 'Everything, by tier',
        leftSection: <IconFileText size={18} />,
        onClick: () => navigate('/projects'),
      },
      {
        id: 'skills',
        label: 'Skills',
        description: 'Languages by volume, and a year of activity',
        leftSection: <IconSearch size={18} />,
        onClick: () => navigate('/skills'),
      },
      {
        id: 'about',
        label: 'About',
        description: 'Who, and how to get hold of me',
        leftSection: <IconUser size={18} />,
        onClick: () => navigate('/about'),
      },
      {
        id: 'github',
        label: 'GitHub',
        description: site.github,
        leftSection: <IconBrandGithub size={18} />,
        onClick: () => window.open(site.github, '_blank', 'noreferrer'),
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        description: 'Full work history',
        leftSection: <IconBrandLinkedin size={18} />,
        onClick: () => window.open(site.linkedin, '_blank', 'noreferrer'),
      },
    ];

    const found: SpotlightActionData[] = projects.map((project) => ({
      id: `project-${project.slug}`,
      label: project.title,
      description:
        project.headline ?? project.description ?? `${project.tier} project`,
      // Topics are in the search string so "solidity" finds the contracts and
      // "rust" finds rust-beats, without either word being in the title.
      keywords: [project.tier, ...project.topics],
      leftSection: <IconExternalLink size={18} />,
      onClick: () => navigate(`/projects/${project.slug}`),
    }));

    return [...sections, ...found];
  }, [navigate]);

  return (
    <Spotlight
      actions={actions}
      nothingFound="Nothing here."
      highlightQuery
      shortcut={['mod + K', '/']}
      searchProps={{
        leftSection: <IconSearch size={18} />,
        placeholder: 'Search projects and sections…',
      }}
    />
  );
};

export { spotlight };
