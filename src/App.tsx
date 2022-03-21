import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@components";

const Projects = lazy(() => import("./screens/Projects"));
const Skills = lazy(() => import("./screens/Skills"));
const Contact = lazy(() => import("./screens/Contact"));
const NotFound = lazy(() => import("./screens/NotFound"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Projects />} />
        <Route path="skills" element={<Skills />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
