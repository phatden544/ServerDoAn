const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    trackName: {
        type: String,
        required: false
    },
    displayImageUri: {
        type: String,
    },
    trackUri: {
        type: String,
        
    },
    duration: {
        type: String,
        
    },
    apiId: {
        type: String,
        unique: false
    },
    playlistId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Playlist"
        },
    ]

});

const playlistSchema = new mongoose.Schema({
    playlistName: {
        type: String,
        required: true
    },
    genres: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Genre"
        }
        
    ],
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song"
        },
    ]
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const genreSchema = new mongoose.Schema({
    genre: {
        type: String,
        required: false,
        unique: false
    }
});

let Song = mongoose.model("Song", songSchema);
let Playlist = mongoose.model("Playlist", playlistSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
module.exports = { Song , Playlist , User , Genre};