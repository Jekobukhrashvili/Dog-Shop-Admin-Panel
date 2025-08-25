import { Routes, Route, Link } from "react-router-dom";
import Animals from "./pages/Animals";
import Categories from "./pages/Categories";
import AnimalsWithCategories from "./pages/AnimalsWithCategories";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <nav
        style={{
          display: "flex",
          gap: "15px",
          background: "#f3f3f3",
          padding: "10px",
        }}
      >
        <Link to="/">Dashboard</Link>
        <Link to="/animals">Animals</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/relations">Animals with Categories</Link>
      </nav>

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/relations" element={<AnimalsWithCategories />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
