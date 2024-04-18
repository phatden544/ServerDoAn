const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require("../models/model1");

// Sign Up
router.post('/signup', async (req, res) => {
    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    try {
        // Find the user by username
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, '3d81935fa0e0f3b754d1ae0265c3f6e11e4bc2800aeb82c12c40c13e63dc1e55', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Edit user profile
router.put('/:id', async (req, res) => {
    try {
        // Update user information
        await User.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete user account
router.delete('/:id', async (req, res) => {
    try {
        // Find and delete the user
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.get('/', async (req, res) => {
    try {
        // Find all users
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;
