const axios = require('axios');

module.exports = {
  name: "logo",
  alias: ["logo", "neon", "glow", "fire", "ice", "3d", "gold", "silver", "carbon", "wood", "water", "graffiti", "shadow", "logomenu"],
  category: "logo",
  use: ".logo text or .neon text or .logomenu",
  async run({ XROD, m, inputCMD, text, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 🎨 LOGO MENU
      case "logomenu":
        const menu = `
╭━━━〔 🎨 LOGO MENU 〕━━━⬣
┃ ${prefix}logo - Simple logo
┃ ${prefix}neon - Neon logo
┃ ${prefix}glow - Glow logo
┃ ${prefix}fire - Fire logo
┃ ${prefix}ice - Ice logo
┃ ${prefix}3d - 3D logo
┃ ${prefix}gold - Gold logo
┃ ${prefix}silver - Silver logo
┃ ${prefix}carbon - Carbon logo
┃ ${prefix}wood - Wood logo
┃ ${prefix}water - Water logo
┃ ${prefix}graffiti - Graffiti logo
┃ ${prefix}shadow - Shadow logo
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}logo XROD
${prefix}neon XROD
${prefix}3d XROD
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 🎨 SIMPLE LOGO
      case "logo":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}logo YourText\n\nExample: ${prefix}logo XROD`);
        
        await m.reply("🎨 *Creating logo...*");
        
        try {
          const apiUrl = `https://graphicsfamily.com/wp-content/plugins/bdthemes-element-pack/modules/logo-grid/widgets/logo-grid.php`;
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/logo?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create logo! Try another style.");
        }
        break;
      
      // 🔥 NEON LOGO
      case "neon":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}neon YourText\n\nExample: ${prefix}neon XROD`);
        
        await m.reply("🎨 *Creating neon logo...*");
        
        try {
          const response = await axios.get(`https://api.photohito.com/api/text-to-image/neon?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🔴 *Neon Logo:* ${text}` });
        } catch (err) {
          // Fallback
          await XROD.sendMessage(from, { image: { url: `https://api.memegen.link/images/custom/${encodeURIComponent(text)}.png?background=https://i.imgur.com/neon.png` }, caption: `🔴 Neon Logo: ${text}` });
        }
        break;
      
      // ✨ GLOW LOGO
      case "glow":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}glow YourText\n\nExample: ${prefix}glow XROD`);
        
        await m.reply("🎨 *Creating glow logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/glow?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `✨ *Glow Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create glow logo!");
        }
        break;
      
      // 🔥 FIRE LOGO
      case "fire":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}fire YourText\n\nExample: ${prefix}fire XROD`);
        
        await m.reply("🎨 *Creating fire logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/fire?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🔥 *Fire Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create fire logo!");
        }
        break;
      
      // ❄️ ICE LOGO
      case "ice":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}ice YourText\n\nExample: ${prefix}ice XROD`);
        
        await m.reply("🎨 *Creating ice logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/ice?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `❄️ *Ice Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create ice logo!");
        }
        break;
      
      // 🎯 3D LOGO
      case "3d":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}3d YourText\n\nExample: ${prefix}3d XROD`);
        
        await m.reply("🎨 *Creating 3D logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/3d?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎯 *3D Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create 3D logo!");
        }
        break;
      
      // 👑 GOLD LOGO
      case "gold":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}gold YourText\n\nExample: ${prefix}gold XROD`);
        
        await m.reply("🎨 *Creating gold logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/gold?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `👑 *Gold Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create gold logo!");
        }
        break;
      
      // 🔘 SILVER LOGO
      case "silver":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}silver YourText\n\nExample: ${prefix}silver XROD`);
        
        await m.reply("🎨 *Creating silver logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/silver?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🔘 *Silver Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create silver logo!");
        }
        break;
      
      // 🖤 CARBON LOGO
      case "carbon":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}carbon YourText\n\nExample: ${prefix}carbon XROD`);
        
        await m.reply("🎨 *Creating carbon logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/carbon?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🖤 *Carbon Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create carbon logo!");
        }
        break;
      
      // 🌲 WOOD LOGO
      case "wood":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}wood YourText\n\nExample: ${prefix}wood XROD`);
        
        await m.reply("🎨 *Creating wood logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/wood?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🌲 *Wood Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create wood logo!");
        }
        break;
      
      // 💧 WATER LOGO
      case "water":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}water YourText\n\nExample: ${prefix}water XROD`);
        
        await m.reply("🎨 *Creating water logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/water?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `💧 *Water Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create water logo!");
        }
        break;
      
      // 🎨 GRAFFITI LOGO
      case "graffiti":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}graffiti YourText\n\nExample: ${prefix}graffiti XROD`);
        
        await m.reply("🎨 *Creating graffiti logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/graffiti?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🎨 *Graffiti Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create graffiti logo!");
        }
        break;
      
      // 🌑 SHADOW LOGO
      case "shadow":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}shadow YourText\n\nExample: ${prefix}shadow XROD`);
        
        await m.reply("🎨 *Creating shadow logo...*");
        
        try {
          const response = await axios.get(`https://api.siputzx.my.id/api/logo/shadow?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
          await XROD.sendMessage(from, { image: Buffer.from(response.data), caption: `🌑 *Shadow Logo:* ${text}` });
        } catch (err) {
          await m.reply("❌ Failed to create shadow logo!");
        }
        break;
      
      default:
        break;
    }
  }
};