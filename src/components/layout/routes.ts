/**
 * The primary navigation, shared by the header and the drawer.
 *
 * One list, because two would drift: the drawer is the header on a phone, and a
 * route that exists in one and not the other is a page nobody can reach from
 * half the site.
 */
export const ROUTES = [
  ['/projects', 'Projects'],
  ['/skills', 'Skills'],
  ['/about', 'About'],
] as const;
