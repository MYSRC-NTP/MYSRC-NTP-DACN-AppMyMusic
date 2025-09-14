import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../controller/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createPlaylist);
router.get("/", protectRoute, getUserPlaylists);
router.post("/:playlistId/songs", protectRoute, addSongToPlaylist);
router.delete("/:playlistId/songs/:songId", protectRoute, removeSongFromPlaylist);
router.put("/:playlistId", protectRoute, updatePlaylist);
router.delete("/:playlistId", protectRoute, deletePlaylist);

export default router;