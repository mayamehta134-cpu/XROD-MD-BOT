const axios = require('axios');
const fs = require('fs');
const ytdl = require('ytdl-core');
const { getRandom } = require("../System/Function.js");

module.exports = {
  name: "download",
  alias: ["ytmp3", "ytmp4", "ytmp3doc", "ytplay", "tiktok", "tiktokmp3", "ig", "igphoto", "fb", "tw", "pin", "spotify", "soundcloud", "mediafire", "downloadmenu"],
  category: "downloader",
  use: ".ytmp3 url or .downloadmenu",
  async run({ XROD, m, inputCMD, text, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 📋 DOWNLOAD MENU
      case "downloadmenu":
        const menu = `
╭━━━〔 📥 DOWNLOAD MENU 〕━━━⬣
┃ ${prefix}ytmp3 - YouTube audio
┃ ${prefix}ytmp4 - YouTube video
┃ ${prefix}ytmp3doc - YT as document
┃ ${prefix}ytplay - Play from YT
┃ ${prefix}tiktok - TikTok video
┃ ${prefix}tiktokmp3 - TikTok audio
┃ ${prefix}ig - Instagram reel
┃ ${prefix}igphoto - Instagram photo
┃ ${prefix}fb - Facebook video
┃ ${prefix}tw - Twitter video
┃ ${prefix}pin - Pinterest download
┃ ${prefix}spotify - Spotify track
┃ ${prefix}soundcloud - SoundCloud
┃ ${prefix}mediafire - MediaFire
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}ytmp3 https://youtu.be/xxx
${prefix}tiktok https://vm.tiktok.com/xxx
${prefix}ig https://www.instagram.com/reel/xxx
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 🎵 YTMP3 - YouTube Audio Downloader
      case "ytmp3":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}ytmp3 YouTube_URL\n\nExample: ${prefix}ytmp3 https://youtu.be/dQw4w9WgXcQ`);
        
        if (!text.includes("youtu")) return m.reply("❌ Please send a valid YouTube link!");
        
        await m.reply("📥 *Downloading audio... Please wait.*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.download) {
            await XROD.sendMessage(from, {
              audio: { url: data.result.download },
              mimetype: "audio/mpeg",
              fileName: `${data.result.title || "audio"}.mp3`
            });
          } else {
            // Fallback API
            const { data: fallback } = await axios.get(`https://vihangayt.me/download/ytmp3?url=${encodeURIComponent(text)}`);
            if (fallback && fallback.data) {
              await XROD.sendMessage(from, {
                audio: { url: fallback.data.link },
                mimetype: "audio/mpeg"
              });
            } else {
              await m.reply("❌ Failed to download! Try again.");
            }
          }
        } catch (err) {
          await m.reply("❌ Error! Try another link or try later.");
        }
        break;
      
      // 🎬 YTMP4 - YouTube Video Downloader
      case "ytmp4":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}ytmp4 YouTube_URL\n\nExample: ${prefix}ytmp4 https://youtu.be/dQw4w9WgXcQ`);
        
        if (!text.includes("youtu")) return m.reply("❌ Please send a valid YouTube link!");
        
        await m.reply("📥 *Downloading video... Please wait.*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.download) {
            await XROD.sendMessage(from, {
              video: { url: data.result.download },
              caption: `${data.result.title || "Video"}`
            });
          } else {
            await m.reply("❌ Failed to download video!");
          }
        } catch (err) {
          await m.reply("❌ Error! Try again.");
        }
        break;
      
      // 📄 YTMP3DOC - YouTube Audio as Document
      case "ytmp3doc":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}ytmp3doc YouTube_URL\n\nExample: ${prefix}ytmp3doc https://youtu.be/xxx`);
        
        if (!text.includes("youtu")) return m.reply("❌ Please send a valid YouTube link!");
        
        await m.reply("📥 *Downloading as document...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.download) {
            const audioResponse = await axios.get(data.result.download, { responseType: 'arraybuffer' });
            await XROD.sendMessage(from, {
              document: Buffer.from(audioResponse.data),
              mimetype: "audio/mpeg",
              fileName: `${data.result.title || "audio"}.mp3`
            });
          } else {
            await m.reply("❌ Failed to download!");
          }
        } catch (err) {
          await m.reply("❌ Error!");
        }
        break;
      
      // ▶️ YTPLAY - Play from YouTube (Audio)
      case "ytplay":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}ytplay song_name\n\nExample: ${prefix}ytplay Shape of You`);
        
        await m.reply("🔍 *Searching...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/search/youtube?q=${encodeURIComponent(text)}`);
          if (data && data.result && data.result[0]) {
            const videoUrl = `https://youtube.com/watch?v=${data.result[0].id}`;
            const { data: audioData } = await axios.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(videoUrl)}`);
            
            if (audioData && audioData.result && audioData.result.download) {
              await XROD.sendMessage(from, {
                audio: { url: audioData.result.download },
                mimetype: "audio/mpeg",
                caption: `🎵 *${data.result[0].title}*\n👤 ${data.result[0].channel}`
              });
            } else {
              await m.reply(`🎵 *${data.result[0].title}*\n🔗 ${videoUrl}`);
            }
          } else {
            await m.reply("❌ No results found!");
          }
        } catch (err) {
          await m.reply("❌ Search failed!");
        }
        break;
      
      // 📱 TIKTOK - TikTok Video Downloader
      case "tiktok":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tiktok TikTok_URL\n\nExample: ${prefix}tiktok https://vm.tiktok.com/xxx`);
        
        if (!text.includes("tiktok")) return m.reply("❌ Please send a valid TikTok link!");
        
        await m.reply("📥 *Downloading TikTok video...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.video) {
            await XROD.sendMessage(from, {
              video: { url: data.result.video },
              caption: `🎵 ${data.result.title || "TikTok Video"}`
            });
          } else {
            await m.reply("❌ Failed to download!");
          }
        } catch (err) {
          await m.reply("❌ Error! Try again.");
        }
        break;
      
      // 🎵 TIKTOKMP3 - TikTok Audio Downloader
      case "tiktokmp3":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tiktokmp3 TikTok_URL\n\nExample: ${prefix}tiktokmp3 https://vm.tiktok.com/xxx`);
        
        if (!text.includes("tiktok")) return m.reply("❌ Please send a valid TikTok link!");
        
        await m.reply("📥 *Downloading TikTok audio...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.audio) {
            await XROD.sendMessage(from, {
              audio: { url: data.result.audio },
              mimetype: "audio/mpeg"
            });
          } else {
            await m.reply("❌ Failed to download audio!");
          }
        } catch (err) {
          await m.reply("❌ Error!");
        }
        break;
      
      // 📸 IG - Instagram Reel Downloader
      case "ig":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}ig Instagram_URL\n\nExample: ${prefix}ig https://www.instagram.com/reel/xxx`);
        
        if (!text.includes("instagram")) return m.reply("❌ Please send a valid Instagram link!");
        
        await m.reply("📥 *Downloading Instagram reel...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/instagram?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.video) {
            await XROD.sendMessage(from, {
              video: { url: data.result.video },
              caption: `📸 Instagram Reel`
            });
          } else {
            await m.reply("❌ Failed to download!");
          }
        } catch (err) {
          await m.reply("❌ Error! Make sure the link is correct.");
        }
        break;
      
      // 🖼️ IGPHOTO - Instagram Photo Downloader
      case "igphoto":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}igphoto Instagram_Post_URL\n\nExample: ${prefix}igphoto https://www.instagram.com/p/xxx`);
        
        if (!text.includes("instagram")) return m.reply("❌ Please send a valid Instagram link!");
        
        await m.reply("📥 *Downloading Instagram photo...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/instagram?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.image) {
            await XROD.sendMessage(from, {
              image: { url: data.result.image },
              caption: `🖼️ Instagram Photo`
            });
          } else if (data && data.result && data.result.images) {
            for (let img of data.result.images) {
              await XROD.sendMessage(from, { image: { url: img } });
            }
          } else {
            await m.reply("❌ Failed to download image!");
          }
        } catch (err) {
          await m.reply("❌ Error!");
        }
        break;
      
      // 📘 FB - Facebook Video Downloader
      case "fb":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}fb Facebook_Video_URL\n\nExample: ${prefix}fb https://fb.watch/xxx`);
        
        if (!text.includes("facebook") && !text.includes("fb")) return m.reply("❌ Please send a valid Facebook link!");
        
        await m.reply("📥 *Downloading Facebook video...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.hd) {
            await XROD.sendMessage(from, {
              video: { url: data.result.hd },
              caption: `📘 Facebook Video`
            });
          } else if (data && data.result && data.result.sd) {
            await XROD.sendMessage(from, {
              video: { url: data.result.sd },
              caption: `📘 Facebook Video`
            });
          } else {
            await m.reply("❌ Failed to download!");
          }
        } catch (err) {
          await m.reply("❌ Error!");
        }
        break;
      
      // 🐦 TW - Twitter/X Video Downloader
      case "tw":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tw Twitter_URL\n\nExample: ${prefix}tw https://twitter.com/xxx/status/xxx`);
        
        if (!text.includes("twitter") && !text.includes("x.com")) return m.reply("❌ Please send a valid Twitter/X link!");
        
        await m.reply("📥 *Downloading Twitter video...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.hd) {
            await XROD.sendMessage(from, {
              video: { url: data.result.hd },
              caption: `🐦 Twitter/X Video`
            });
          } else if (data && data.result && data.result.sd) {
            await XROD.sendMessage(from, {
              video: { url: data.result.sd },
              caption: `🐦 Twitter/X Video`
            });
          } else {
            await m.reply("❌ Failed to download!");
          }
        } catch (err) {
          await m.reply("❌ Error!");
        }
        break;
      
      // 📌 PIN - Pinterest Downloader
      case "pin":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}pin Pinterest_URL\n\nExample: ${prefix}pin https://pin.it/xxx`);
        
        if (!text.includes("pinterest")) return m.reply("❌ Please send a valid Pinterest link!");
        
        await m.reply("📥 *Downloading from Pinterest...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(text)}`);
          if (data && data.result) {
            await XROD.sendMessage(from, {
              image: { url: data.result },
              caption: `📌 Pinterest Image`
            });
          } else {
            await m.reply("❌ Failed to download!");
          }
        } catch (err) {
          await m.reply("❌ Error!");
        }
        break;
      
      // 🎵 SPOTIFY - Spotify Track Downloader
      case "spotify":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}spotify Spotify_URL\n\nExample: ${prefix}spotify https://open.spotify.com/track/xxx`);
        
        if (!text.includes("spotify")) return m.reply("❌ Please send a valid Spotify link!");
        
        await m.reply("📥 *Downloading from Spotify...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.download) {
            await XROD.sendMessage(from, {
              audio: { url: data.result.download },
              mimetype: "audio/mpeg",
              fileName: `${data.result.title || "track"}.mp3`
            });
          } else {
            await m.reply("❌ Failed to download!");
          }
        } catch (err) {
          await m.reply("❌ Spotify download may require premium API. Try another source.");
        }
        break;
      
      // 🎧 SOUNDCLOUD - SoundCloud Downloader
      case "soundcloud":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}soundcloud SoundCloud_URL\n\nExample: ${prefix}soundcloud https://soundcloud.com/xxx`);
        
        if (!text.includes("soundcloud")) return m.reply("❌ Please send a valid SoundCloud link!");
        
        await m.reply("📥 *Downloading from SoundCloud...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.download) {
            await XROD.sendMessage(from, {
              audio: { url: data.result.download },
              mimetype: "audio/mpeg"
            });
          } else {
            await m.reply("❌ Failed to download!");
          }
        } catch (err) {
          await m.reply("❌ Error!");
        }
        break;
      
      // 💾 MEDIAFIRE - MediaFire Downloader
      case "mediafire":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}mediafire MediaFire_URL\n\nExample: ${prefix}mediafire https://www.mediafire.com/file/xxx`);
        
        if (!text.includes("mediafire")) return m.reply("❌ Please send a valid MediaFire link!");
        
        await m.reply("📥 *Getting MediaFire link...*");
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/mediafire?url=${encodeURIComponent(text)}`);
          if (data && data.result && data.result.download) {
            await m.reply(`✅ *Download Link:*\n${data.result.download}\n\n📁 *Filename:* ${data.result.name || "file"}`);
          } else {
            await m.reply("❌ Failed to get link!");
          }
        } catch (err) {
          await m.reply("❌ Error!");
        }
        break;
      
      default:
        break;
    }
  }
};