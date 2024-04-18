const express = require('express');
const router = express.Router();
const { Song, Playlist } = require("../models/model1");

// POST route to add a new song
router.post("/", async (req, res) => {
    try {
        const { trackName, displayImageUri, trackUri, duration, apiId, playlistId } = req.body;
        const newSong = new Song({ trackName, displayImageUri, trackUri, duration, apiId, playlistId });
        const savedSong = await newSong.save();

        // Update related playlists if playlistId is provided
        if (playlistId) {
            await Playlist.updateOne({ _id: playlistId }, { $addToSet: { songs: savedSong._id } });
        }

        res.status(201).json(savedSong);
    } catch (error) {
        console.error("Error adding song:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT route to update an existing song
router.put("/:id", async (req, res) => {
    try {
        const { trackName, displayImageUri, trackUri, duration, apiId, playlistId } = req.body;
        const updatedSong = await Song.findByIdAndUpdate(req.params.id, { trackName, displayImageUri, trackUri, duration, apiId, playlistId }, { new: true });

        // Update related playlists if playlistId is provided
        if (playlistId) {
            await Playlist.updateOne({ _id: playlistId }, { $addToSet: { songs: updatedSong._id } });
        }

        res.status(200).json(updatedSong);
    } catch (error) {
        console.error("Error updating song:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE route to delete a song
router.delete("/:id", async (req, res) => {
    try {
        const deletedSong = await Song.findByIdAndDelete(req.params.id);

        // Remove the song from related playlists
        await Playlist.updateMany({}, { $pull: { songs: req.params.id } });

        res.status(200).json(deletedSong);
    } catch (error) {
        console.error("Error deleting song:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET route to fetch all songs
router.get("/", async (req, res) => {
    try {
        const songs = await Song.find();

        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
