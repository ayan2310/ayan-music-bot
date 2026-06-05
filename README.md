# Ayan Music Bot

A Discord music bot built with Node.js, discord.js, and @discordjs/voice.

## Features

- Join and leave voice channels
- Play direct audio URLs
- Search and play songs by title from YouTube
- Search SoundCloud as a fallback
- Queue songs
- Show the current queue
- Pause, resume, skip, and stop playback

## Commands

- `/ping` checks if the bot is online
- `/join` joins your current voice channel
- `/play query:<song or url>` plays a song title, YouTube/SoundCloud URL, or direct audio URL
- `/queue` shows the current song and upcoming songs
- `/pause` pauses playback
- `/resume` resumes playback
- `/skip` skips the current song
- `/stop` stops playback and clears the queue
- `/leave` disconnects from the voice channel

## Setup

Create a `.env` file based on `.env.example`:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id_here
GUILD_ID=your_test_server_id_here
```

Install dependencies:

```bash
npm install
```

Register slash commands:

```bash
npm run deploy
```

Start the bot:

```bash
npm start
```

## Tech Stack

- Node.js
- discord.js
- @discordjs/voice
- play-dl
- ffmpeg-static

## Portfolio Description

Built a Discord music bot with slash commands, voice channel playback, queue management, pause/resume/skip controls, and song title search using Node.js and discord.js.
