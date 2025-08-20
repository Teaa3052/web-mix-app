// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import Home from "./pages/Home";
import SimpleMixForm from "./pages/SimpleMixForm";
import HowItWorks from "./pages/HowItWorks";
import ComplexMixForm from './pages/ComplexMixForm'; 

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simple-mix" element={<SimpleMixForm />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/complex-mix" element={<ComplexMixForm />} /> 
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;