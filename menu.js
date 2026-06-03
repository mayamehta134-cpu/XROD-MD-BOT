const fs = require('fs');
const path = require('path');

module.exports = {
  name: "menu",
  aliases: ["help", "main"],
  category: "general",
  use: ".menu",
  async run({ conn, message, from, senderName }) {
    
    const now = new Date();
    const date = now.toLocaleDateString('en-IN');
    const time = now.toLocaleTimeString('en-IN');
    const name = senderName || "User";
    
    const menu = `
╭━━━〔 XROD MD BOT 〕━━━⬣
┃ 👑 .ownermenu
┃ 🤖 .aimenu
┃ 🎮 .funmenu
┃ 🔥 .roastmenu
┃ 🎵 .mediamenu
┃ 📥 .downloadmenu
┃ 🔍 .searchmenu
┃ 🛠️ .toolsmenu
┃ 👥 .groupmenu
┃ ⚙️ .settingsmenu
┃ 🎨 .logomenu
┃ 📝 .textpromenu
┃ 😂 .mememenu
┃ 🎲 .randommenu
┃ 💰 .economymenu
┃ 🏆 .gamesmenu
┃ 📊 .stalkmenu
┃ 🌐 .convertmenu
┃ 📚 .educationmenu
┃ 💎 .premiummenu
╰━━━━━━━━━━━━━━⬣

╭━━━〔 INFO 〕━━━⬣
┃ 👤 User : ${name}
┃ 📅 Date : ${date}
┃ ⏰ Time : ${time}
┃ ⚡ Mode : Public
┃ 🤖 Bot : XROD MD
╰━━━━━━━━━━━━━━⬣

> Type .[menu_name] to open any menu
    `;
    
    // Send with image
    const imagePath = path.join(__dirname, '../Assets/iconxrod.jpg');
    try {
      if (fs.existsSync(imagePath)) {
        await conn.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: menu
        });
      } else {
        await conn.sendMessage(from, { text: menu });
      }
    } catch(e) {
      await conn.sendMessage(from, { text: menu });
    }
  }
};