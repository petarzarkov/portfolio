/**
 * Identity and links. Everything else about the site is generated
 * (docs/03-data-pipeline.md).
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
  /** Used by the hero and the social card. Breadth, not a specialism. */
  builds:
    'Frameworks, games, smart contracts, trading systems and the pipelines that ship them.',
} as const;
