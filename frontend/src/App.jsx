import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import SignInPage from "./pages/auth/SignInPage";
import PlaylistPage from "./pages/playlist/PlaylistPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import ArtistsPage from "./pages/artist/ArtistsPage";
import ArtistProfilePage from "./pages/artist/ArtistProfilePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="/sso-callback"
          element={<AuthenticateWithRedirectCallback signUpUrl="/sign-up" />}
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/artists/:id" element={<ArtistProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
