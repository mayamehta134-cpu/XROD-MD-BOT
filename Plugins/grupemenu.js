const fs = require('fs');
const path = require('path');

// Database for warns and settings
const dbPath = path.join(__dirname, '../database/group.json');

function initDB() {
  if (!fs.existsSync(path.join(__dirname, '../database'))) {
    fs.mkdirSync(path.join(__dirname, '../database'), { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
}

function getGroupData(groupId) {
  initDB();
  const data = JSON.parse(fs.readFileSync(dbPath));
  if (!data[groupId]) {
    data[groupId] = {
      warns: {},
      settings: {
        antilink: false,
        nsfw: false,
        welcome: "",
        goodbye: ""
      }
    };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }
  return data[groupId];
}

function saveGroupData(groupId, groupData) {
  const data = JSON.parse(fs.readFileSync(dbPath));
  data[groupId] = groupData;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "group",
  alias: ["tagall", "tagadmin", "hidetag", "promote", "demote", "kick", "add", "warn", "warns", "delwarn", "resetwarn", "setwelcome", "setgoodbye", "antilink", "nsfw", "groupmenu"],
  category: "group",
  use: ".tagall or .promote or .groupmenu",
  async run({ XROD, m, inputCMD, text, from, isGroup, isOwner, isAdmin, botAdmin, sender }) {
    
    const prefix = ".";
    const userId = sender.split('@')[0];
    
    // Check if in group
    if (!isGroup && inputCMD !== "groupmenu") {
      return m.reply("❌ This command can only be used in groups!");
    }
    
    switch (inputCMD) {
      
      // 👥 GROUP MENU
      case "groupmenu":
        const menu = `
╭━━━〔 👥 GROUP MENU 〕━━━⬣
┃ ${prefix}tagall - Mention all
┃ ${prefix}tagadmin - Mention admins
┃ ${prefix}hidetag - Hidden mention
┃ ${prefix}promote - Make admin
┃ ${prefix}demote - Remove admin
┃ ${prefix}kick - Remove member
┃ ${prefix}add - Add member
┃ ${prefix}warn - Warn member
┃ ${prefix}warns - Check warns
┃ ${prefix}delwarn - Remove warn
┃ ${prefix}resetwarn - Reset warns
┃ ${prefix}setwelcome - Welcome msg
┃ ${prefix}setgoodbye - Goodbye msg
┃ ${prefix}antilink - Anti link on/off
┃ ${prefix}nsfw - NSFW on/off
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}tagall Hello everyone!
${prefix}promote @user
${prefix}kick @user
${prefix}warn @user reason
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 📢 TAGALL
      case "tagall":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can use this command!");
        
        const groupMeta = await XROD.groupMetadata(from);
        const participants = groupMeta.participants;
        const message = text || "Attention everyone!";
        
        let tagText = `📢 *${message}*\n\n`;
        for (let p of participants) {
          tagText += `@${p.id.split('@')[0]}\n`;
        }
        
        await XROD.sendMessage(from, {
          text: tagText,
          mentions: participants.map(p => p.id)
        });
        break;
      
      // 👑 TAGADMIN
      case "tagadmin":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can use this command!");
        
        const groupMetaAdmin = await XROD.groupMetadata(from);
        const admins = groupMetaAdmin.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        const adminMsg = text || "Admins attention needed!";
        
        let adminText = `👑 *${adminMsg}*\n\n`;
        for (let a of admins) {
          adminText += `@${a.id.split('@')[0]}\n`;
        }
        
        await XROD.sendMessage(from, {
          text: adminText,
          mentions: admins.map(a => a.id)
        });
        break;
      
      // 🙊 HIDETAG
      case "hidetag":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can use this command!");
        
        const groupMetaHide = await XROD.groupMetadata(from);
        const allMembers = groupMetaHide.participants;
        const hideMsg = text || "Message from admin";
        
        await XROD.sendMessage(from, {
          text: hideMsg,
          mentions: allMembers.map(m => m.id)
        });
        break;
      
      // ⬆️ PROMOTE
      case "promote":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can promote members!");
        if (!botAdmin) return m.reply("❌ Bot needs to be admin to promote members!");
        
        const mentionedPromote = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentionedPromote || mentionedPromote.length === 0) {
          return m.reply(`❌ *Usage:* ${prefix}promote @user\n\nExample: ${prefix}promote @username`);
        }
        
        const promoteTarget = mentionedPromote[0];
        
        try {
          await XROD.groupParticipantsUpdate(from, [promoteTarget], "promote");
          await m.reply(`✅ *Promoted!*\n\n@${promoteTarget.split('@')[0]} is now an admin!`, { mentions: [promoteTarget] });
        } catch (err) {
          await m.reply("❌ Failed to promote! Make sure bot is admin.");
        }
        break;
      
      // ⬇️ DEMOTE
      case "demote":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can demote members!");
        if (!botAdmin) return m.reply("❌ Bot needs to be admin to demote members!");
        
        const mentionedDemote = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentionedDemote || mentionedDemote.length === 0) {
          return m.reply(`❌ *Usage:* ${prefix}demote @user\n\nExample: ${prefix}demote @username`);
        }
        
        const demoteTarget = mentionedDemote[0];
        
        try {
          await XROD.groupParticipantsUpdate(from, [demoteTarget], "demote");
          await m.reply(`✅ *Demoted!*\n\n@${demoteTarget.split('@')[0]} is no longer an admin.`, { mentions: [demoteTarget] });
        } catch (err) {
          await m.reply("❌ Failed to demote!");
        }
        break;
      
      // 👢 KICK
      case "kick":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can kick members!");
        if (!botAdmin) return m.reply("❌ Bot needs to be admin to kick members!");
        
        const mentionedKick = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentionedKick || mentionedKick.length === 0) {
          return m.reply(`❌ *Usage:* ${prefix}kick @user\n\nExample: ${prefix}kick @username`);
        }
        
        const kickTarget = mentionedKick[0];
        
        try {
          await XROD.groupParticipantsUpdate(from, [kickTarget], "remove");
          await m.reply(`✅ *Kicked!*\n\n@${kickTarget.split('@')[0]} has been removed from the group.`, { mentions: [kickTarget] });
        } catch (err) {
          await m.reply("❌ Failed to kick member!");
        }
        break;
      
      // ➕ ADD
      case "add":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can add members!");
        if (!botAdmin) return m.reply("❌ Bot needs to be admin to add members!");
        
        if (!text) return m.reply(`❌ *Usage:* ${prefix}add 923xxxxxxxxx\n\nExample: ${prefix}add 923001234567`);
        
        const numberToAdd = text.replace(/\D/g, '');
        if (!numberToAdd.match(/^\d{10,15}$/)) return m.reply("❌ Invalid number! Use country code without +");
        
        const addJid = numberToAdd + "@s.whatsapp.net";
        
        try {
          await XROD.groupParticipantsUpdate(from, [addJid], "add");
          await m.reply(`✅ *Added!*\n\n${numberToAdd} has been added to the group.`);
        } catch (err) {
          await m.reply("❌ Failed to add member! Make sure the number has WhatsApp.");
        }
        break;
      
      // ⚠️ WARN
      case "warn":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can warn members!");
        
        const mentionedWarn = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentionedWarn || mentionedWarn.length === 0) {
          return m.reply(`❌ *Usage:* ${prefix}warn @user reason\n\nExample: ${prefix}warn @user Spamming`);
        }
        
        const warnTarget = mentionedWarn[0];
        const warnReason = text.replace(`@${warnTarget.split('@')[0]}`, '').trim() || "No reason provided";
        
        const groupWarnData = getGroupData(from);
        const userWarns = groupWarnData.warns[warnTarget] || [];
        
        userWarns.push({
          reason: warnReason,
          by: sender,
          time: Date.now()
        });
        
        groupWarnData.warns[warnTarget] = userWarns;
        saveGroupData(from, groupWarnData);
        
        const warnCount = userWarns.length;
        let warnMsg = `⚠️ *Warning!*\n\n@${warnTarget.split('@')[0]} has been warned!\n📝 Reason: ${warnReason}\n📊 Total warns: ${warnCount}/5`;
        
        if (warnCount >= 5) {
          warnMsg += `\n\n❌ *Auto-Kick!* User has reached 5 warns and will be kicked!`;
          try {
            await XROD.groupParticipantsUpdate(from, [warnTarget], "remove");
          } catch(e) {}
        }
        
        await XROD.sendMessage(from, { text: warnMsg, mentions: [warnTarget] });
        break;
      
      // 📊 WARNS CHECK
      case "warns":
        const mentionedCheck = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const checkTarget = (mentionedCheck && mentionedCheck[0]) || sender;
        
        const groupWarnsData = getGroupData(from);
        const userWarnsList = groupWarnsData.warns[checkTarget] || [];
        
        if (userWarnsList.length === 0) {
          await m.reply(`✅ *Clean record!*\n\n@${checkTarget.split('@')[0]} has no warnings.`, { mentions: [checkTarget] });
        } else {
          let warnsText = `⚠️ *Warnings for @${checkTarget.split('@')[0]}*\n\n`;
          for (let i = 0; i < userWarnsList.length; i++) {
            warnsText += `${i+1}. ${userWarnsList[i].reason}\n   By: @${userWarnsList[i].by.split('@')[0]}\n\n`;
          }
          warnsText += `📊 Total: ${userWarnsList.length}/5`;
          await XROD.sendMessage(from, { text: warnsText, mentions: [checkTarget, ...userWarnsList.map(w => w.by)] });
        }
        break;
      
      // 🗑️ DELWARN
      case "delwarn":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can remove warnings!");
        
        const mentionedDel = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentionedDel || mentionedDel.length === 0) {
          return m.reply(`❌ *Usage:* ${prefix}delwarn @user warn_number\n\nExample: ${prefix}delwarn @user 1`);
        }
        
        const delTarget = mentionedDel[0];
        const parts = text.split(' ');
        const warnNum = parseInt(parts[parts.length - 1]);
        
        if (isNaN(warnNum)) return m.reply("❌ Please specify warning number to remove!");
        
        const groupDelData = getGroupData(from);
        const userDelWarns = groupDelData.warns[delTarget] || [];
        
        if (warnNum < 1 || warnNum > userDelWarns.length) {
          return m.reply(`❌ Warning number ${warnNum} not found! User has ${userDelWarns.length} warnings.`);
        }
        
        userDelWarns.splice(warnNum - 1, 1);
        groupDelData.warns[delTarget] = userDelWarns;
        saveGroupData(from, groupDelData);
        
        await m.reply(`✅ *Warning removed!*\n\n@${delTarget.split('@')[0]} now has ${userDelWarns.length} warnings left.`, { mentions: [delTarget] });
        break;
      
      // 🔄 RESETWARN
      case "resetwarn":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can reset warnings!");
        
        const mentionedReset = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentionedReset || mentionedReset.length === 0) {
          return m.reply(`❌ *Usage:* ${prefix}resetwarn @user\n\nExample: ${prefix}resetwarn @username`);
        }
        
        const resetTarget = mentionedReset[0];
        const groupResetData = getGroupData(from);
        groupResetData.warns[resetTarget] = [];
        saveGroupData(from, groupResetData);
        
        await m.reply(`✅ *Warnings reset!*\n\n@${resetTarget.split('@')[0]} has a clean record now.`, { mentions: [resetTarget] });
        break;
      
      // 💬 SETWELCOME
      case "setwelcome":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can set welcome message!");
        
        if (!text) return m.reply(`❌ *Usage:* ${prefix}setwelcome Welcome message\n\nExample: ${prefix}setwelcome Welcome @user to the group!\n\nUse @user to mention the new member.`);
        
        const groupWelcomeData = getGroupData(from);
        groupWelcomeData.settings.welcome = text;
        saveGroupData(from, groupWelcomeData);
        
        await m.reply(`✅ *Welcome message set!*\n\nMessage: ${text}`);
        break;
      
      // 👋 SETGOODBYE
      case "setgoodbye":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can set goodbye message!");
        
        if (!text) return m.reply(`❌ *Usage:* ${prefix}setgoodbye Goodbye message\n\nExample: ${prefix}setgoodbye Goodbye @user, we will miss you!\n\nUse @user to mention the leaving member.`);
        
        const groupGoodbyeData = getGroupData(from);
        groupGoodbyeData.settings.goodbye = text;
        saveGroupData(from, groupGoodbyeData);
        
        await m.reply(`✅ *Goodbye message set!*\n\nMessage: ${text}`);
        break;
      
      // 🔗 ANTILINK
      case "antilink":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can toggle anti-link!");
        
        const groupAntiData = getGroupData(from);
        groupAntiData.settings.antilink = !groupAntiData.settings.antilink;
        saveGroupData(from, groupAntiData);
        
        const antiStatus = groupAntiData.settings.antilink ? "enabled ✅" : "disabled ❌";
        await m.reply(`🔗 *Anti-Link ${antiStatus}*\n\nMembers sending links will be warned or kicked.`);
        break;
      
      // 🔞 NSFW
      case "nsfw":
        if (!isAdmin && !isOwner) return m.reply("❌ Only admins can toggle NSFW mode!");
        
        const groupNsfwData = getGroupData(from);
        groupNsfwData.settings.nsfw = !groupNsfwData.settings.nsfw;
        saveGroupData(from, groupNsfwData);
        
        const nsfwStatus = groupNsfwData.settings.nsfw ? "enabled ✅" : "disabled ❌";
        await m.reply(`🔞 *NSFW Mode ${nsfwStatus}*\n\nNSFW commands can now be used in this group.`);
        break;
      
      default:
        break;
    }
  }
};