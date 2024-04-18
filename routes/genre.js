const express = require('express');
const router = express.Router();
const { Genre } = require("../models/model1");

// Create a new genre
router.post('/', async (req, res) => {
    try {
        const { genre } = req.body;
        const newgenres = new Genre({ genre });
        const genres = await newgenres.save();
        res.status(201).json({ message: "Genre created successfully" });
    } catch (error) {
        console.error("Error creating genre:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get all genres
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find();
        res.status(200).json(genres);
    } catch (error) {
        console.error("Error getting genres:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a specific genre by ID
router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ error: "Genre not found" });
        }
        res.status(200).json(genre);
    } catch (error) {
        console.error("Error getting genre:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a genre by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, { genre: req.body.genre }, { new: true });
        if (!updatedGenre) {
            return res.status(404).json({ error: "Genre not found" });
        }
        res.status(200).json({ message: "Genre updated successfully" });
    } catch (error) {
        console.error("Error updating genre:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a genre by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
        if (!deletedGenre) {
            return res.status(404).json({ error: "Genre not found" });
        }
        res.status(200).json({ message: "Genre deleted successfully" });
    } catch (error) {
        console.error("Error deleting genre:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
