import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import EditMovie from "./pages/EditMovie";
import CreateMovie from "./pages/CreateMovie";
import PrivateRoutes from "./routes/protectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/EditMovie/:id" element={<EditMovie />} />
          <Route path="/CreateMovie" element={<CreateMovie />} />
        </Route>
        <Route path="/signIn" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
