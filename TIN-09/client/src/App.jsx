import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import AppList from "./ApplicationList";
import AppForm from "./ApplicationForm";
import AppInfo from "./ApplicationInfo";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/applications" element={<AppList />} />
        <Route path="/applications/form" element={<AppForm />} />
        <Route path="/applications/:id" element={<AppInfo />} />
        <Route path="*" element={<h1>Nic takiego nie znaleziono :(</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
