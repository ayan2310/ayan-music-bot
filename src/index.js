require("dotenv").config();

process.env.FFMPEG_PATH = require("ffmpeg-static");

const { Client, Events, GatewayIntentBits } = require("discord.js");
const { 
  createAudioPlayer,
  joinVoiceChannel,
  createAudioResource,
  getVoiceConnection,
  AudioPlayerStatus,
 } = require("@discordjs/voice");
const play = require("play-dl");
const youtubeDl = require("youtube-dl-exec");


const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
const player = createAudioPlayer();
const queue = [];
let currentConnection = null;
let currentSong = null;
let currentYoutubeProcess = null;
client.once(Events.ClientReady, async (readyClient) => {
  await setupPlayDl();
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }

  if (interaction.commandName === "join"){
    const voiceChannel = interaction.member.voice.channel;

    if(!voiceChannel){
        await interaction.reply("You need to join a voice channel first gang.");
        return;
    }

    joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    await interaction.reply(`Joined ${voiceChannel.name}`);
  }

  if(interaction.commandName === "play") {
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;

    if(!query){
        await interaction.reply("Please provide a song title or URL.");
        return;
    }

    if(!voiceChannel){
        await interaction.reply("You need to join a voice channel first gang.");
        return;
    }

    try{
        await interaction.deferReply();

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        console.log("Play query from Discord:", query);

        currentConnection = connection;
        connection.subscribe(player);

        const song = await getSongInfo(query);
        queue.push(song);

        if(player.state.status === AudioPlayerStatus.Idle){
          const started = await playNextSong();

          if(started){
            await interaction.editReply(`Now playing ${song.title}`);
          }else{
            await interaction.editReply(`I found ${song.title}, but I could not start playback.`);
          }
        }else{
          await interaction.editReply(`Added to queue: ${song.title}`);
        }
    }catch(error){
        console.error(error);

        if(interaction.deferred || interaction.replied){
          await interaction.followUp("I could not play that URL")
        }else{
          await interaction.reply("I could not play that URL.");
        }
    }
  }

  if(interaction.commandName === "stop") {
    queue.length = 0;
    currentSong = null;
    stopCurrentYoutubeProcess();
    player.stop();
    await interaction.reply("stopped the current song");
  }

  if(interaction.commandName === "leave"){
    const connection = getVoiceConnection(interaction.guild.id);

    if(!connection){
      await interaction.reply("I am not in a voice channel dumdum.");
      return;
    }
    stopCurrentYoutubeProcess();
    connection.destroy();
    await interaction.reply("Left the vc :(");
  }

  if(interaction.commandName === "pause"){
    if(player.state.status !== AudioPlayerStatus.Playing){
      await interaction.reply("There is no song playing right now gng");
      return;
    }

    player.pause();
    await interaction.reply("Paused the song");
  }

  if(interaction.commandName === "resume"){
    if(player.state.status !== AudioPlayerStatus.Paused){
      await interaction.reply("The song is not paused. GRRR");
      return;
    }

    player.unpause();
    await interaction.reply("Resumed the song");
  }

  if (interaction.commandName === "queue") {
  if (!currentSong && queue.length === 0) {
    await interaction.reply("The queue is empty.");
    return;
  }

  const nowPlayingText = currentSong
  ? `Now playing:\n${currentSong.title}`
  : "Nothing is playing right now.";

  const queueText =
    queue.length > 0
      ? queue.map((song, index) => `${index + 1}. ${song.title}`).join("\n")
      : "No songs waiting.";

  await interaction.reply(`${nowPlayingText}\n\nUp next:\n${queueText}`);
}

  if (interaction.commandName === "skip") {
  if (player.state.status === AudioPlayerStatus.Idle) {
    await interaction.reply("There is no song playing right now.");
    return;
  }

  stopCurrentYoutubeProcess();
  player.stop();
  await interaction.reply("Skipped the current song.");
}
});

function getSongTitle(url) {
  try {
    const parsedUrl = new URL(url);
    const fileName = parsedUrl.pathname.split("/").pop();

    if (!fileName) {
      return url;
    }

    return decodeURIComponent(fileName);
  } catch {
    return url;
  }
}

async function getSongInfo(url) {
  if (!isUrl(url)) {
    return searchSong(url);
  }

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const info = await play.video_basic_info(url);

    return {
      url: url,
      title: info.video_details.title || url,
    };
  }

  if (url.includes("soundcloud.com")) {
    const info = await play.soundcloud(url);

    return {
      url: url,
      title: info.name || url,
    };
  }

  return {
    url: url,
    title: getSongTitle(url),
  };
}

function isUrl(text) {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

async function searchSong(query) {
  const youtubeResults = await play.search(query, {
    limit: 1,
    source: {
      youtube: "video",
    },
  }).catch((error) => {
    console.log("YouTube search failed.");
    console.error(error);
    return [];
  });

  if (youtubeResults.length > 0) {
    const video = youtubeResults[0];

    return {
      url: video.url,
      title: video.title || query,
    };
  }

  const soundcloudResults = await play.search(query, {
    limit: 1,
    source: {
      soundcloud: "tracks",
    },
  }).catch((error) => {
    console.log("SoundCloud search failed.");
    console.error(error);
    return [];
  });

  if (soundcloudResults.length > 0) {
    const track = soundcloudResults[0];

    return {
      url: track.url || track.permalink,
      title: track.name || query,
    };
  }

  throw new Error(`No results found for ${query}`);
}

function isPlatformUrl(url) {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("soundcloud.com")
  );
}

function isYoutubeUrl(url) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function stopCurrentYoutubeProcess() {
  if (currentYoutubeProcess && !currentYoutubeProcess.killed) {
    currentYoutubeProcess.kill("SIGKILL");
  }

  currentYoutubeProcess = null;
}

async function createSongResource(song) {
  if (isYoutubeUrl(song.url)) {
    stopCurrentYoutubeProcess();

    const subprocess = youtubeDl.exec(song.url, {
      format: "bestaudio[ext=webm]/bestaudio",
      output: "-",
      quiet: true,
      noWarnings: true,
      noCheckCertificates: true,
      noPlaylist: true,
    });
    currentYoutubeProcess = subprocess;

    subprocess.stderr.on("data", (data) => {
      console.error(`yt-dlp: ${data}`);
    });

    subprocess.on("close", () => {
      if (currentYoutubeProcess === subprocess) {
        currentYoutubeProcess = null;
      }
    });

    subprocess.catch((error) => {
      if (error.killed || error.signalCode === "SIGKILL") {
        return;
      }

      console.error("yt-dlp process error:");
      console.error(error);
    });

    return createAudioResource(subprocess.stdout);
  }

  if (isPlatformUrl(song.url)) {
    const stream = await play.stream(song.url);

    return createAudioResource(stream.stream, {
      inputType: stream.type,
    });
  }

  const response = await fetch(song.url);

  if (!response.ok) {
    throw new Error(`Could not download ${song.url}`);
  }

  return createAudioResource(response.body);
}

async function setupPlayDl() {
  try {
    const clientId = await play.getFreeClientID();

    play.setToken({
      soundcloud: {
        client_id: clientId,
      },
    });
  } catch (error) {
    console.log("SoundCloud setup failed. YouTube and direct MP3 links may still work.");
    console.error(error);
  }
}

async function playNextSong(){
  if(queue.length === 0){
    currentSong = null;
    return false;
  }

  const nextSong = queue.shift();
  currentSong = nextSong;

  try{
    const resource = await createSongResource(nextSong);

    player.play(resource);

    if(currentConnection){
      currentConnection.subscribe(player);
    }

    console.log(`Now playing ${nextSong.title}`);
    return true;
  }catch(error){
    console.error(error);
    return playNextSong();
  }
}

player.on(AudioPlayerStatus.Idle, () => {
  playNextSong();
});

player.on("error", (error) => {
  console.error("Audio player error:");
  console.error(error);
  stopCurrentYoutubeProcess();
  playNextSong();
});

client.login(process.env.DISCORD_TOKEN);
 
