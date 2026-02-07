import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import PageDetail from "./pages/PageDetail";

function App() {
  const [role, setRole] = useState<"user" | "admin">("user");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MainLayout role={role} onRoleChange={setRole} />}
        >
          {/* HOME */}
          <Route index element={<HomePage />} />

          {/* PAGE DETAIL */}
          <Route
            path="pages/:pageId"
            element={<PageDetail role={role} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

