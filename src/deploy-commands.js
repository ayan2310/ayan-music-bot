require("dotenv").config();

const { AudioPlayerStatus } = require("@discordjs/voice");
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Checks if the bot is online")
    .toJSON(),

    new SlashCommandBuilder()
    .setName("join")
    .setDescription("Makes the bot join your voice channel")
    .toJSON(),

    new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays audio from a URL or song title")
    .addStringOption((option) =>
        option
            .setName("query")
            .setDescription("Song title, YouTube/SoundCloud URL, or direct audio URL")
            .setRequired(true)
    )
    .toJSON(),

    new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops the current song")
    .toJSON(),

    new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Kick this annoying loud bot from the vc")
    .toJSON(),

    new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song")
    .toJSON(),

    new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the current song")
    .toJSON(),

    new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the current song queue")
    .toJSON(),

    new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing song")
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function main() {
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  );

  console.log("Commands registered.");
}

main();
