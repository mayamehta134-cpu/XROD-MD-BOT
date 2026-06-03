const axios = require('axios');

module.exports = {
  name: "textpro",
  alias: ["tx1", "tx2", "tx3", "tx4", "tx5", "tx6", "tx7", "tx8", "tx9", "tx10", "photoframe", "burnpaper", "coffee", "christmas", "textpromenu"],
  category: "textpro",
  use: ".tx1 text or .tx2 text or .textpromenu",
  async run({ XROD, m, inputCMD, text, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 📝 TEXTPRO MENU
      case "textpromenu":
        const menu = `
╭━━━〔 📝 TEXTPRO MENU 〕━━━⬣
┃ ${prefix}tx1 - TextPro style 1
┃ ${prefix}tx2 - TextPro style 2
┃ ${prefix}tx3 - TextPro style 3
┃ ${prefix}tx4 - TextPro style 4
┃ ${prefix}tx5 - TextPro style 5
┃ ${prefix}tx6 - TextPro style 6
┃ ${prefix}tx7 - TextPro style 7
┃ ${prefix}tx8 - TextPro style 8
┃ ${prefix}tx9 - TextPro style 9
┃ ${prefix}tx10 - TextPro style 10
┃ ${prefix}photoframe - Photo frame
┃ ${prefix}burnpaper - Burn paper
┃ ${prefix}coffee - Coffee cup
┃ ${prefix}christmas - Christmas card
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}tx1 XROD
${prefix}tx2 XROD
${prefix}coffee XROD
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 🎨 TEXTPRO STYLE 1 - Glitch
      case "tx1":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx1 Your Text\n\nExample: ${prefix}tx1 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 1...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/glitch?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 1*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create! Try another style.");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 2 - Neon
      case "tx2":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx2 Your Text\n\nExample: ${prefix}tx2 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 2...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/neon?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 2*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 3 - Fire
      case "tx3":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx3 Your Text\n\nExample: ${prefix}tx3 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 3...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/fire?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 3*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 4 - 3D Gold
      case "tx4":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx4 Your Text\n\nExample: ${prefix}tx4 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 4...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/3dgold?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 4*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 5 - Carbon
      case "tx5":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx5 Your Text\n\nExample: ${prefix}tx5 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 5...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/carbon?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 5*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 6 - Toxic
      case "tx6":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx6 Your Text\n\nExample: ${prefix}tx6 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 6...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/toxic?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 6*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 7 - Rainbow
      case "tx7":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx7 Your Text\n\nExample: ${prefix}tx7 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 7...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/rainbow?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 7*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 8 - Robot
      case "tx8":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx8 Your Text\n\nExample: ${prefix}tx8 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 8...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/robot?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 8*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 9 - Snow
      case "tx9":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx9 Your Text\n\nExample: ${prefix}tx9 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 9...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/snow?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 9*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🎨 TEXTPRO STYLE 10 - Horror
      case "tx10":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tx10 Your Text\n\nExample: ${prefix}tx10 XROD`);
        
        await m.reply("🎨 *Creating TextPro style 10...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/textpro/horror?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *TextPro Style 10*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create!");
        }
        break;
      
      // 🖼️ PHOTO FRAME
      case "photoframe":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}photoframe Your Text\n\nExample: ${prefix}photoframe XROD`);
        
        await m.reply("🖼️ *Creating photo frame...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/ephoto/photoframe?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🖼️ *Photo Frame*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create photo frame!");
        }
        break;
      
      // 🔥 BURN PAPER
      case "burnpaper":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}burnpaper Your Text\n\nExample: ${prefix}burnpaper XROD`);
        
        await m.reply("🔥 *Creating burn paper effect...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/ephoto/burnpaper?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🔥 *Burn Paper Effect*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create burn paper!");
        }
        break;
      
      // ☕ COFFEE CUP
      case "coffee":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}coffee Your Name\n\nExample: ${prefix}coffee XROD`);
        
        await m.reply("☕ *Creating coffee cup design...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/ephoto/coffee?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `☕ *Coffee Cup*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create coffee cup!");
        }
        break;
      
      // 🎄 CHRISTMAS CARD
      case "christmas":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}christmas Your Text\n\nExample: ${prefix}christmas Merry Christmas`);
        
        await m.reply("🎄 *Creating Christmas card...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/ephoto/christmas?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎄 *Christmas Card*\n📝 ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create Christmas card!");
        }
        break;
      
      default:
        break;
    }
  }
};