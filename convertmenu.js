const fs = require('fs');
const { exec } = require('child_process');
const axios = require('axios');
const path = require('path');
const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const { getRandom } = require("../System/Function.js");
const { webp2mp4File } = require("../System/Uploader.js");
const { toAudio } = require("../System/File-Converter.js");
const { CatboxUpload } = require("../System/Uploader.js");
const { getBuffer } = require("../System/Function2.js");
const ffmpegPath = require("ffmpeg-static");

module.exports = {
  name: "convert",
  alias: ["sticker", "toimg", "tomp3", "tomp4", "togif", "tovn", "tourl", "topptx", "todoc", "tocsv", "tozip", "rar", "convertmenu"],
  category: "converter",
  use: ".sticker or .toimg or .convertmenu",
  async run({ XROD, m, inputCMD, text, quoted, mime, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 📋 CONVERT MENU
      case "convertmenu":
        const menu = `
╭━━━〔 🌐 CONVERT MENU 〕━━━⬣
┃ ${prefix}sticker - Img to sticker
┃ ${prefix}toimg - Sticker to img
┃ ${prefix}tomp3 - Video to MP3
┃ ${prefix}tomp4 - Video to MP4
┃ ${prefix}togif - Video to GIF
┃ ${prefix}tovn - Voice note
┃ ${prefix}tourl - File to URL
┃ ${prefix}topptx - PDF to PPTX
┃ ${prefix}todoc - PDF to DOC
┃ ${prefix}tocsv - PDF to CSV
┃ ${prefix}tozip - Zip file
┃ ${prefix}rar - RAR file
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
- Reply to image with ${prefix}sticker
- Reply to sticker with ${prefix}toimg
- Reply to video with ${prefix}tomp3
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
      
      // 🎵 TOMP3 (Video/Audio to MP3)
      case "tomp3":
      case "toaudio":
        if (!m.quoted && !/video|audio/.test(mime)) {
          return m.reply(`❌ Reply to a *video* or *audio* with *${prefix}tomp3*`);
        }
        
        await m.reply("🎵 *Converting to MP3...*");
        let mediaMp3 = await XROD.downloadAndSaveMediaMessage(quoted);
        let mp3Out = await getRandom(".mp3");
        
        exec(`"${ffmpegPath}" -i ${mediaMp3} -vn -acodec libmp3lame ${mp3Out}`, async (err) => {
          fs.unlinkSync(mediaMp3);
          if (err) return m.reply("❌ Failed to convert!");
          
          await XROD.sendMessage(from, { 
            audio: fs.readFileSync(mp3Out), 
            mimetype: "audio/mpeg",
            fileName: `converted_${Date.now()}.mp3`
          });
          fs.unlinkSync(mp3Out);
        });
        break;
      
      // 🎬 TOMP4 (Video Convert)
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
      
      // 🎙️ TOVN (Voice Note)
      case "tovn":
      case "tovoice":
        if (!m.quoted && !/video|audio/.test(mime)) {
          return m.reply(`❌ Reply to a *video* or *audio* with *${prefix}tovn*`);
        }
        
        await m.reply("🎙️ *Converting to voice note...*");
        let mediaVn = await XROD.downloadAndSaveMediaMessage(quoted);
        let vnOut = await getRandom(".mp3");
        
        exec(`"${ffmpegPath}" -i ${mediaVn} -vn -acodec libmp3lame -ar 24000 -ac 1 ${vnOut}`, async (err) => {
          fs.unlinkSync(mediaVn);
          if (err) return m.reply("❌ Failed to convert!");
          
          await XROD.sendMessage(from, { 
            audio: fs.readFileSync(vnOut), 
            mimetype: "audio/mpeg",
            ptt: true
          });
          fs.unlinkSync(vnOut);
        });
        break;
      
      // 🔗 TOURL (File to URL)
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
      
      // 📄 TOPDF (Image to PDF)
      case "topdf":
      case "imgtopdf":
        if (!/image/.test(mime)) {
          return m.reply(`❌ Reply to an *image* with *${prefix}topdf*`);
        }
        
        await m.reply("📄 *Converting to PDF...*");
        let mediaPdf = await XROD.downloadAndSaveMediaMessage(quoted);
        let pdfOut = `./${Date.now()}.pdf`;
        
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(pdfOut);
        doc.pipe(stream);
        doc.image(mediaPdf, 0, 0, { width: 612, align: "center" });
        doc.end();
        
        stream.on('finish', async () => {
          await XROD.sendMessage(from, {
            document: fs.readFileSync(pdfOut),
            fileName: `converted_${Date.now()}.pdf`,
            mimetype: "application/pdf"
          });
          fs.unlinkSync(mediaPdf);
          fs.unlinkSync(pdfOut);
        });
        break;
      
      // 📦 TOZIP (Zip File)
      case "tozip":
        if (!m.quoted && !/document/.test(mime)) {
          return m.reply(`❌ Reply to a *file* with *${prefix}tozip*`);
        }
        
        await m.reply("📦 *Creating zip archive...*");
        let mediaZip = await XROD.downloadAndSaveMediaMessage(quoted);
        let zipOut = `./${Date.now()}.zip`;
        let output = fs.createWriteStream(zipOut);
        let archive = archiver('zip', { zlib: { level: 9 } });
        
        archive.pipe(output);
        archive.file(mediaZip, { name: path.basename(mediaZip) });
        await archive.finalize();
        
        output.on('close', async () => {
          await XROD.sendMessage(from, {
            document: fs.readFileSync(zipOut),
            fileName: `archive_${Date.now()}.zip`,
            mimetype: "application/zip"
          });
          fs.unlinkSync(mediaZip);
          fs.unlinkSync(zipOut);
        });
        break;
      
      // ⚠️ Placeholder commands (need external APIs)
      case "topptx":
        return m.reply("❌ *Coming soon!* PDF to PPTX converter will be added in next update.");
      
      case "todoc":
        return m.reply("❌ *Coming soon!* PDF to DOC converter will be added in next update.");
      
      case "tocsv":
        return m.reply("❌ *Coming soon!* PDF to CSV converter will be added in next update.");
      
      case "rar":
        return m.reply("❌ *Coming soon!* RAR compression will be added in next update.");
      
      default:
        break;
    }
  }
};