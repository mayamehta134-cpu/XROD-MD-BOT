const fs = require('fs');
const path = require('path');

// Settings database path
const settingsDbPath = path.join(__dirname, '../database/settings.json');

function initSettingsDB() {
  if (!fs.existsSync(path.join(__dirname, '../database'))) {
    fs.mkdirSync(path.join(__dirname, '../database'), { recursive: true });
  }
  if (!fs.existsSync(settingsDbPath)) {
    const defaultSettings = {
      prefix: ".",
      mode: "public",
      autoread: false,
      autobio: false,
      antidelete: false,
      antispam: false,
      antilinkgrp: false,
      onlyowner: false,
      leavegroup: false,
      welcomemsg: "Welcome @user to the group! 🎉",
      goodbyemsg: "Goodbye @user, we will miss you! 👋"
    };
    fs.writeFileSync(settingsDbPath, JSON.stringify(defaultSettings, null, 2));
  }
  return JSON.parse(fs.readFileSync(settingsDbPath));
}

function saveSettings(settings) {
  fs.writeFileSync(settingsDbPath, JSON.stringify(settings, null, 2));
}

function updateSetting(key, value) {
  const settings = initSettingsDB();
  settings[key] = value;
  saveSettings(settings);
  return settings;
}

function getSetting(key) {
  const settings = initSettingsDB();
  return settings[key];
}

module.exports = {
  name: "settings",
  alias: ["setprefix", "setmode", "autoread", "autobio", "antidelete", "antispam", "antilinkgrp", "onlyowner", "leavegroup", "welcomemsg", "settingsmenu"],
  category: "owner",
  use: ".setprefix ! or .setmode private or .settingsmenu",
  async run({ XROD, m, inputCMD, text, from, isOwner, isGroup, isAdmin }) {
    
    const prefix = getSetting("prefix");
    
    // Owner check for all commands except settingsmenu
    if (inputCMD !== "settingsmenu" && !isOwner) {
      return m.reply("❌ *Access Denied!*\n\nOnly bot owner can use settings commands.");
    }
    
    switch (inputCMD) {
      
      // ⚙️ SETTINGS MENU
      case "settingsmenu":
        const currentPrefix = getSetting("prefix");
        const currentMode = getSetting("mode");
        const autoreadStatus = getSetting("autoread") ? "✅ ON" : "❌ OFF";
        const autobioStatus = getSetting("autobio") ? "✅ ON" : "❌ OFF";
        const antideleteStatus = getSetting("antidelete") ? "✅ ON" : "❌ OFF";
        const antispamStatus = getSetting("antispam") ? "✅ ON" : "❌ OFF";
        const antilinkgrpStatus = getSetting("antilinkgrp") ? "✅ ON" : "❌ OFF";
        const onlyownerStatus = getSetting("onlyowner") ? "✅ ON" : "❌ OFF";
        const leavegroupStatus = getSetting("leavegroup") ? "✅ ON" : "❌ OFF";
        
        const menu = `
╭━━━〔 ⚙️ SETTINGS MENU 〕━━━⬣
┃ 📌 *Current Settings*
┃ ${prefix}setprefix - Current: ${currentPrefix}
┃ ${prefix}setmode - Current: ${currentMode}
┃ ${prefix}autoread - ${autoreadStatus}
┃ ${prefix}autobio - ${autobioStatus}
┃ ${prefix}antidelete - ${antideleteStatus}
┃ ${prefix}antispam - ${antispamStatus}
┃ ${prefix}antilinkgrp - ${antilinkgrpStatus}
┃ ${prefix}onlyowner - ${onlyownerStatus}
┃ ${prefix}leavegroup - ${leavegroupStatus}
┃ ${prefix}welcomemsg - Set welcome message
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${currentPrefix}setprefix !
${currentPrefix}setmode private
${currentPrefix}autoread on
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 📝 SET PREFIX
      case "setprefix":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}setprefix new_prefix\n\nExample: ${prefix}setprefix !\n\nCurrent prefix: ${getSetting("prefix")}`);
        
        const newPrefix = text;
        updateSetting("prefix", newPrefix);
        await m.reply(`✅ *Prefix changed!*\n\nOld prefix: ${prefix}\nNew prefix: ${newPrefix}\n\nUse ${newPrefix}help for commands.`);
        break;
      
      // 🔒 SET MODE (Public/Private)
      case "setmode":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}setmode public/private\n\n*Modes:*\n• public - Everyone can use bot\n• private - Only owner can use bot`);
        
        const mode = text.toLowerCase();
        if (mode !== "public" && mode !== "private") {
          return m.reply("❌ Invalid mode! Use 'public' or 'private'");
        }
        
        updateSetting("mode", mode);
        await m.reply(`✅ *Mode changed to ${mode}*\n\n${mode === "public" ? "Everyone can use the bot now." : "Only owner can use the bot now."}`);
        break;
      
      // 👁️ AUTO READ
      case "autoread":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}autoread on/off\n\nCurrent status: ${getSetting("autoread") ? "ON" : "OFF"}`);
        
        const autoreadState = text.toLowerCase();
        if (autoreadState !== "on" && autoreadState !== "off") {
          return m.reply("❌ Use 'on' or 'off'");
        }
        
        updateSetting("autoread", autoreadState === "on");
        await m.reply(`✅ *Auto Read ${autoreadState === "on" ? "enabled" : "disabled"}*\n\nBot will ${autoreadState === "on" ? "automatically mark messages as read" : "not auto-read messages"}.`);
        break;
      
      // 📝 AUTO BIO
      case "autobio":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}autobio on/off\n\nCurrent status: ${getSetting("autobio") ? "ON" : "OFF"}`);
        
        const autobioState = text.toLowerCase();
        if (autobioState !== "on" && autobioState !== "off") {
          return m.reply("❌ Use 'on' or 'off'");
        }
        
        updateSetting("autobio", autobioState === "on");
        
        if (autobioState === "on") {
          // Start auto bio updater
          const updateBio = async () => {
            const now = new Date();
            const time = now.toLocaleTimeString();
            const date = now.toLocaleDateString();
            const botName = "XROD MD";
            await XROD.updateProfileStatus(`${botName} | ${date} ${time} | Active`);
          };
          updateBio();
          setInterval(updateBio, 60000); // Update every minute
        }
        
        await m.reply(`✅ *Auto Bio ${autobioState === "on" ? "enabled" : "disabled"}*\n\nBot will ${autobioState === "on" ? "automatically update status" : "not auto-update status"}.`);
        break;
      
      // 🗑️ ANTI DELETE
      case "antidelete":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}antidelete on/off\n\nCurrent status: ${getSetting("antidelete") ? "ON" : "OFF"}`);
        
        const antideleteState = text.toLowerCase();
        if (antideleteState !== "on" && antideleteState !== "off") {
          return m.reply("❌ Use 'on' or 'off'");
        }
        
        updateSetting("antidelete", antideleteState === "on");
        await m.reply(`✅ *Anti Delete ${antideleteState === "on" ? "enabled" : "disabled"}*\n\nBot will ${antideleteState === "on" ? "track deleted messages" : "not track deleted messages"}.`);
        break;
      
      // 🚫 ANTI SPAM
      case "antispam":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}antispam on/off\n\nCurrent status: ${getSetting("antispam") ? "ON" : "OFF"}`);
        
        const antispamState = text.toLowerCase();
        if (antispamState !== "on" && antispamState !== "off") {
          return m.reply("❌ Use 'on' or 'off'");
        }
        
        updateSetting("antispam", antispamState === "on");
        await m.reply(`✅ *Anti Spam ${antispamState === "on" ? "enabled" : "disabled"}*\n\nBot will ${antispamState === "on" ? "warn spammers" : "not check for spam"}.`);
        break;
      
      // 🔗 ANTI LINK GROUP
      case "antilinkgrp":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}antilinkgrp on/off\n\nCurrent status: ${getSetting("antilinkgrp") ? "ON" : "OFF"}\n\nWhen enabled, bot will delete links in groups.`);
        
        const antilinkState = text.toLowerCase();
        if (antilinkState !== "on" && antilinkState !== "off") {
          return m.reply("❌ Use 'on' or 'off'");
        }
        
        updateSetting("antilinkgrp", antilinkState === "on");
        await m.reply(`✅ *Anti Link Group ${antilinkState === "on" ? "enabled" : "disabled"}*\n\nBot will ${antilinkState === "on" ? "delete links in groups" : "allow links in groups"}.`);
        break;
      
      // 👑 ONLY OWNER MODE
      case "onlyowner":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}onlyowner on/off\n\nCurrent status: ${getSetting("onlyowner") ? "ON" : "OFF"}\n\nWhen enabled, only owner can use bot in groups.`);
        
        const onlyownerState = text.toLowerCase();
        if (onlyownerState !== "on" && onlyownerState !== "off") {
          return m.reply("❌ Use 'on' or 'off'");
        }
        
        updateSetting("onlyowner", onlyownerState === "on");
        await m.reply(`✅ *Only Owner Mode ${onlyownerState === "on" ? "enabled" : "disabled"}*\n\n${onlyownerState === "on" ? "Only bot owner can use commands in groups." : "Everyone can use commands in groups."}`);
        break;
      
      // 👋 AUTO LEAVE GROUP
      case "leavegroup":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}leavegroup on/off\n\nCurrent status: ${getSetting("leavegroup") ? "ON" : "OFF"}\n\nWhen enabled, bot will automatically leave groups where not admin.`);
        
        const leavegroupState = text.toLowerCase();
        if (leavegroupState !== "on" && leavegroupState !== "off") {
          return m.reply("❌ Use 'on' or 'off'");
        }
        
        updateSetting("leavegroup", leavegroupState === "on");
        await m.reply(`✅ *Auto Leave Group ${leavegroupState === "on" ? "enabled" : "disabled"}*\n\nBot will ${leavegroupState === "on" ? "automatically leave groups where not admin" : "stay in groups"}.`);
        break;
      
      // 💬 SET WELCOME MESSAGE
      case "welcomemsg":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}welcomemsg Your welcome message\n\n*Variables:* @user - mentions the new member\n\nExample: ${prefix}welcomemsg Welcome @user to our group! 🎉\n\nCurrent: ${getSetting("welcomemsg")}`);
        
        updateSetting("welcomemsg", text);
        await m.reply(`✅ *Welcome message set!*\n\nNew welcome message:\n${text}`);
        break;
      
      default:
        break;
    }
  }
};