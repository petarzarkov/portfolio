/**
 * Identity and links. Everything else about the site is generated
 * (docs/03-data-pipeline.md).
 */
export const site = {
  name: 'Petar Zarkov',
  role: 'Lead Software Engineer',
  location: 'Bulgaria',
  email: 'pzarko1@gmail.com',
  github: 'https://github.com/petarzarkov',
  linkedin: 'https://www.linkedin.com/in/%E2%98%95-petar-zarkov-7989a670/',
  youtube: 'https://www.youtube.com/@RustBeats',
  url: 'https://petarzarkov.com',

  /**
   * The landing page's opening claim. This is the one sentence a visitor with
   * thirty seconds actually reads, so it says what gets built rather than
   * restating the job title.
   */
  thesis:
    'I build backend frameworks and the tooling around them — and the things that run on top.',
} as const;
