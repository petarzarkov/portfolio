import React from "react";
import { Route, Routes } from "react-router-dom";
import { NavBar } from "@components";
import { Home, Skills, Contact, Projects, NotFound } from "@screens";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
