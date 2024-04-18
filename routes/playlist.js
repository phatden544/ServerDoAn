const express = require('express');
const router = express.Router();
const { Playlist, Song } = require("../models/model1");

// POST route to add a new playlist
router.post("/", async (req, res) => {
    try {
        const { playlistName, genres, songs } = req.body;
        const newPlaylist = new Playlist({ playlistName, genres , songs});

        // Save the playlist and update related songs
        const savedPlaylist = await newPlaylist.save();
        if (songs && songs.length > 0) {
            await Song.updateMany({ _id: { $in: songs } }, { $addToSet: { playlistId: savedPlaylist._id } });
        }

        res.status(201).json(savedPlaylist);
    } catch (error) {
        console.error("Error adding playlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT route to update an existing playlist
router.put("/:id", async (req, res) => {
    try {
        const { playlistName, genres, songs } = req.body;
        const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, { playlistName, genres, songs }, { new: true });

        // Update related songs
        if (songs && songs.length > 0) {
            await Song.updateMany({ _id: { $in: songs } }, { $addToSet: { playlistId: updatedPlaylist._id } });
        }

        res.status(200).json(updatedPlaylist);
    } catch (error) {
        console.error("Error updating playlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE route to delete a playlist
router.delete("/:id", async (req, res) => {
    try {
        const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);

        // Remove the playlist from related songs
        await Song.updateMany({}, { $pull: { playlistId: req.params.id } });

        res.status(200).json(deletedPlaylist);
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET route to fetch all playlists
router.get("/", async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('songs').populate('genres');

        
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');

        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        res.status(200).json(playlist);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
