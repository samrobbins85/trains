import "./App.css";
import { Routes, Route } from "react-router-dom";
import Station from "./pages/station";
import Index from "./pages";
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Index />} />
      <Route path="/:station" element={<Station />} />
    </Routes>
  );
}

export default App;
