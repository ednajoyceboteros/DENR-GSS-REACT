import { Routes, Route, Navigate } from "react-router-dom";
import IarLanding from "./pages/IarLanding";
import IarForm from "./pages/IARForm";

export default function App() {
  return (
    <Routes>
      {/* make / work */}
      <Route path="/" element={<Navigate to="/iar-landing-page" replace />} />

      <Route path="/iar-landing-page" element={<IarLanding />} />
      <Route path="/iar-form" element={<IarForm />} />

      {/* never blank */}
      <Route path="*" element={<Navigate to="/iar-landing-page" replace />} />
    </Routes>
  );
}
