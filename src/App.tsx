import "./index.css";
import { Route, Routes } from "react-router";

import {
  CreatePostPage,
  Explore,
  SavedPosts,
  Profile,
  AllUsers,
  Home,
} from "./pages";
import CompleteProfile from "./pages/CompleteProfile";
import "./index.css";
import RootLayout from "./_root/RootLayout";

import { Toaster } from "sonner";

import EditPostPage from "./pages/EditPostPage";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <main className="min-h-screen">
      <div>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/saved" element={<SavedPosts />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/profile/:id/*" element={<Profile />} />
            <Route path="/update-post/:id" element={<EditPostPage />} />
            <Route path="/edit-profile/:id" element={<EditProfile />} />
          </Route>
        </Routes>
      </div>
      <Toaster />
    </main>
  );
}

export default App;
