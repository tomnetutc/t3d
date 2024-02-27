import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <Router>
      <App />
    </Router>
  );
} else {
  console.error("Failed to find the root element");
}