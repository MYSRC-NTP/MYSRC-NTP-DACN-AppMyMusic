import { Router } from "express";
import {
  getAllArtists,
  getArtistDetail,
  createArtist,
  updateArtist,
  deleteArtist
} from "../controller/artist.controller.js";

const router = Router();

router.get("/", getAllArtists);
router.get("/:id", getArtistDetail);
router.post("/", createArtist);
router.put("/:id", updateArtist);
router.delete("/:id", deleteArtist);

export default router; 