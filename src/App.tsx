import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, Container, Loader, Center } from '@mantine/core';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ScrollProgress } from './components/ScrollProgress';
import { Landing } from './screens/Landing';

// Route-level splitting: the landing page is what most visitors load, and it
// should not carry the treemap, the heatmap or Recharts.
const Projects = lazy(() => import('./screens/Projects'));
const ProjectDetail = lazy(() => import('./screens/ProjectDetail'));
const Skills = lazy(() => import('./screens/Skills'));
const About = lazy(() => import('./screens/About'));
const NotFound = lazy(() => import('./screens/NotFound'));

const Fallback = () => (
  <Center mih={320}>
    <Loader color="brand" type="dots" />
  </Center>
);

export const App = () => {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <Header />
      <Box component="main" mih="70vh">
        <Container size="lg" pt="xl">
          {/* Keyed on pathname so a route change remounts the boundary rather
              than showing the previous route's content under a new URL. */}
          <Suspense key={pathname} fallback={<Fallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
