const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { getRandom } = require("../System/Function.js");

module.exports = {
  name: "meme",
  alias: ["meme", "dank", "wholesome", "memegen", "caption", "crispmeme", "deepfry", "trash", "wanted", "jail", "rip", "mememenu"],
  category: "meme",
  use: ".meme or .dank or .mememenu",
  async run({ XROD, m, inputCMD, text, quoted, mime, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 😂 MEME MENU
      case "mememenu":
        const menu = `
╭━━━〔 😂 MEME MENU 〕━━━⬣
┃ ${prefix}meme - Random meme
┃ ${prefix}dank - Dank meme
┃ ${prefix}wholesome - Wholesome meme
┃ ${prefix}memegen - Generate meme
┃ ${prefix}caption - Add caption
┃ ${prefix}crispmeme - Crisp meme
┃ ${prefix}deepfry - Deep fry image
┃ ${prefix}trash - Trash image
┃ ${prefix}wanted - Wanted poster
┃ ${prefix}jail - Jail image
┃ ${prefix}rip - RIP tombstone
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}meme - Random meme
${prefix}memegen text|bottom|template
${prefix}wanted reply to image
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 😂 RANDOM MEME
      case "meme":
        await m.reply("😂 *Fetching meme...*");
        
        try {
          const { data } = await axios.get('https://meme-api.com/gimme');
          if (data && data.url) {
            await XROD.sendMessage(from, {
              image: { url: data.url },
              caption: `😂 *${data.title}*\n👍 ${data.ups} upvotes\n🔗 r/${data.subreddit}`
            });
          } else {
            await m.reply("❌ Couldn't fetch meme! Try again.");
          }
        } catch (err) {
          await m.reply("❌ Meme API error! Try again later.");
        }
        break;
      
      // 🔥 DANK MEME
      case "dank":
        await m.reply("🔥 *Fetching dank meme...*");
        
        try {
          const { data } = await axios.get('https://meme-api.com/gimme/dankmemes');
          if (data && data.url) {
            await XROD.sendMessage(from, {
              image: { url: data.url },
              caption: `🔥 *Dank Meme*\n👍 ${data.ups} upvotes`
            });
          } else {
            await m.reply("❌ Couldn't fetch dank meme!");
          }
        } catch (err) {
          await m.reply("❌ Error fetching dank meme!");
        }
        break;
      
      // 💖 WHOLESOME MEME
      case "wholesome":
        await m.reply("💖 *Fetching wholesome meme...*");
        
        try {
          const { data } = await axios.get('https://meme-api.com/gimme/wholesomememes');
          if (data && data.url) {
            await XROD.sendMessage(from, {
              image: { url: data.url },
              caption: `💖 *Wholesome Meme*\n👍 ${data.ups} upvotes`
            });
          } else {
            await m.reply("❌ Couldn't fetch wholesome meme!");
          }
        } catch (err) {
          await m.reply("❌ Error fetching wholesome meme!");
        }
        break;
      
      // 🎨 MEMEGEN (Generate Custom Meme)
      case "memegen":
        if (!text) {
          return m.reply(`❌ *Usage:* ${prefix}memegen text|bottom|template\n\n*Templates:* drake, two, buttons, crying, change, elon, disastergirl\n\nExample: ${prefix}memegen Hello|World|drake`);
        }
        
        const parts = text.split('|');
        if (parts.length < 2) {
          return m.reply(`❌ *Format:* ${prefix}memegen top text|bottom text|template\n\nExample: ${prefix}memegen Hello|World|drake`);
        }
        
        const topText = encodeURIComponent(parts[0]);
        const bottomText = encodeURIComponent(parts[1]);
        const template = parts[2] || "drake";
        
        await m.reply("🎨 *Generating meme...*");
        
        try {
          const memeUrl = `https://api.memegen.link/images/${template}/${topText}/${bottomText}.png`;
          await XROD.sendMessage(from, {
            image: { url: memeUrl },
            caption: `🎨 *Custom Meme*\n📝 ${parts[0]} | ${parts[1]}`
          });
        } catch (err) {
          await m.reply("❌ Failed to generate meme! Try different template.");
        }
        break;
      
      // 📝 CAPTION (Add Caption to Image)
      case "caption":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}caption Your caption here\n\nThen reply to an image.`);
        
        if (!m.quoted && !/image/.test(mime)) {
          return m.reply(`❌ Reply to an *image* with *${prefix}caption* and your caption text.`);
        }
        
        let captionText = text;
        let mediaCaption = await XROD.downloadAndSaveMediaMessage(quoted);
        let captionOut = await getRandom(".jpg");
        
        await m.reply("📝 *Adding caption to image...*");
        
        exec(`convert ${mediaCaption} -gravity south -pointsize 30 -fill white -stroke black -strokewidth 2 -annotate 0 "${captionText}" ${captionOut}`, async (err) => {
          if (err) {
            fs.unlinkSync(mediaCaption);
            return m.reply("❌ Failed to add caption! Make sure ImageMagick is installed.");
          }
          
          await XROD.sendMessage(from, {
            image: fs.readFileSync(captionOut),
            caption: `📝 *Captioned Image*\n\n"${captionText}"`
          });
          
          fs.unlinkSync(mediaCaption);
          fs.unlinkSync(captionOut);
        });
        break;
      
      // 🥨 CRISP MEME
      case "crispmeme":
        if (!m.quoted && !/image/.test(mime)) {
          return m.reply(`❌ Reply to an *image* with *${prefix}crispmeme*`);
        }
        
        await m.reply("🥨 *Making meme crisp...*");
        let mediaCrisp = await XROD.downloadAndSaveMediaMessage(quoted);
        let crispOut = await getRandom(".jpg");
        
        exec(`convert ${mediaCrisp} -sharpen 0x2 -contrast -contrast ${crispOut}`, async (err) => {
          if (err) {
            fs.unlinkSync(mediaCrisp);
            return m.reply("❌ Failed to crisp meme!");
          }
          
          await XROD.sendMessage(from, { image: fs.readFileSync(crispOut), caption: "🥨 *Crisp Meme*" });
          fs.unlinkSync(mediaCrisp);
          fs.unlinkSync(crispOut);
        });
        break;
      
      // 🍟 DEEPFRY Image
      case "deepfry":
        if (!m.quoted && !/image/.test(mime)) {
          return m.reply(`❌ Reply to an *image* with *${prefix}deepfry*`);
        }
        
        await m.reply("🍟 *Deep frying image...*");
        let mediaDeep = await XROD.downloadAndSaveMediaMessage(quoted);
        let deepOut = await getRandom(".jpg");
        
        exec(`convert ${mediaDeep} -modulate 100,200,50 -contrast -contrast -contrast -posterize 4 -colors 256 ${deepOut}`, async (err) => {
          if (err) {
            fs.unlinkSync(mediaDeep);
            return m.reply("❌ Failed to deep fry!");
          }
          
          await XROD.sendMessage(from, { image: fs.readFileSync(deepOut), caption: "🍟 *Deep Fried Meme*" });
          fs.unlinkSync(mediaDeep);
          fs.unlinkSync(deepOut);
        });
        break;
      
      // 🗑️ TRASH Image
      case "trash":
        if (!m.quoted && !/image/.test(mime)) {
          return m.reply(`❌ Reply to an *image* with *${prefix}trash*`);
        }
        
        await m.reply("🗑️ *Trashing image...*");
        let mediaTrash = await XROD.downloadAndSaveMediaMessage(quoted);
        let trashOut = await getRandom(".jpg");
        
        const trashBg = "https://i.imgflip.com/7xq7v.jpg";
        const trashBgBuffer = await axios.get(trashBg, { responseType: 'arraybuffer' });
        fs.writeFileSync('trash_bg.jpg', Buffer.from(trashBgBuffer.data));
        
        exec(`convert trash_bg.jpg ${mediaTrash} -gravity south -geometry +0+30 -composite ${trashOut}`, async (err) => {
          if (err) {
            fs.unlinkSync(mediaTrash);
            fs.unlinkSync('trash_bg.jpg');
            return m.reply("❌ Failed to create trash meme!");
          }
          
          await XROD.sendMessage(from, { image: fs.readFileSync(trashOut), caption: "🗑️ *Trash Meme*" });
          fs.unlinkSync(mediaTrash);
          fs.unlinkSync('trash_bg.jpg');
          fs.unlinkSync(trashOut);
        });
        break;
      
      // 👮 WANTED Poster
      case "wanted":
        if (!m.quoted && !/image/.test(mime)) {
          return m.reply(`❌ Reply to an *image* with *${prefix}wanted*`);
        }
        
        const wantedText = text || "WANTED";
        await m.reply("👮 *Creating wanted poster...*");
        
        let mediaWanted = await XROD.downloadAndSaveMediaMessage(quoted);
        let wantedOut = await getRandom(".jpg");
        
        exec(`convert ${mediaWanted} -resize 400x400 -background yellow -gravity center -extent 500x600 -font Arial -pointsize 40 -fill red -annotate +0-200 "${wantedText}" -pointsize 20 -annotate +0+250 "REWARD: $10,000" ${wantedOut}`, async (err) => {
          if (err) {
            fs.unlinkSync(mediaWanted);
            return m.reply("❌ Failed to create wanted poster!");
          }
          
          await XROD.sendMessage(from, { image: fs.readFileSync(wantedOut), caption: `👮 *WANTED* ${wantedText}` });
          fs.unlinkSync(mediaWanted);
          fs.unlinkSync(wantedOut);
        });
        break;
      
      // 🔒 JAIL Image
      case "jail":
        if (!m.quoted && !/image/.test(mime)) {
          return m.reply(`❌ Reply to an *image* with *${prefix}jail*`);
        }
        
        await m.reply("🔒 *Putting in jail...*");
        let mediaJail = await XROD.downloadAndSaveMediaMessage(quoted);
        let jailOut = await getRandom(".jpg");
        
        const jailBars = "https://i.imgflip.com/2kbnqp.png";
        const jailBuffer = await axios.get(jailBars, { responseType: 'arraybuffer' });
        fs.writeFileSync('jail_bars.png', Buffer.from(jailBuffer.data));
        
        exec(`convert ${mediaJail} -resize 500x500 jail_bars.png -gravity center -composite ${jailOut}`, async (err) => {
          if (err) {
            fs.unlinkSync(mediaJail);
            fs.unlinkSync('jail_bars.png');
            return m.reply("❌ Failed to create jail image!");
          }
          
          await XROD.sendMessage(from, { image: fs.readFileSync(jailOut), caption: "🔒 *JAILED* 🔒" });
          fs.unlinkSync(mediaJail);
          fs.unlinkSync('jail_bars.png');
          fs.unlinkSync(jailOut);
        });
        break;
      
      // 🪦 RIP Tombstone
      case "rip":
        const ripText = text || "Here Lies\nSomeone\nR.I.P.";
        await m.reply("🪦 *Creating RIP tombstone...*");
        
        let ripOut = await getRandom(".jpg");
        
        exec(`convert -size 400x500 xc:gray -font Arial -pointsize 30 -fill black -gravity center -annotate 0 "${ripText}" -stroke black -strokewidth 2 -draw "roundrectangle 50,50,350,450 20,20" ${ripOut}`, async (err) => {
          if (err) {
            return m.reply("❌ Failed to create RIP tombstone!");
          }
          
          await XROD.sendMessage(from, { image: fs.readFileSync(ripOut), caption: "🪦 *REST IN PEACE* 🪦" });
          fs.unlinkSync(ripOut);
        });
        break;
      
      default:
        break;
    }
  }
};