import React from "react";
import { Route, Routes } from "react-router-dom";
import { NavBar } from "@components";
import { Home, Skills, Contact, About, NotFound } from "@screens";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route path="/" element={<Home />} />
        <Route path="skills" element={<Skills />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
