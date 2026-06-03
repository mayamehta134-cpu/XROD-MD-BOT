const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const axios = require('axios');
const ffmpegPath = require("ffmpeg-static");
const { getRandom } = require("../System/Function.js");
const { webp2mp4File } = require("../System/Uploader.js");
const { toAudio } = require("../System/File-Converter.js");
const { CatboxUpload } = require("../System/Uploader.js");

module.exports = {
  name: "media",
  alias: ["sticker", "s", "toimg", "tomp4", "togif", "tourl", "getaud", "getvid", "getimg", "compress", "reverse", "mediamenu"],
  category: "media",
  use: ".sticker or .s or .mediamenu",
  async run({ XROD, m, inputCMD, text, quoted, mime, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 🎵 MEDIA MENU
      case "mediamenu":
        const menu = `
╭━━━〔 🎵 MEDIA MENU 〕━━━⬣
┃ ${prefix}sticker - Image to sticker
┃ ${prefix}s - Quick sticker
┃ ${prefix}toimg - Sticker to image
┃ ${prefix}tomp4 - Sticker to video
┃ ${prefix}togif - Sticker to GIF
┃ ${prefix}tourl - Upload to cloud
┃ ${prefix}getaud - Extract audio
┃ ${prefix}getvid - Extract video
┃ ${prefix}getimg - Extract image
┃ ${prefix}compress - Compress video
┃ ${prefix}reverse - Reverse audio
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
- Reply to image with ${prefix}sticker
- Reply to sticker with ${prefix}toimg
- Reply to video with ${prefix}getaud
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 🎨 STICKER (Image to Sticker)
      case "sticker":
      case "s":
        let mediaSticker;
        if (m.quoted && /image/.test(mime)) {
          mediaSticker = await XROD.downloadAndSaveMediaMessage(quoted);
        } else if (/image/.test(mime)) {
          mediaSticker = await XROD.downloadAndSaveMediaMessage(m);
        } else {
          return m.reply(`❌ Reply to an image with *${prefix}sticker*`);
        }
        
        await m.reply("🎨 *Creating sticker...*");
        const stickerOut = `./${Date.now()}.webp`;
        
        exec(`"${ffmpegPath}" -i ${mediaSticker} -vf "scale=512:512" -vcodec libwebp -lossless 1 ${stickerOut}`, async (err) => {
          if (err) {
            fs.unlinkSync(mediaSticker);
            return m.reply("❌ Failed to create sticker!");
          }
          
          await XROD.sendMessage(from, { sticker: fs.readFileSync(stickerOut) });
          fs.unlinkSync(mediaSticker);
          fs.unlinkSync(stickerOut);
        });
        break;
      
      // 🖼️ TOIMG (Sticker to Image)
      case "toimg":
      case "toimage":
        if (!m.quoted && !/webp/.test(mime)) {
          return m.reply(`❌ Reply to a *sticker* with *${prefix}toimg*`);
        }
        
        await m.reply("🖼️ *Converting to image...*");
        let mediaToImg = await XROD.downloadAndSaveMediaMessage(quoted);
        let imgOut = await getRandom(".png");
        
        exec(`"${ffmpegPath}" -i ${mediaToImg} ${imgOut}`, async (err) => {
          fs.unlinkSync(mediaToImg);
          if (err) return m.reply("❌ Failed to convert!");
          
          let buffer = fs.readFileSync(imgOut);
          await XROD.sendMessage(from, { image: buffer, caption: `✅ Converted by XROD MD` });
          fs.unlinkSync(imgOut);
        });
        break;
      
      // 🎬 TOMP4 (Sticker to Video)
      case "tomp4":
        if (!m.quoted && !/webp/.test(mime)) {
          return m.reply(`❌ Reply to an *animated sticker* with *${prefix}tomp4*`);
        }
        
        await m.reply("🎬 *Converting to video...*");
        let mediaMp4 = await XROD.downloadAndSaveMediaMessage(quoted);
        let mp4Result = await webp2mp4File(mediaMp4);
        
        if (!mp4Result || !mp4Result.result) {
          fs.unlinkSync(mediaMp4);
          return m.reply("❌ Failed to convert!");
        }
        
        await XROD.sendMessage(from, { 
          video: { url: mp4Result.result },
          caption: `✅ Converted by XROD MD`
        });
        fs.unlinkSync(mediaMp4);
        break;
      
      // 🎞️ TOGIF (Sticker to GIF)
      case "togif":
        if (!m.quoted && !/webp/.test(mime)) {
          return m.reply(`❌ Reply to an *animated sticker* with *${prefix}togif*`);
        }
        
        await m.reply("🎞️ *Converting to GIF...*");
        let mediaGif = await XROD.downloadAndSaveMediaMessage(quoted);
        let gifResult = await webp2mp4File(mediaGif);
        
        if (!gifResult || !gifResult.result) {
          fs.unlinkSync(mediaGif);
          return m.reply("❌ Failed to convert!");
        }
        
        await XROD.sendMessage(from, { 
          video: { url: gifResult.result },
          gifPlayback: true,
          caption: `✅ Converted by XROD MD`
        });
        fs.unlinkSync(mediaGif);
        break;
      
      // 🔗 TOURL (Upload to Cloud)
      case "tourl":
        if (!/image|video|audio|document/.test(mime)) {
          return m.reply(`❌ Reply to an *image/video/audio/document* with *${prefix}tourl*`);
        }
        
        await m.reply("🔗 *Uploading to server...*");
        let mediaUrl = await XROD.downloadAndSaveMediaMessage(quoted);
        let url = await CatboxUpload(mediaUrl);
        
        if (url) {
          await m.reply(`✅ *Your file URL:*\n\n${url}`);
        } else {
          await m.reply("❌ Upload failed! Try again.");
        }
        fs.unlinkSync(mediaUrl);
        break;
      
      // 🎵 GETAUD (Extract Audio from Video)
      case "getaud":
      case "getaudio":
        if (!m.quoted && !/video/.test(mime)) {
          return m.reply(`❌ Reply to a *video* with *${prefix}getaud* to extract audio`);
        }
        
        await m.reply("🎵 *Extracting audio...*");
        let mediaAud = await XROD.downloadAndSaveMediaMessage(quoted);
        let audOut = await getRandom(".mp3");
        
        exec(`"${ffmpegPath}" -i ${mediaAud} -vn -acodec libmp3lame ${audOut}`, async (err) => {
          fs.unlinkSync(mediaAud);
          if (err) return m.reply("❌ Failed to extract audio!");
          
          await XROD.sendMessage(from, { 
            audio: fs.readFileSync(audOut), 
            mimetype: "audio/mpeg",
            fileName: `audio_${Date.now()}.mp3`
          });
          fs.unlinkSync(audOut);
        });
        break;
      
      // 📹 GETVID (Extract Video from Message)
      case "getvid":
      case "getvideo":
        if (!m.quoted && !/image|document/.test(mime)) {
          return m.reply(`❌ Reply to a *media* with *${prefix}getvid*`);
        }
        
        await m.reply("📹 *Processing video...*");
        let mediaVid = await XROD.downloadAndSaveMediaMessage(quoted);
        
        // Check if it's already a video
        if (/video/.test(mime)) {
          await XROD.sendMessage(from, { 
            video: fs.readFileSync(mediaVid),
            caption: `✅ Extracted video`
          });
        } else {
          await m.reply("❌ No video found in the media!");
        }
        fs.unlinkSync(mediaVid);
        break;
      
      // 🖼️ GETIMG (Extract Image)
      case "getimg":
      case "getimage":
        if (!m.quoted && !/sticker|document/.test(mime)) {
          return m.reply(`❌ Reply to a *sticker* or *image* with *${prefix}getimg*`);
        }
        
        await m.reply("🖼️ *Extracting image...*");
        let mediaImg = await XROD.downloadAndSaveMediaMessage(quoted);
        let imgExtractOut = await getRandom(".png");
        
        if (/webp/.test(mime)) {
          exec(`"${ffmpegPath}" -i ${mediaImg} ${imgExtractOut}`, async (err) => {
            fs.unlinkSync(mediaImg);
            if (err) return m.reply("❌ Failed to extract image!");
            
            await XROD.sendMessage(from, { 
              image: fs.readFileSync(imgExtractOut),
              caption: `✅ Extracted image`
            });
            fs.unlinkSync(imgExtractOut);
          });
        } else if (/image/.test(mime)) {
          await XROD.sendMessage(from, { 
            image: fs.readFileSync(mediaImg),
            caption: `✅ Extracted image`
          });
          fs.unlinkSync(mediaImg);
        } else {
          fs.unlinkSync(mediaImg);
          return m.reply("❌ No image found!");
        }
        break;
      
      // 📦 COMPRESS Video
      case "compress":
        if (!m.quoted && !/video/.test(mime)) {
          return m.reply(`❌ Reply to a *video* with *${prefix}compress*`);
        }
        
        await m.reply("📦 *Compressing video... This may take a while.*");
        let mediaComp = await XROD.downloadAndSaveMediaMessage(quoted);
        let compOut = await getRandom(".mp4");
        
        exec(`"${ffmpegPath}" -i ${mediaComp} -vf "scale=720:-2" -r 30 -c:v libx264 -crf 28 -preset fast ${compOut}`, async (err) => {
          fs.unlinkSync(mediaComp);
          if (err) return m.reply("❌ Failed to compress video!");
          
          const originalSize = fs.statSync(mediaComp).size / (1024 * 1024);
          const compressedSize = fs.statSync(compOut).size / (1024 * 1024);
          
          await XROD.sendMessage(from, { 
            video: fs.readFileSync(compOut),
            caption: `✅ *Video Compressed*\n\n📊 Original: ${originalSize.toFixed(2)} MB\n📉 Compressed: ${compressedSize.toFixed(2)} MB\n💾 Saved: ${(originalSize - compressedSize).toFixed(2)} MB`
          });
          fs.unlinkSync(compOut);
        });
        break;
      
      // 🔄 REVERSE Audio
      case "reverse":
        if (!m.quoted && !/audio|video/.test(mime)) {
          return m.reply(`❌ Reply to an *audio* or *video* with *${prefix}reverse*`);
        }
        
        await m.reply("🔄 *Reversing audio...*");
        let mediaRev = await XROD.downloadAndSaveMediaMessage(quoted);
        let revOut = await getRandom(".mp3");
        
        exec(`"${ffmpegPath}" -i ${mediaRev} -af "areverse" ${revOut}`, async (err) => {
          fs.unlinkSync(mediaRev);
          if (err) return m.reply("❌ Failed to reverse audio!");
          
          await XROD.sendMessage(from, { 
            audio: fs.readFileSync(revOut),
            mimetype: "audio/mpeg",
            fileName: `reversed_${Date.now()}.mp3`
          });
          fs.unlinkSync(revOut);
        });
        break;
      
      default:
        break;
    }
  }
};