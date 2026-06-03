const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../database/economy.json');

// Initialize database if not exists
function initDB() {
  if (!fs.existsSync(path.join(__dirname, '../database'))) {
    fs.mkdirSync(path.join(__dirname, '../database'), { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
}

// Get user data
function getUserData(userId) {
  initDB();
  const data = JSON.parse(fs.readFileSync(dbPath));
  if (!data[userId]) {
    data[userId] = {
      balance: 0,
      inventory: [],
      lastDaily: 0,
      lastWeekly: 0,
      lastMonthly: 0,
      lastWork: 0,
      lastCrime: 0,
      totalEarned: 0,
      totalSpent: 0
    };
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }
  return data[userId];
}

// Save user data
function saveUserData(userId, userData) {
  const data = JSON.parse(fs.readFileSync(dbPath));
  data[userId] = userData;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Format money
function formatMoney(amount) {
  return `💰 $${amount.toLocaleString()}`;
}

module.exports = {
  name: "economy",
  alias: ["balance", "bal", "daily", "weekly", "monthly", "work", "crime", "rob", "steal", "gamble", "slots", "bet", "transfer", "shop", "inventory", "inv", "use", "leaderboard", "lb", "economymenu"],
  category: "economy",
  use: ".balance or .daily or .economymenu",
  async run({ XROD, m, inputCMD, text, from, sender }) {
    
    const prefix = ".";
    const userId = sender.split('@')[0];
    
    switch (inputCMD) {
      
      // 📋 ECONOMY MENU
      case "economymenu":
        const menu = `
╭━━━〔 💰 ECONOMY MENU 〕━━━⬣
┃ ${prefix}balance - Check balance
┃ ${prefix}daily - Daily reward
┃ ${prefix}weekly - Weekly reward
┃ ${prefix}monthly - Monthly reward
┃ ${prefix}work - Work for money
┃ ${prefix}crime - Commit crime
┃ ${prefix}rob - Rob someone
┃ ${prefix}steal - Steal money
┃ ${prefix}gamble - Gamble money
┃ ${prefix}slots - Slot machine
┃ ${prefix}bet - Bet on number
┃ ${prefix}transfer - Send money
┃ ${prefix}shop - Buy items
┃ ${prefix}inventory - My items
┃ ${prefix}use - Use item
┃ ${prefix}leaderboard - Rich list
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}daily - Get daily reward
${prefix}work - Work for money
${prefix}transfer @user 100 - Send money
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 💰 BALANCE
      case "balance":
      case "bal":
        let user = text.split(' ')[0];
        let targetId = userId;
        let targetName = "You";
        
        if (user && user.startsWith('@')) {
          targetId = user.replace('@', '').split('@')[0];
          targetName = `@${targetId}`;
        }
        
        const userData = getUserData(targetId);
        await m.reply(`
╭━━━〔 💰 BALANCE 〕━━━⬣
┃ 👤 *User:* ${targetName}
┃ 💵 *Balance:* ${formatMoney(userData.balance)}
┃ 📊 *Total Earned:* ${formatMoney(userData.totalEarned)}
┃ 💸 *Total Spent:* ${formatMoney(userData.totalSpent)}
╰━━━━━━━━━━━━━━⬣
        `);
        break;
      
      // 📅 DAILY REWARD
      case "daily":
        const dailyData = getUserData(userId);
        const now = Date.now();
        const dailyCooldown = 24 * 60 * 60 * 1000; // 24 hours
        const dailyAmount = 500;
        
        if (dailyData.lastDaily && (now - dailyData.lastDaily) < dailyCooldown) {
          const remaining = Math.ceil((dailyCooldown - (now - dailyData.lastDaily)) / (60 * 60 * 1000));
          return m.reply(`❌ *Daily reward already claimed!*\n⏰ Next reward in: *${remaining} hours*`);
        }
        
        dailyData.balance += dailyAmount;
        dailyData.totalEarned += dailyAmount;
        dailyData.lastDaily = now;
        saveUserData(userId, dailyData);
        
        await m.reply(`✅ *Daily reward claimed!*\n\n💵 You received: ${formatMoney(dailyAmount)}\n💰 New balance: ${formatMoney(dailyData.balance)}`);
        break;
      
      // 📆 WEEKLY REWARD
      case "weekly":
        const weeklyData = getUserData(userId);
        const nowW = Date.now();
        const weeklyCooldown = 7 * 24 * 60 * 60 * 1000;
        const weeklyAmount = 5000;
        
        if (weeklyData.lastWeekly && (nowW - weeklyData.lastWeekly) < weeklyCooldown) {
          const remaining = Math.ceil((weeklyCooldown - (nowW - weeklyData.lastWeekly)) / (24 * 60 * 60 * 1000));
          return m.reply(`❌ *Weekly reward already claimed!*\n⏰ Next reward in: *${remaining} days*`);
        }
        
        weeklyData.balance += weeklyAmount;
        weeklyData.totalEarned += weeklyAmount;
        weeklyData.lastWeekly = nowW;
        saveUserData(userId, weeklyData);
        
        await m.reply(`✅ *Weekly reward claimed!*\n\n💵 You received: ${formatMoney(weeklyAmount)}\n💰 New balance: ${formatMoney(weeklyData.balance)}`);
        break;
      
      // 📅 MONTHLY REWARD
      case "monthly":
        const monthlyData = getUserData(userId);
        const nowM = Date.now();
        const monthlyCooldown = 30 * 24 * 60 * 60 * 1000;
        const monthlyAmount = 25000;
        
        if (monthlyData.lastMonthly && (nowM - monthlyData.lastMonthly) < monthlyCooldown) {
          const remaining = Math.ceil((monthlyCooldown - (nowM - monthlyData.lastMonthly)) / (24 * 60 * 60 * 1000));
          return m.reply(`❌ *Monthly reward already claimed!*\n⏰ Next reward in: *${remaining} days*`);
        }
        
        monthlyData.balance += monthlyAmount;
        monthlyData.totalEarned += monthlyAmount;
        monthlyData.lastMonthly = nowM;
        saveUserData(userId, monthlyData);
        
        await m.reply(`✅ *Monthly reward claimed!*\n\n💵 You received: ${formatMoney(monthlyAmount)}\n💰 New balance: ${formatMoney(monthlyData.balance)}`);
        break;
      
      // 💼 WORK
      case "work":
        const workData = getUserData(userId);
        const nowWork = Date.now();
        const workCooldown = 30 * 60 * 1000; // 30 minutes
        const workAmounts = [200, 250, 300, 350, 400, 450, 500];
        const workAmount = workAmounts[Math.floor(Math.random() * workAmounts.length)];
        
        if (workData.lastWork && (nowWork - workData.lastWork) < workCooldown) {
          const remaining = Math.ceil((workCooldown - (nowWork - workData.lastWork)) / (60 * 1000));
          return m.reply(`❌ *You're tired!*\n⏰ Next work in: *${remaining} minutes*`);
        }
        
        const jobs = ["💻 Programmer", "📝 Writer", "🎨 Designer", "📊 Marketer", "🔧 Mechanic", "🍳 Chef", "📚 Teacher", "👨‍💻 Developer"];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        
        workData.balance += workAmount;
        workData.totalEarned += workAmount;
        workData.lastWork = nowWork;
        saveUserData(userId, workData);
        
        await m.reply(`✅ *Work completed!*\n\n💼 Job: ${job}\n💵 You earned: ${formatMoney(workAmount)}\n💰 New balance: ${formatMoney(workData.balance)}`);
        break;
      
      // 🔫 CRIME
      case "crime":
        const crimeData = getUserData(userId);
        const success = Math.random() < 0.6; // 60% success rate
        const crimeAmounts = [500, 1000, 1500, 2000, 2500, 3000];
        const crimeAmount = crimeAmounts[Math.floor(Math.random() * crimeAmounts.length)];
        const crimes = ["🏦 Robbed a bank", "💎 Stole a diamond", "🚗 Stole a car", "📱 Stole phones", "💰 Pickpocketed", "🏪 Robbed a store"];
        const crime = crimes[Math.floor(Math.random() * crimes.length)];
        
        if (success) {
          crimeData.balance += crimeAmount;
          crimeData.totalEarned += crimeAmount;
          saveUserData(userId, crimeData);
          await m.reply(`✅ *Crime successful!*\n\n🔫 ${crime}\n💵 You got: ${formatMoney(crimeAmount)}\n💰 New balance: ${formatMoney(crimeData.balance)}`);
        } else {
          const penalty = Math.floor(crimeAmount / 2);
          crimeData.balance = Math.max(0, crimeData.balance - penalty);
          saveUserData(userId, crimeData);
          await m.reply(`❌ *Crime failed!*\n\n👮‍♂️ You got caught!\n💸 You lost: ${formatMoney(penalty)}\n💰 New balance: ${formatMoney(crimeData.balance)}`);
        }
        break;
      
      // 👤 ROB SOMEONE
      case "rob":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}rob @user\n\nExample: ${prefix}rob @username`);
        
        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!mentioned || mentioned.length === 0) return m.reply("❌ Please mention someone to rob!");
        
        const targetIdRob = mentioned[0].split('@')[0];
        if (targetIdRob === userId) return m.reply("❌ You cannot rob yourself!");
        
        const robberData = getUserData(userId);
        const victimData = getUserData(targetIdRob);
        
        if (victimData.balance < 100) return m.reply("❌ Target is too poor to rob!");
        
        const robSuccess = Math.random() < 0.4; // 40% success
        const robAmount = Math.min(Math.floor(victimData.balance * 0.3), 5000);
        
        if (robSuccess) {
          robberData.balance += robAmount;
          victimData.balance -= robAmount;
          saveUserData(userId, robberData);
          saveUserData(targetIdRob, victimData);
          await m.reply(`✅ *Robbery successful!*\n\n💵 You stole: ${formatMoney(robAmount)}\n💰 Your balance: ${formatMoney(robberData.balance)}`);
        } else {
          const penaltyRob = Math.floor(robAmount / 2);
          robberData.balance = Math.max(0, robberData.balance - penaltyRob);
          saveUserData(userId, robberData);
          await m.reply(`❌ *Robbery failed!*\n\n👮‍♂️ You got caught and paid a fine!\n💸 You lost: ${formatMoney(penaltyRob)}\n💰 Your balance: ${formatMoney(robberData.balance)}`);
        }
        break;
      
      // 🎲 GAMBLE
      case "gamble":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}gamble amount\n\nExample: ${prefix}gamble 500`);
        
        const gambleAmount = parseInt(text);
        if (isNaN(gambleAmount) || gambleAmount <= 0) return m.reply("❌ Please enter a valid amount!");
        
        const gambleData = getUserData(userId);
        if (gambleData.balance < gambleAmount) return m.reply(`❌ You don't have enough money! Your balance: ${formatMoney(gambleData.balance)}`);
        
        const gambleResult = Math.random() < 0.45; // 45% win
        const gambleWin = gambleAmount * 2;
        
        if (gambleResult) {
          gambleData.balance += gambleAmount;
          gambleData.totalEarned += gambleAmount;
          saveUserData(userId, gambleData);
          await m.reply(`🎲 *You won!*\n\n💵 You won: ${formatMoney(gambleAmount)}\n💰 New balance: ${formatMoney(gambleData.balance)}`);
        } else {
          gambleData.balance -= gambleAmount;
          gambleData.totalSpent += gambleAmount;
          saveUserData(userId, gambleData);
          await m.reply(`🎲 *You lost!*\n\n💸 You lost: ${formatMoney(gambleAmount)}\n💰 New balance: ${formatMoney(gambleData.balance)}`);
        }
        break;
      
      // 🎰 SLOTS
      case "slots":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}slots amount\n\nExample: ${prefix}slots 100`);
        
        const slotBet = parseInt(text);
        if (isNaN(slotBet) || slotBet <= 0) return m.reply("❌ Please enter a valid amount!");
        
        const slotsData = getUserData(userId);
        if (slotsData.balance < slotBet) return m.reply(`❌ Insufficient balance! You have: ${formatMoney(slotsData.balance)}`);
        
        const emojis = ["🍒", "🍊", "🍋", "🍉", "⭐", "💎"];
        const slot1 = emojis[Math.floor(Math.random() * emojis.length)];
        const slot2 = emojis[Math.floor(Math.random() * emojis.length)];
        const slot3 = emojis[Math.floor(Math.random() * emojis.length)];
        
        let multiplier = 0;
        if (slot1 === slot2 && slot2 === slot3) multiplier = 5;
        else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) multiplier = 2;
        else multiplier = 0;
        
        const winnings = slotBet * multiplier;
        
        if (multiplier > 0) {
          slotsData.balance += winnings;
          slotsData.totalEarned += winnings;
          saveUserData(userId, slotsData);
          await m.reply(`🎰 *SLOT MACHINE*\n\n┃ ${slot1} | ${slot2} | ${slot3}\n┃\n✅ *You won!* ×${multiplier}\n💵 Prize: ${formatMoney(winnings)}\n💰 New balance: ${formatMoney(slotsData.balance)}`);
        } else {
          slotsData.balance -= slotBet;
          slotsData.totalSpent += slotBet;
          saveUserData(userId, slotsData);
          await m.reply(`🎰 *SLOT MACHINE*\n\n┃ ${slot1} | ${slot2} | ${slot3}\n┃\n❌ *You lost!*\n💸 Lost: ${formatMoney(slotBet)}\n💰 New balance: ${formatMoney(slotsData.balance)}`);
        }
        break;
      
      // 🎯 BET
      case "bet":
        const parts = text.split(' ');
        if (parts.length < 2) return m.reply(`❌ *Usage:* ${prefix}bet amount number(1-10)\n\nExample: ${prefix}bet 500 7`);
        
        const betAmount = parseInt(parts[0]);
        const betNumber = parseInt(parts[1]);
        
        if (isNaN(betAmount) || betAmount <= 0) return m.reply("❌ Invalid bet amount!");
        if (isNaN(betNumber) || betNumber < 1 || betNumber > 10) return m.reply("❌ Bet on number between 1-10!");
        
        const betData = getUserData(userId);
        if (betData.balance < betAmount) return m.reply(`❌ Insufficient balance! You have: ${formatMoney(betData.balance)}`);
        
        const winningNumber = Math.floor(Math.random() * 10) + 1;
        const won = betNumber === winningNumber;
        
        if (won) {
          const winningsBet = betAmount * 5;
          betData.balance += winningsBet;
          betData.totalEarned += winningsBet;
          saveUserData(userId, betData);
          await m.reply(`🎯 *BET RESULT*\n\n🎲 Winning number: ${winningNumber}\n✅ You bet on: ${betNumber}\n💵 You won: ${formatMoney(winningsBet)}\n💰 New balance: ${formatMoney(betData.balance)}`);
        } else {
          betData.balance -= betAmount;
          betData.totalSpent += betAmount;
          saveUserData(userId, betData);
          await m.reply(`🎯 *BET RESULT*\n\n🎲 Winning number: ${winningNumber}\n❌ You bet on: ${betNumber}\n💸 You lost: ${formatMoney(betAmount)}\n💰 New balance: ${formatMoney(betData.balance)}`);
        }
        break;
      
      // 💸 TRANSFER
      case "transfer":
        const transferParts = text.split(' ');
        if (transferParts.length < 2) return m.reply(`❌ *Usage:* ${prefix}transfer @user amount\n\nExample: ${prefix}transfer @username 500`);
        
        const transferMention = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!transferMention || transferMention.length === 0) return m.reply("❌ Please mention someone to transfer money!");
        
        const transferAmount = parseInt(transferParts[transferParts.length - 1]);
        if (isNaN(transferAmount) || transferAmount <= 0) return m.reply("❌ Invalid transfer amount!");
        
        const senderData = getUserData(userId);
        const receiverId = transferMention[0].split('@')[0];
        const receiverData = getUserData(receiverId);
        
        if (senderData.balance < transferAmount) return m.reply(`❌ Insufficient balance! You have: ${formatMoney(senderData.balance)}`);
        
        senderData.balance -= transferAmount;
        senderData.totalSpent += transferAmount;
        receiverData.balance += transferAmount;
        receiverData.totalEarned += transferAmount;
        
        saveUserData(userId, senderData);
        saveUserData(receiverId, receiverData);
        
        await m.reply(`✅ *Transfer successful!*\n\n💵 Amount: ${formatMoney(transferAmount)}\n👤 To: @${receiverId}\n💰 Your new balance: ${formatMoney(senderData.balance)}`);
        break;
      
      // 🏪 SHOP
      case "shop":
        const shop = `
╭━━━〔 🏪 SHOP 〕━━━⬣
┃ 🎣 *Fishing Rod* - $1000
┃ ⛏️ *Pickaxe* - $2000
┃ 🗡️ *Sword* - $5000
┃ 🛡️ *Shield* - $3000
┃ 💊 *Health Potion* - $500
┃ 🎲 *Lucky Charm* - $10000
┃ 🚀 *Speed Boost* - $8000
╰━━━━━━━━━━━━━━⬣

📌 *How to buy:* ${prefix}buy item_name
Example: ${prefix}buy Fishing Rod
        `;
        await m.reply(shop);
        break;
      
      // 🛒 BUY (from shop)
      case "buy":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}buy item_name\n\nAvailable: Fishing Rod, Pickaxe, Sword, Shield, Health Potion, Lucky Charm, Speed Boost`);
        
        const itemName = text.toLowerCase();
        const itemPrices = {
          "fishing rod": 1000,
          "pickaxe": 2000,
          "sword": 5000,
          "shield": 3000,
          "health potion": 500,
          "lucky charm": 10000,
          "speed boost": 8000
        };
        
        const actualItem = Object.keys(itemPrices).find(key => key === itemName);
        if (!actualItem) return m.reply("❌ Item not found in shop!");
        
        const price = itemPrices[actualItem];
        const buyerData = getUserData(userId);
        
        if (buyerData.balance < price) return m.reply(`❌ Insufficient balance! You need: ${formatMoney(price)}`);
        
        buyerData.balance -= price;
        buyerData.totalSpent += price;
        buyerData.inventory.push(actualItem);
        saveUserData(userId, buyerData);
        
        await m.reply(`✅ *Purchase successful!*\n\n🛒 You bought: *${actualItem}*\n💵 Cost: ${formatMoney(price)}\n💰 New balance: ${formatMoney(buyerData.balance)}`);
        break;
      
      // 📦 INVENTORY
      case "inventory":
      case "inv":
        const invData = getUserData(userId);
        
        if (!invData.inventory || invData.inventory.length === 0) {
          return m.reply("📦 *Your inventory is empty!*\n\nBuy items from the shop using `.buy`");
        }
        
        let invList = "╭━━━〔 📦 INVENTORY 〕━━━⬣\n";
        const itemCount = {};
        for (const item of invData.inventory) {
          itemCount[item] = (itemCount[item] || 0) + 1;
        }
        for (const [item, count] of Object.entries(itemCount)) {
          invList += `┃ 🎮 ${item}: ${count}x\n`;
        }
        invList += "╰━━━━━━━━━━━━━━⬣";
        
        await m.reply(invList);
        break;
      
      // 🎮 USE ITEM
      case "use":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}use item_name\n\nExample: ${prefix}use Health Potion`);
        
        const useItem = text.toLowerCase();
        const useData = getUserData(userId);
        
        const itemIndex = useData.inventory.indexOf(useItem);
        if (itemIndex === -1) return m.reply(`❌ You don't have *${useItem}* in your inventory!`);
        
        useData.inventory.splice(itemIndex, 1);
        
        let effect = "";
        if (useItem === "health potion") {
          effect = "🍎 You restored 50 HP!";
        } else if (useItem === "lucky charm") {
          const bonus = 1000;
          useData.balance += bonus;
          effect = `🍀 Lucky charm activated! You got ${formatMoney(bonus)}!`;
        } else {
          effect = `✅ You used *${useItem}*!`;
        }
        
        saveUserData(userId, useData);
        await m.reply(`✅ *Item used!*\n\n${effect}`);
        break;
      
      // 🏆 LEADERBOARD
      case "leaderboard":
      case "lb":
        const allData = JSON.parse(fs.readFileSync(dbPath));
        const sorted = Object.entries(allData)
          .sort((a, b) => b[1].balance - a[1].balance)
          .slice(0, 10);
        
        let lbText = "╭━━━〔 🏆 RICH LEADERBOARD 〕━━━⬣\n";
        for (let i = 0; i < sorted.length; i++) {
          const [id, data] = sorted[i];
          lbText += `┃ ${i+1}. @${id} - ${formatMoney(data.balance)}\n`;
        }
        lbText += "╰━━━━━━━━━━━━━━⬣";
        
        await XROD.sendMessage(from, { text: lbText, mentions: sorted.map(s => `${s[0]}@s.whatsapp.net`) });
        break;
      
      default:
        break;
    }
  }
};