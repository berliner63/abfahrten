import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import M6 from "./M6";

const Router = () => (
  <BrowserRouter basename="/abfahrten">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/m6" element={<M6 />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
