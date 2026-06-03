const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
  name: "owner",
  alias: ["setname", "setbio", "setpp", "broadcast", "block", "unblock", "join", "leave", "del", "restart", "shutdown", "getsession", "fixauth", "ownermenu"],
  category: "owner",
  use: ".setname or .broadcast or .ownermenu",
  async run({ XROD, m, inputCMD, text, from, isOwner, quoted }) {
    
    const prefix = ".";
    
    // Owner check for all commands except ownermenu
    if (inputCMD !== "ownermenu" && !isOwner) {
      return m.reply("❌ *Access Denied!*\n\nOnly bot owner can use this command.");
    }
    
    switch (inputCMD) {
      
      // 👑 OWNER MENU
      case "ownermenu":
        const menu = `
╭━━━〔 👑 OWNER MENU 〕━━━⬣
┃ ${prefix}setname - Set bot name
┃ ${prefix}setbio - Set bot bio
┃ ${prefix}setpp - Set profile pic
┃ ${prefix}broadcast - Send to all
┃ ${prefix}block - Block user
┃ ${prefix}unblock - Unblock user
┃ ${prefix}join - Join group via link
┃ ${prefix}leave - Leave group
┃ ${prefix}del - Delete message
┃ ${prefix}restart - Restart bot
┃ ${prefix}shutdown - Stop bot
┃ ${prefix}getsession - Get session
┃ ${prefix}fixauth - Fix auth error
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}setname XROD BOT
${prefix}broadcast Hello everyone!
${prefix}join https://chat.whatsapp.com/xxx
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 📝 SET BOT NAME
      case "setname":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}setname New Bot Name\n\nExample: ${prefix}setname XROD MD BOT`);
        
        try {
          await XROD.updateProfileName(text);
          await m.reply(`✅ *Bot name updated!*\n\nNew name: ${text}`);
        } catch (err) {
          await m.reply("❌ Failed to update bot name!");
        }
        break;
      
      // 📝 SET BOT BIO
      case "setbio":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}setbio New Bio\n\nExample: ${prefix}setbio WhatsApp Bot by XROD`);
        
        try {
          await XROD.updateProfileStatus(text);
          await m.reply(`✅ *Bot bio updated!*\n\nNew bio: ${text}`);
        } catch (err) {
          await m.reply("❌ Failed to update bot bio!");
        }
        break;
      
      // 🖼️ SET PROFILE PICTURE
      case "setpp":
        let mediaPp;
        
        if (m.quoted && /image/.test(mime)) {
          mediaPp = await XROD.downloadAndSaveMediaMessage(quoted);
        } else if (/image/.test(mime)) {
          mediaPp = await XROD.downloadAndSaveMediaMessage(m);
        } else {
          return m.reply(`❌ Reply to an *image* with *${prefix}setpp*`);
        }
        
        await m.reply("🖼️ *Updating profile picture...*");
        
        try {
          await XROD.updateProfilePicture(from, { url: mediaPp });
          await m.reply("✅ *Profile picture updated!*");
        } catch (err) {
          await m.reply("❌ Failed to update profile picture!");
        }
        
        if (fs.existsSync(mediaPp)) fs.unlinkSync(mediaPp);
        break;
      
      // 📢 BROADCAST (Send to all chats)
      case "broadcast":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}broadcast Your message\n\nExample: ${prefix}broadcast Hello everyone!`);
        
        await m.reply("📢 *Broadcasting message to all chats...*");
        
        try {
          const chats = XROD.chats.all();
          let sent = 0;
          let failed = 0;
          
          for (let chat of chats) {
            try {
              await XROD.sendMessage(chat.id, { text: `📢 *BROADCAST*\n\n${text}` });
              sent++;
              await new Promise(r => setTimeout(r, 1000)); // Delay to avoid rate limit
            } catch(e) {
              failed++;
            }
          }
          
          await m.reply(`✅ *Broadcast completed!*\n\n📨 Sent: ${sent}\n❌ Failed: ${failed}`);
        } catch (err) {
          await m.reply("❌ Failed to broadcast! Try again.");
        }
        break;
      
      // 🚫 BLOCK USER
      case "block":
        const mentionedBlock = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const blockNumber = text?.replace(/\D/g, '');
        
        let blockTarget;
        if (mentionedBlock && mentionedBlock[0]) {
          blockTarget = mentionedBlock[0];
        } else if (blockNumber) {
          blockTarget = blockNumber + "@s.whatsapp.net";
        } else {
          return m.reply(`❌ *Usage:* ${prefix}block @user\nor ${prefix}block 923xxxxxxxxx`);
        }
        
        try {
          await XROD.updateBlockStatus(blockTarget, "block");
          await m.reply(`✅ *Blocked!*\n\nUser: @${blockTarget.split('@')[0]}`, { mentions: [blockTarget] });
        } catch (err) {
          await m.reply("❌ Failed to block user!");
        }
        break;
      
      // 🔓 UNBLOCK USER
      case "unblock":
        const mentionedUnblock = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const unblockNumber = text?.replace(/\D/g, '');
        
        let unblockTarget;
        if (mentionedUnblock && mentionedUnblock[0]) {
          unblockTarget = mentionedUnblock[0];
        } else if (unblockNumber) {
          unblockTarget = unblockNumber + "@s.whatsapp.net";
        } else {
          return m.reply(`❌ *Usage:* ${prefix}unblock @user\nor ${prefix}unblock 923xxxxxxxxx`);
        }
        
        try {
          await XROD.updateBlockStatus(unblockTarget, "unblock");
          await m.reply(`✅ *Unblocked!*\n\nUser: @${unblockTarget.split('@')[0]}`, { mentions: [unblockTarget] });
        } catch (err) {
          await m.reply("❌ Failed to unblock user!");
        }
        break;
      
      // 🔗 JOIN GROUP VIA LINK
      case "join":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}join group_link\n\nExample: ${prefix}join https://chat.whatsapp.com/xxxxx`);
        
        if (!text.includes("chat.whatsapp.com")) {
          return m.reply("❌ Invalid WhatsApp group link!");
        }
        
        await m.reply("🔗 *Joining group...*");
        
        try {
          const code = text.split("chat.whatsapp.com/")[1];
          await XROD.groupAcceptInvite(code);
          await m.reply("✅ *Joined the group successfully!*");
        } catch (err) {
          await m.reply("❌ Failed to join group! Link might be invalid or expired.");
        }
        break;
      
      // 👋 LEAVE GROUP
      case "leave":
        if (!text && !isGroup) {
          return m.reply(`❌ *Usage:* ${prefix}leave group_id\nor use in group to leave that group`);
        }
        
        let leaveTarget = from;
        if (text && text.includes("@g.us")) {
          leaveTarget = text;
        } else if (text) {
          leaveTarget = text + "@g.us";
        }
        
        await m.reply("👋 *Leaving group...*");
        
        try {
          await XROD.groupLeave(leaveTarget);
          if (leaveTarget === from) {
            // Already left, can't send message back
          } else {
            await m.reply("✅ *Left the group!*");
          }
        } catch (err) {
          await m.reply("❌ Failed to leave group!");
        }
        break;
      
      // 🗑️ DELETE MESSAGE
      case "del":
        if (!m.quoted) return m.reply(`❌ Reply to a message with *${prefix}del* to delete it.`);
        
        try {
          const key = m.quoted.key;
          await XROD.sendMessage(from, { delete: key });
          await m.reply("✅ *Message deleted!*");
        } catch (err) {
          await m.reply("❌ Failed to delete message!");
        }
        break;
      
      // 🔄 RESTART BOT
      case "restart":
        await m.reply("🔄 *Restarting bot...*");
        
        setTimeout(() => {
          process.exit(0);
        }, 2000);
        break;
      
      // 🛑 SHUTDOWN BOT
      case "shutdown":
        await m.reply("🛑 *Shutting down bot...*");
        
        setTimeout(() => {
          process.exit(0);
        }, 2000);
        break;
      
      // 📦 GET SESSION
      case "getsession":
        await m.reply("📦 *Sending session files...*");
        
        const authPath = path.join(__dirname, '../auth_info_baileys');
        
        if (!fs.existsSync(authPath)) {
          return m.reply("❌ No session found!");
        }
        
        try {
          const files = fs.readdirSync(authPath);
          for (let file of files) {
            const filePath = path.join(authPath, file);
            if (fs.statSync(filePath).isFile() && file.endsWith('.json')) {
              await XROD.sendMessage(from, {
                document: fs.readFileSync(filePath),
                fileName: file,
                mimetype: "application/json"
              });
              await new Promise(r => setTimeout(r, 1000));
            }
          }
          await m.reply("✅ *Session files sent!*");
        } catch (err) {
          await m.reply("❌ Failed to send session files!");
        }
        break;
      
      // 🔧 FIX AUTH ERROR
      case "fixauth":
        await m.reply("🔧 *Fixing auth error...*\n\nDeleting old session...");
        
        const authPathFix = path.join(__dirname, '../auth_info_baileys');
        
        try {
          if (fs.existsSync(authPathFix)) {
            fs.rmSync(authPathFix, { recursive: true, force: true });
            await m.reply("✅ *Session deleted!*\n\n🔄 Please restart the bot to get new QR code.");
          } else {
            await m.reply("❌ No session found to fix!");
          }
        } catch (err) {
          await m.reply("❌ Failed to fix auth error!");
        }
        break;
      
      default:
        break;
    }
  }
};