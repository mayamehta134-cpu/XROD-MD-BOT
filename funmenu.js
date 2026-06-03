const axios = require('axios');

module.exports = {
  name: "fun",
  alias: ["meme", "joke", "fact", "quote", "8ball", "truth", "dare", "rps", "roll", "coinflip", "pp", "howgay", "howhorny", "howrich", "funmenu"],
  category: "fun",
  use: ".meme or .joke or .funmenu",
  async run({ XROD, m, inputCMD, text, from, sender }) {
    
    const prefix = ".";
    const userMention = sender ? `@${sender.split('@')[0]}` : "User";
    
    switch (inputCMD) {
      
      // 🎮 FUN MENU
      case "funmenu":
        const menu = `
╭━━━〔 🎮 FUN MENU 〕━━━⬣
┃ ${prefix}meme - Random meme
┃ ${prefix}joke - Random joke
┃ ${prefix}fact - Random fact
┃ ${prefix}quote - Random quote
┃ ${prefix}8ball - Magic 8 ball
┃ ${prefix}truth - Truth question
┃ ${prefix}dare - Dare challenge
┃ ${prefix}rps - Rock paper scissor
┃ ${prefix}roll - Roll dice
┃ ${prefix}coinflip - Flip coin
┃ ${prefix}pp - PP size
┃ ${prefix}howgay - Gay percentage
┃ ${prefix}howhorny - Horny meter
┃ ${prefix}howrich - Rich meter
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}meme - Get random meme
${prefix}8ball Will I be rich?
${prefix}rps rock
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 😂 MEME
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
          await m.reply("❌ Meme API error!");
        }
        break;
      
      // 😄 JOKE
      case "joke":
        try {
          const { data } = await axios.get('https://official-joke-api.appspot.com/random_joke');
          if (data) {
            await m.reply(`😂 *Joke Time!*\n\n❓ ${data.setup}\n\n🎉 ${data.punchline}`);
          } else {
            await m.reply("Why don't scientists trust atoms?\nBecause they make up everything! 😄");
          }
        } catch (err) {
          const fallbackJokes = [
            "Why don't skeletons fight each other? They don't have the guts!",
            "What do you call fake spaghetti? An impasta!",
            "Why did the scarecrow win an award? He was outstanding in his field!",
            "Why don't eggs tell jokes? They'd crack each other up!"
          ];
          await m.reply(`😂 *Joke:*\n\n${fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)]}`);
        }
        break;
      
      // 📚 FACT
      case "fact":
        try {
          const { data } = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
          if (data && data.text) {
            await m.reply(`📚 *Random Fact*\n\n${data.text}`);
          } else {
            await m.reply("❌ Fact not found!");
          }
        } catch (err) {
          const facts = [
            "Octopuses have three hearts.",
            "Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs!",
            "A day on Venus is longer than a year on Venus.",
            "Bananas are berries, but strawberries aren't!"
          ];
          await m.reply(`📚 *Random Fact*\n\n${facts[Math.floor(Math.random() * facts.length)]}`);
        }
        break;
      
      // 💬 QUOTE
      case "quote":
        try {
          const { data } = await axios.get('https://zenquotes.io/api/random');
          if (data && data[0]) {
            await m.reply(`💬 *Quote of the moment*\n\n"${data[0].q}"\n\n— ${data[0].a}`);
          } else {
            await m.reply("💬 *Quote*\n\nBe yourself; everyone else is already taken. — Oscar Wilde");
          }
        } catch (err) {
          await m.reply("💬 *Quote*\n\nThe only way to do great work is to love what you do. — Steve Jobs");
        }
        break;
      
      // 🎱 8BALL
      case "8ball":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}8ball your question\n\nExample: ${prefix}8ball Will I be successful?`);
        
        const answers = [
          "🎱 Yes, definitely!", "🎱 No, sorry!", "🎱 Ask again later", "🎱 Don't count on it",
          "🎱 It is certain", "🎱 Very doubtful", "🎱 Signs point to yes", "🎱 My sources say no",
          "🎱 Most likely", "🎱 Outlook not so good", "🎱 Yes!", "🎱 Better not tell you now",
          "🎱 Cannot predict now", "🎱 Concentrate and ask again", "🎱 Without a doubt", "🎱 Reply hazy"
        ];
        const answer = answers[Math.floor(Math.random() * answers.length)];
        await m.reply(`🎱 *Magic 8 Ball*\n\n❓ *Question:* ${text}\n\n✨ *Answer:* ${answer}`);
        break;
      
      // 💖 TRUTH
      case "truth":
        const truths = [
          "What's the biggest lie you've ever told?",
          "Have you ever pretended to be sick to avoid something?",
          "What's something you're insecure about?",
          "What's the most embarrassing thing you've done?",
          "Have you ever lied to your best friend?",
          "What's something you've never told anyone?",
          "What's your biggest fear?",
          "What's the last thing you Googled?",
          "Have you ever broken something and hidden it?",
          "What's something you regret buying?"
        ];
        await m.reply(`💖 *Truth Question*\n\n❓ ${truths[Math.floor(Math.random() * truths.length)]}\n\n*You must answer truthfully!*`);
        break;
      
      // ⚡ DARE
      case "dare":
        const dares = [
          "Send a funny selfie to the group!",
          "Post something embarrassing on your status!",
          "Tell a funny joke!",
          "Do 10 jumping jacks right now!",
          "Send a voice message singing your favorite song!",
          "Change your profile picture for 10 minutes!",
          "Compliment the person above you!",
          "Send a random fact about yourself!",
          "Make a funny face and send a selfie!",
          "Type 'I love bots' 5 times fast!"
        ];
        await m.reply(`⚡ *Dare Challenge*\n\n🎯 ${dares[Math.floor(Math.random() * dares.length)]}\n\n*You must complete this dare!*`);
        break;
      
      // ✊ RPS (Rock Paper Scissors)
      case "rps":
        const choices = ['rock', 'paper', 'scissors'];
        const userChoice = text?.toLowerCase();
        
        if (!choices.includes(userChoice)) {
          return m.reply(`❌ *Usage:* ${prefix}rps rock/paper/scissors\n\nExample: ${prefix}rps rock`);
        }
        
        const botChoice = choices[Math.floor(Math.random() * 3)];
        let result;
        
        if (userChoice === botChoice) {
          result = "Tie! 🤝";
        } else if (
          (userChoice === 'rock' && botChoice === 'scissors') ||
          (userChoice === 'paper' && botChoice === 'rock') ||
          (userChoice === 'scissors' && botChoice === 'paper')
        ) {
          result = "You win! 🎉";
        } else {
          result = "Bot wins! 🤖";
        }
        
        await m.reply(`✊ *Rock Paper Scissors*\n\n👤 You: ${userChoice}\n🤖 Bot: ${botChoice}\n\n🎯 *Result:* ${result}`);
        break;
      
      // 🎲 ROLL DICE
      case "roll":
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        await m.reply(`🎲 *Dice Roll*\n\nYou rolled: ${diceFaces[diceRoll-1]} **${diceRoll}**`);
        break;
      
      // 🪙 COIN FLIP
      case "coinflip":
        const coinResult = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
        await m.reply(`🪙 *Coin Flip*\n\nResult: **${coinResult}**`);
        break;
      
      // 📏 PP SIZE (Fun)
      case "pp":
        const sizes = ["=", "==", "===", "====", "=====", "======"];
        const ppSize = sizes[Math.floor(Math.random() * sizes.length)];
        await m.reply(`📏 *PP Size Meter*\n\n${userMention}'s PP: 8${ppSize}D\n\n*Don't take it seriously!* 😂`);
        break;
      
      // 🏳️‍🌈 HOW GAY
      case "howgay":
        const gayPercent = Math.floor(Math.random() * 101);
        let gayEmoji = "🌈";
        if (gayPercent < 20) gayEmoji = "💪";
        else if (gayPercent < 50) gayEmoji = "😎";
        else if (gayPercent < 80) gayEmoji = "💖";
        else gayEmoji = "🌈✨";
        
        await m.reply(`🏳️‍🌈 *How Gay Are You?*\n\n${userMention} is **${gayPercent}%** gay ${gayEmoji}\n\n*Just for fun!* 😄`);
        break;
      
      // 🔥 HOW HORNY
      case "howhorny":
        const hornyPercent = Math.floor(Math.random() * 101);
        let hornyEmoji = "😇";
        if (hornyPercent < 20) hornyEmoji = "😇";
        else if (hornyPercent < 50) hornyEmoji = "😏";
        else if (hornyPercent < 80) hornyEmoji = "🔥";
        else hornyEmoji = "💀💦";
        
        await m.reply(`🔥 *Horny Meter*\n\n${userMention} is **${hornyPercent}%** horny ${hornyEmoji}\n\n*Just for fun!* 😜`);
        break;
      
      // 💰 HOW RICH
      case "howrich":
        const richPercent = Math.floor(Math.random() * 101);
        let moneyEmoji = "💸";
        if (richPercent < 20) moneyEmoji = "🪙";
        else if (richPercent < 50) moneyEmoji = "💰";
        else if (richPercent < 80) moneyEmoji = "💎";
        else moneyEmoji = "👑";
        
        let wealthStatus = "";
        if (richPercent < 20) wealthStatus = "Poor 🥺";
        else if (richPercent < 50) wealthStatus = "Middle Class 😐";
        else if (richPercent < 80) wealthStatus = "Rich 😎";
        else wealthStatus = "Billionaire 👑";
        
        await m.reply(`💰 *Richness Meter*\n\n${userMention} is **${richPercent}%** rich ${moneyEmoji}\n📊 Status: ${wealthStatus}\n\n*Just for fun!* 😄`);
        break;
      
      default:
        break;
    }
  }
};