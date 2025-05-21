import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import Login from "./pages/login";
import ArtDetailPage from "@/pages/detail";
import Signup from "./pages/signup";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />}      path="/"       />
      <Route element={<DocsPage />}       path="/docs"   />
      <Route element={<PricingPage />}    path="/pricing"/>
      <Route element={<BlogPage />}       path="/blog"   />
      <Route element={<Login />}          path="/login"  />
      <Route element={<Signup />}         path="/signup" />
      {/* Обратите внимание на :id в конце */}
      <Route element={<ArtDetailPage />}  path="/detail/:id"/>
    </Routes>
  );
}

export default App;
