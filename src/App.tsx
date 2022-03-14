import React from "react";
import { Route, Routes } from "react-router-dom";
import { NavBar } from "@components";
import { Skills, Contact, Projects, NotFound } from "@screens";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Projects />} />
        <Route path="skills" element={<Skills />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
