const fs = require('fs');
const path = require('path');

// Premium database path
const premiumDbPath = path.join(__dirname, '../database/premium.json');

function initPremiumDB() {
  if (!fs.existsSync(path.join(__dirname, '../database'))) {
    fs.mkdirSync(path.join(__dirname, '../database'), { recursive: true });
  }
  if (!fs.existsSync(premiumDbPath)) {
    fs.writeFileSync(premiumDbPath, JSON.stringify({}));
  }
}

function getPremiumData() {
  initPremiumDB();
  return JSON.parse(fs.readFileSync(premiumDbPath));
}

function savePremiumData(data) {
  fs.writeFileSync(premiumDbPath, JSON.stringify(data, null, 2));
}

function isPremium(userId) {
  const data = getPremiumData();
  const user = data[userId];
  if (!user) return false;
  if (user.expiry && user.expiry < Date.now()) {
    // Premium expired
    delete data[userId];
    savePremiumData(data);
    return false;
  }
  return true;
}

function getPremiumExpiry(userId) {
  const data = getPremiumData();
  const user = data[userId];
  if (!user) return null;
  return user.expiry;
}

function addPremium(userId, days) {
  const data = getPremiumData();
  const currentExpiry = data[userId]?.expiry || Date.now();
  const newExpiry = currentExpiry + (days * 24 * 60 * 60 * 1000);
  
  data[userId] = {
    expiry: newExpiry,
    premiumSince: data[userId]?.premiumSince || Date.now(),
    redeemedCodes: data[userId]?.redeemedCodes || []
  };
  savePremiumData(data);
  return newExpiry;
}

function redeemCode(userId, code) {
  const data = getPremiumData();
  
  // Pre-defined premium codes
  const validCodes = {
    "FREE7DAYS": 7,
    "FREE15DAYS": 15,
    "FREE30DAYS": 30,
    "XROD100": 100,
    "XROD365": 365
  };
  
  if (!validCodes[code]) return { success: false, message: "Invalid premium code!" };
  
  const userCodes = data[userId]?.redeemedCodes || [];
  if (userCodes.includes(code)) {
    return { success: false, message: "You have already used this code!" };
  }
  
  const days = validCodes[code];
  addPremium(userId, days);
  
  if (!data[userId]) data[userId] = { redeemedCodes: [] };
  if (!data[userId].redeemedCodes) data[userId].redeemedCodes = [];
  data[userId].redeemedCodes.push(code);
  savePremiumData(data);
  
  return { success: true, message: `✅ Premium activated for ${days} days!`, days };
}

module.exports = {
  name: "premium",
  alias: ["premium", "buy", "redeem", "multiplier", "exclusive", "unlimited", "noads", "priority", "premiummenu"],
  category: "premium",
  use: ".premium or .redeem or .premiummenu",
  async run({ XROD, m, inputCMD, text, from, sender }) {
    
    const prefix = ".";
    const userId = sender.split('@')[0];
    
    switch (inputCMD) {
      
      // 💎 PREMIUM MENU
      case "premiummenu":
        const menu = `
╭━━━〔 💎 PREMIUM MENU 〕━━━⬣
┃ ${prefix}premium - Premium status
┃ ${prefix}buy - Buy premium
┃ ${prefix}redeem - Redeem code
┃ ${prefix}multiplier - Money multiplier
┃ ${prefix}exclusive - Exclusive commands
┃ ${prefix}unlimited - Unlimited usage
┃ ${prefix}noads - No ads
┃ ${prefix}priority - Priority support
╰━━━━━━━━━━━━━━⬣

📌 *Premium Benefits:*
• 2x Money Multiplier in economy
• Access to exclusive commands
• No rate limits
• Priority support
• Early access to new features

📌 *How to get premium:*
• Use ${prefix}redeem FREE7DAYS (free trial)
• Contact owner to buy premium
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 💎 PREMIUM STATUS
      case "premium":
        const premiumStatus = isPremium(userId);
        const expiry = getPremiumExpiry(userId);
        
        if (premiumStatus) {
          const expiryDate = new Date(expiry);
          await m.reply(`
╭━━━〔 💎 PREMIUM STATUS 〕━━━⬣
┃ ✅ *Status:* Active
┃ 👤 *User:* @${userId}
┃ 📅 *Expires:* ${expiryDate.toLocaleDateString()}
┃ ⏰ *Time:* ${expiryDate.toLocaleTimeString()}
╰━━━━━━━━━━━━━━⬣

🎁 *Premium Benefits Activated:*
• 2x Money Multiplier ✅
• Exclusive Commands ✅
• Unlimited Usage ✅
• No Ads ✅
• Priority Support ✅
          `, { mentions: [sender] });
        } else {
          await m.reply(`
╭━━━〔 💎 PREMIUM STATUS 〕━━━⬣
┃ ❌ *Status:* Free User
┃ 👤 *User:* @${userId}
╰━━━━━━━━━━━━━━⬣

🎁 *Premium Benefits:*
• 2x Money Multiplier
• Exclusive Commands
• Unlimited Usage
• No Ads
• Priority Support

📌 *Get Premium:*
• ${prefix}redeem FREE7DAYS (7 days free)
• Contact @owner to buy
          `, { mentions: [sender] });
        }
        break;
      
      // 🛒 BUY PREMIUM
      case "buy":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}buy plan\n\n*Available Plans:*\n• 7 days - $2\n• 30 days - $5\n• 90 days - $12\n• 365 days - $20\n\nContact owner to complete payment.`);
        
        const plans = {
          "7": { days: 7, price: 2 },
          "30": { days: 30, price: 5 },
          "90": { days: 90, price: 12 },
          "365": { days: 365, price: 20 },
          "7days": { days: 7, price: 2 },
          "30days": { days: 30, price: 5 },
          "90days": { days: 90, price: 12 },
          "365days": { days: 365, price: 20 }
        };
        
        const planKey = text.toLowerCase();
        if (!plans[planKey]) {
          return m.reply(`❌ Invalid plan!\n\n*Available Plans:*\n• 7 days - $2\n• 30 days - $5\n• 90 days - $12\n• 365 days - $20`);
        }
        
        const plan = plans[planKey];
        
        await m.reply(`
🛒 *Premium Purchase Request*

📌 *Plan:* ${plan.days} days
💰 *Price:* $${plan.price}

📝 *How to complete purchase:*
1. Send payment to the owner
2. Share transaction screenshot
3. Owner will activate your premium

💳 *Payment Methods:* UPI / Crypto / PayPal

Contact: wa.me/923XXXXXXXXX
        `);
        break;
      
      // 🎫 REDEEM CODE
      case "redeem":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}redeem CODE\n\n*Available Codes:*\n• FREE7DAYS (7 days free)\n• FREE15DAYS (15 days free)\n• FREE30DAYS (30 days free)`);
        
        const code = text.toUpperCase();
        const result = redeemCode(userId, code);
        
        if (result.success) {
          const expiry = getPremiumExpiry(userId);
          const expiryDate = new Date(expiry);
          await m.reply(`✅ *Premium Activated!*\n\n🎉 ${result.message}\n📅 Expires: ${expiryDate.toLocaleDateString()}\n\nEnjoy premium benefits! 🎁`);
        } else {
          await m.reply(`❌ *Redemption Failed!*\n\n${result.message}`);
        }
        break;
      
      // 💰 MONEY MULTIPLIER (For Economy)
      case "multiplier":
        const multiStatus = isPremium(userId);
        
        if (multiStatus) {
          await m.reply(`💰 *Money Multiplier*\n\n✅ *Premium Active!*\n\n📊 Your multiplier: **2x**\n\n• Daily reward: $1000 (instead of $500)\n• Work reward: $400-1000 (instead of $200-500)\n• Crime reward: $1000-6000 (instead of $500-3000)\n\nUpgrade to premium to keep this benefit!`);
        } else {
          await m.reply(`💰 *Money Multiplier*\n\n❌ *Premium Required!*\n\n🎁 Premium users get **2x** money multiplier!\n\n📌 Get premium: ${prefix}redeem FREE7DAYS (7 days free)`);
        }
        break;
      
      // 👑 EXCLUSIVE COMMANDS
      case "exclusive":
        const exclusiveStatus = isPremium(userId);
        
        if (exclusiveStatus) {
          await m.reply(`👑 *Exclusive Premium Commands*\n\n✅ *Premium Active!*\n\n🔓 *Exclusive Commands:*\n• .exclusive - This menu\n• .unlimited - Unlimited usage info\n• .noads - Ad-free experience\n• .priority - Priority support\n• .premium - Premium status\n\n🎮 *Premium Games:*\n• High stakes casino\n• Exclusive boss battles\n• Special events\n\n🎨 *Premium Features:*\n• HD meme templates\n• Custom logo generator\n• AI image generation\n\nMore coming soon!`);
        } else {
          await m.reply(`👑 *Exclusive Premium Commands*\n\n❌ *Premium Required!*\n\nPremium users get access to:\n• Exclusive commands\n• Special games\n• HD templates\n• AI features\n\n📌 Get premium: ${prefix}redeem FREE7DAYS (7 days free)`);
        }
        break;
      
      // 🔓 UNLIMITED USAGE
      case "unlimited":
        const unlimitedStatus = isPremium(userId);
        
        if (unlimitedStatus) {
          await m.reply(`🔓 *Unlimited Usage*\n\n✅ *Premium Active!*\n\n📊 *Your Limits:*\n• Downloader: Unlimited\n• AI Commands: Unlimited\n• Media Tools: Unlimited\n• Games: Unlimited\n\nNo rate limits! Enjoy! 🎉`);
        } else {
          await m.reply(`🔓 *Unlimited Usage*\n\n❌ *Premium Required!*\n\nFree users have limits:\n• Downloader: 10/day\n• AI: 5/day\n• Media: 15/day\n\n📌 Upgrade to premium for unlimited access!`);
        }
        break;
      
      // 🚫 NO ADS
      case "noads":
        const noadsStatus = isPremium(userId);
        
        if (noadsStatus) {
          await m.reply(`🚫 *Ad-Free Experience*\n\n✅ *Premium Active!*\n\n🎯 You won't see any ads while using the bot!\n\n• No promotional messages\n• Clean experience\n• Faster responses\n\nEnjoy your ad-free experience! 🎉`);
        } else {
          await m.reply(`🚫 *Ad-Free Experience*\n\n❌ *Premium Required!*\n\nPremium users get:\n• No ads\n• Clean interface\n• Faster responses\n\n📌 Get premium for ad-free experience!`);
        }
        break;
      
      // ⚡ PRIORITY SUPPORT
      case "priority":
        const priorityStatus = isPremium(userId);
        
        if (priorityStatus) {
          await m.reply(`⚡ *Priority Support*\n\n✅ *Premium Active!*\n\n🎯 You get priority support:\n• Faster response time\n• Direct access to owner\n• Bug fixes priority\n• Feature requests priority\n\nContact owner: wa.me/923XXXXXXXXX`);
        } else {
          await m.reply(`⚡ *Priority Support*\n\n❌ *Premium Required!*\n\nPremium users get:\n• Priority support\n• Direct owner access\n• Faster bug fixes\n\n📌 Get premium for priority support!`);
        }
        break;
      
      default:
        break;
    }
  }
};