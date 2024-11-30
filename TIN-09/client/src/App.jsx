import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import AppList from "./ApplicationList";
import AppForm from "./ApplicationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/applications" element={<AppList />} />
        <Route path="/applications/form" element={<AppForm />} />
      </Routes>
    </Router>
  );
}

export default App;