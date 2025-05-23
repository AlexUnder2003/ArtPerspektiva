import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Login from "./pages/login";
import ArtDetailPage from "@/pages/detail";
import Signup from "./pages/signup";
import ProfilePage from "./pages/profile";
import AuthorPage from "./pages/author";


function App() {
  return (
      <Routes>
        <Route element={<IndexPage />}      path="/"       />
        <Route element={<Login />}          path="/login"  />
        <Route element={<Signup />}         path="/signup" />
        <Route element={<ProfilePage />}    path="/profile" />
        <Route element={<ArtDetailPage />}  path="/detail/:id"/>
        <Route element={<AuthorPage />}     path="/artist/:id" />
      </Routes>
  );
}

export default App;
