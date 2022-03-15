import React from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@components";
import { Skills, Contact, Projects, NotFound } from "@screens";

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
