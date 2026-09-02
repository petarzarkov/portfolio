import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A client-side route change does not reset scroll, so navigating from halfway
 * down /projects to a detail page lands halfway down that one.
 *
 * `instant` rather than the smooth scroll set globally in global.css: animating
 * a jump the reader did not ask for is disorienting, and it races the new
 * route's entrance animations.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};
