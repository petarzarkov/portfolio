import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotFound, NavBar } from "@components";
import { Heading } from "@chakra-ui/react";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route path="skills" element={<Heading>Skills</Heading>} />
        <Route path="about" element={<Heading>About</Heading>} />
        <Route path="contact" element={<Heading>Contact</Heading>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
