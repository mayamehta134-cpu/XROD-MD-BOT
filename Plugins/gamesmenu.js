const axios = require('axios');

// Store active game sessions
const activeGames = new Map();

module.exports = {
  name: "games",
  alias: ["rps", "suspect", "math", "word", "quiz", "trivia", "typing", "fastclick", "guess", "battle", "hunt", "fish", "mine", "adventure", "gamesmenu"],
  category: "games",
  use: ".rps or .quiz or .gamesmenu",
  async run({ XROD, m, inputCMD, text, from, sender }) {
    
    const prefix = ".";
    const userId = sender.split('@')[0];
    
    switch (inputCMD) {
      
      // 🏆 GAMES MENU
      case "gamesmenu":
        const menu = `
╭━━━〔 🏆 GAMES MENU 〕━━━⬣
┃ ${prefix}rps - Rock paper scissor
┃ ${prefix}suspect - Who is sus?
┃ ${prefix}math - Math quiz
┃ ${prefix}word - Word puzzle
┃ ${prefix}quiz - Quiz game
┃ ${prefix}trivia - Trivia game
┃ ${prefix}typing - Typing speed
┃ ${prefix}fastclick - Click speed
┃ ${prefix}guess - Guess number
┃ ${prefix}battle - Fight with bot
┃ ${prefix}hunt - Hunt animals
┃ ${prefix}fish - Go fishing
┃ ${prefix}mine - Mining game
┃ ${prefix}adventure - Adventure
╰━━━━━━━━━━━━━━⬣

📌 *How to play:*
${prefix}rps rock
${prefix}guess 1 100
${prefix}battle
        `;
        await XROD.sendMessage(from, { text: menu });
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
      
      // 🕵️ SUSPECT (Among Us Style)
      case "suspect":
        const suspects = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Black", "White", "Pink", "Brown"];
        const imposter = suspects[Math.floor(Math.random() * suspects.length)];
        const randomSuspect = suspects[Math.floor(Math.random() * suspects.length)];
        
        let susResult;
        if (randomSuspect === imposter) {
          susResult = "✅ *CORRECT!* You found the imposter!";
        } else {
          susResult = `❌ *WRONG!* The imposter was **${imposter}**!`;
        }
        
        await m.reply(`🕵️ *Who Is The Imposter?*\n\n🎭 Among: ${suspects.join(", ")}\n\n🔍 Your guess: ${randomSuspect}\n\n${susResult}`);
        break;
      
      // ➗ MATH QUIZ
      case "math":
        const num1 = Math.floor(Math.random() * 50) + 1;
        const num2 = Math.floor(Math.random() * 50) + 1;
        const operators = ['+', '-', '*'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        
        let correctAnswer;
        if (operator === '+') correctAnswer = num1 + num2;
        else if (operator === '-') correctAnswer = num1 - num2;
        else correctAnswer = num1 * num2;
        
        const userAnswer = parseInt(text);
        
        if (isNaN(userAnswer)) {
          activeGames.set(`${userId}_math`, { answer: correctAnswer, asked: true });
          return m.reply(`🧮 *Math Quiz*\n\n📝 Solve: ${num1} ${operator} ${num2} = ?\n\n*Reply with the answer!*`);
        }
        
        const game = activeGames.get(`${userId}_math`);
        if (game && game.asked) {
          if (userAnswer === game.answer) {
            await m.reply(`✅ *Correct!* ${num1} ${operator} ${num2} = ${correctAnswer}\n🎉 You earned 10 points!`);
          } else {
            await m.reply(`❌ *Wrong!* ${num1} ${operator} ${num2} = ${correctAnswer}\n📚 Better luck next time!`);
          }
          activeGames.delete(`${userId}_math`);
        } else {
          await m.reply(`🧮 *Math Quiz*\n\n${num1} ${operator} ${num2} = ?\n\n*Reply with the number!*`);
          activeGames.set(`${userId}_math`, { answer: correctAnswer, asked: true });
        }
        break;
      
      // 🔤 WORD PUZZLE
      case "word":
        const words = ["APPLE", "BRAIN", "CLOUD", "DREAM", "EAGLE", "FLAME", "GRACE", "HEART", "IMAGE", "JOYFUL"];
        const targetWord = words[Math.floor(Math.random() * words.length)];
        const scrambled = targetWord.split('').sort(() => Math.random() - 0.5).join('');
        
        const userWord = text?.toUpperCase();
        
        if (!userWord) {
          activeGames.set(`${userId}_word`, { word: targetWord, asked: true });
          return m.reply(`🔤 *Word Puzzle*\n\n🔀 Unscramble: *${scrambled}*\n\n*Reply with the correct word!*`);
        }
        
        const wordGame = activeGames.get(`${userId}_word`);
        if (wordGame && wordGame.asked) {
          if (userWord === wordGame.word) {
            await m.reply(`✅ *Correct!* The word is **${wordGame.word}**\n🎉 You earned 20 points!`);
          } else {
            await m.reply(`❌ *Wrong!* The correct word was **${wordGame.word}**`);
          }
          activeGames.delete(`${userId}_word`);
        } else {
          await m.reply(`🔤 *Word Puzzle*\n\n🔀 Unscramble: *${scrambled}*\n\n*Reply with the correct word!*`);
          activeGames.set(`${userId}_word`, { word: targetWord, asked: true });
        }
        break;
      
      // 📚 QUIZ GAME
      case "quiz":
        const quizQuestions = [
          { q: "What is the capital of France?", o: ["London", "Berlin", "Paris", "Madrid"], a: "Paris" },
          { q: "Who painted the Mona Lisa?", o: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], a: "Da Vinci" },
          { q: "What is the largest ocean?", o: ["Atlantic", "Indian", "Arctic", "Pacific"], a: "Pacific" },
          { q: "Who wrote 'Romeo and Juliet'?", o: ["Charles Dickens", "Jane Austen", "Shakespeare", "Hemingway"], a: "Shakespeare" },
          { q: "What is the chemical symbol for Gold?", o: ["Go", "Gd", "Au", "Ag"], a: "Au" }
        ];
        
        const randomQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
        let quizText = `📚 *Quiz Game*\n\n❓ ${randomQuiz.q}\n\n`;
        for (let i = 0; i < randomQuiz.o.length; i++) {
          quizText += `${i+1}. ${randomQuiz.o[i]}\n`;
        }
        quizText += `\n*Reply with the number or answer!*`;
        
        activeGames.set(`${userId}_quiz`, { question: randomQuiz, asked: true });
        await XROD.sendMessage(from, { text: quizText });
        break;
      
      // 🎯 TRIVIA
      case "trivia":
        try {
          const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
          if (data && data.results && data.results[0]) {
            const trivia = data.results[0];
            const allAnswers = [...trivia.incorrect_answers, trivia.correct_answer];
            const shuffled = allAnswers.sort(() => Math.random() - 0.5);
            
            let triviaText = `🎯 *Trivia Game*\n\n❓ ${trivia.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'")}\n\n`;
            for (let i = 0; i < shuffled.length; i++) {
              triviaText += `${i+1}. ${shuffled[i].replace(/&quot;/g, '"').replace(/&#039;/g, "'")}\n`;
            }
            triviaText += `\n*Reply with the number or answer!*`;
            
            activeGames.set(`${userId}_trivia`, { answer: trivia.correct_answer, asked: true });
            await XROD.sendMessage(from, { text: triviaText });
          } else {
            await m.reply("❌ Trivia error! Try .quiz instead.");
          }
        } catch (err) {
          await m.reply("❌ Failed to fetch trivia! Try again.");
        }
        break;
      
      // ⌨️ TYPING SPEED
      case "typing":
        const typingWords = ["beautiful", "programming", "developer", "whatsapp", "keyboard", "challenge", "speed", "practice"];
        const typingTarget = typingWords[Math.floor(Math.random() * typingWords.length)];
        
        const startTime = Date.now();
        activeGames.set(`${userId}_typing`, { word: typingTarget, startTime: startTime, asked: true });
        
        await m.reply(`⌨️ *Typing Speed Challenge*\n\n📝 Type this word: *${typingTarget}*\n\n⏱️ Type it as fast as you can!\n*Reply with the exact word!*`);
        break;
      
      // 👆 FAST CLICK
      case "fastclick":
        await m.reply(`👆 *Fast Click Challenge*\n\n⚡ Type *"click"* as fast as you can!\n\n*First to reply wins!*`);
        activeGames.set(`${userId}_fastclick`, { startTime: Date.now(), asked: true });
        break;
      
      // 🎲 GUESS NUMBER
      case "guess":
        const min = 1;
        const max = 100;
        const secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        
        const userGuess = parseInt(text);
        
        if (isNaN(userGuess)) {
          activeGames.set(`${userId}_guess`, { number: secretNumber, attempts: 0, asked: true });
          return m.reply(`🎲 *Guess The Number*\n\n🔢 Guess a number between ${min} and ${max}\n\n*Reply with your guess!*`);
        }
        
        const guessGame = activeGames.get(`${userId}_guess`);
        if (guessGame && guessGame.asked) {
          guessGame.attempts++;
          
          if (userGuess === guessGame.number) {
            await m.reply(`✅ *Correct!* The number was ${guessGame.number}\n🎯 Guesses: ${guessGame.attempts}\n🎉 You win!`);
            activeGames.delete(`${userId}_guess`);
          } else if (userGuess < guessGame.number) {
            await m.reply(`📈 *Too low!* Try a higher number. (Attempts: ${guessGame.attempts})`);
          } else {
            await m.reply(`📉 *Too high!* Try a lower number. (Attempts: ${guessGame.attempts})`);
          }
        } else {
          await m.reply(`🎲 *Guess The Number*\n\n🔢 Guess a number between 1 and 100\n\n*Reply with your guess!*`);
          activeGames.set(`${userId}_guess`, { number: secretNumber, attempts: 0, asked: true });
        }
        break;
      
      // ⚔️ BATTLE
      case "battle":
        let userHP = 100;
        let botHP = 100;
        let battleActive = true;
        
        const battleMoves = ["👊 Punch", "🦵 Kick", "🗡️ Sword", "✨ Magic", "💥 Special"];
        
        if (!activeGames.has(`${userId}_battle`)) {
          activeGames.set(`${userId}_battle`, { userHP, botHP, active: true });
          return m.reply(`⚔️ *Battle Started!*\n\n👤 You: ❤️ ${userHP} HP\n🤖 Bot: ❤️ ${botHP} HP\n\n*Available moves:*\n${battleMoves.map(m => `• ${m}`).join('\n')}\n\n*Reply with your move!*`);
        }
        
        const battle = activeGames.get(`${userId}_battle`);
        if (!battle.active) return m.reply("❌ No active battle! Start a new one with `.battle`");
        
        const userMove = text;
        const botMove = battleMoves[Math.floor(Math.random() * battleMoves.length)];
        
        const userDamage = Math.floor(Math.random() * 20) + 10;
        const botDamage = Math.floor(Math.random() * 20) + 10;
        
        battle.botHP -= userDamage;
        battle.userHP -= botDamage;
        
        let battleResult = `⚔️ *Battle*\n\n👤 You used: ${userMove || "Attack"} (Damage: ${userDamage})\n🤖 Bot used: ${botMove} (Damage: ${botDamage})\n\n`;
        battleResult += `👤 Your HP: ❤️ ${Math.max(0, battle.userHP)}\n🤖 Bot HP: ❤️ ${Math.max(0, battle.botHP)}\n\n`;
        
        if (battle.botHP <= 0) {
          battleResult += `🎉 *You won the battle!* 🎉`;
          activeGames.delete(`${userId}_battle`);
        } else if (battle.userHP <= 0) {
          battleResult += `💀 *You lost the battle!* Better luck next time.`;
          activeGames.delete(`${userId}_battle`);
        } else {
          battleResult += `*Continue fighting! Reply with your next move.*`;
          activeGames.set(`${userId}_battle`, battle);
        }
        
        await m.reply(battleResult);
        break;
      
      // 🦌 HUNT
      case "hunt":
        const animals = ["🐅 Tiger", "🦁 Lion", "🐺 Wolf", "🐗 Boar", "🦌 Deer", "🐇 Rabbit", "🦊 Fox", "🐻 Bear"];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const huntSuccess = Math.random() < 0.6;
        
        if (huntSuccess) {
          const reward = Math.floor(Math.random() * 100) + 50;
          await m.reply(`🏹 *Hunting*\n\nYou hunted a ${animal}!\n💰 Reward: $${reward}\n✅ Success!`);
        } else {
          await m.reply(`🏹 *Hunting*\n\nYou tried to hunt a ${animal}... but it escaped!\n❌ Better luck next time.`);
        }
        break;
      
      // 🎣 FISH
      case "fish":
        const fishes = ["🐟 Salmon", "🐠 Goldfish", "🐡 Pufferfish", "🦈 Shark", "🐙 Octopus", "🦑 Squid", "🐋 Whale", "🐬 Dolphin"];
        const fish = fishes[Math.floor(Math.random() * fishes.length)];
        const fishSuccess = Math.random() < 0.7;
        
        if (fishSuccess) {
          const fishReward = Math.floor(Math.random() * 80) + 30;
          await m.reply(`🎣 *Fishing*\n\nYou caught a ${fish}!\n💰 Reward: $${fishReward}\n✅ Nice catch!`);
        } else {
          await m.reply(`🎣 *Fishing*\n\nYou waited for hours... nothing bit!\n❌ Try again.`);
        }
        break;
      
      // ⛏️ MINE
      case "mine":
        const ores = ["🪨 Stone", "⛏️ Coal", "🟤 Iron", "🟡 Gold", "💎 Diamond", "🔮 Ruby", "💙 Sapphire", "💜 Amethyst"];
        const ore = ores[Math.floor(Math.random() * ores.length)];
        const mineSuccess = Math.random() < 0.5;
        
        let oreValue = 0;
        if (ore.includes("Coal")) oreValue = 20;
        else if (ore.includes("Iron")) oreValue = 50;
        else if (ore.includes("Gold")) oreValue = 150;
        else if (ore.includes("Diamond")) oreValue = 500;
        else if (ore.includes("Ruby") || ore.includes("Sapphire") || ore.includes("Amethyst")) oreValue = 300;
        else oreValue = 10;
        
        if (mineSuccess) {
          await m.reply(`⛏️ *Mining*\n\nYou mined: ${ore}\n💰 Value: $${oreValue}\n✅ Profitable day!`);
        } else {
          await m.reply(`⛏️ *Mining*\n\nYou dug all day... found nothing!\n❌ No luck today.`);
        }
        break;
      
      // 🗺️ ADVENTURE
      case "adventure":
        const adventures = [
          { text: "You find a treasure chest! 💰", reward: 200 },
          { text: "A friendly wizard gives you a gift! 🧙", reward: 150 },
          { text: "You discover an ancient ruin! 🏛️", reward: 100 },
          { text: "You help a merchant and get paid! 💵", reward: 80 },
          { text: "You find a magic potion! 🧪", reward: 50 }
        ];
        
        const adventure = adventures[Math.floor(Math.random() * adventures.length)];
        await m.reply(`🗺️ *Adventure*\n\n✨ ${adventure.text}\n💰 Reward: $${adventure.reward}`);
        break;
      
      default:
        // Handle quiz/trivia/typing/fastclick responses
        const quizGame = activeGames.get(`${userId}_quiz`);
        const triviaGame = activeGames.get(`${userId}_trivia`);
        const typingGame = activeGames.get(`${userId}_typing`);
        const fastclickGame = activeGames.get(`${userId}_fastclick`);
        
        if (quizGame && quizGame.asked) {
          const userAns = text;
          const isCorrect = userAns.toLowerCase() === quizGame.question.a.toLowerCase() || 
                           userAns === quizGame.question.o.findIndex(o => o.toLowerCase() === userAns.toLowerCase()) + 1;
          
          if (isCorrect) {
            await m.reply(`✅ *Correct!* The answer is ${quizGame.question.a}\n🎉 You earned 15 points!`);
          } else {
            await m.reply(`❌ *Wrong!* The correct answer is ${quizGame.question.a}`);
          }
          activeGames.delete(`${userId}_quiz`);
        }
        
        else if (triviaGame && triviaGame.asked) {
          const userAns = text;
          if (userAns.toLowerCase() === triviaGame.answer.toLowerCase()) {
            await m.reply(`✅ *Correct!* You got it right! 🎉`);
          } else {
            await m.reply(`❌ *Wrong!* The correct answer is ${triviaGame.answer}`);
          }
          activeGames.delete(`${userId}_trivia`);
        }
        
        else if (typingGame && typingGame.asked) {
          const endTime = Date.now();
          const timeTaken = (endTime - typingGame.startTime) / 1000;
          
          if (text.toLowerCase() === typingGame.word.toLowerCase()) {
            const wpm = Math.round(60 / timeTaken);
            await m.reply(`⌨️ *Typing Speed Result*\n\n✅ Correct!\n⏱️ Time: ${timeTaken.toFixed(2)} seconds\n📊 Speed: ${wpm} WPM\n🎉 Great job!`);
          } else {
            await m.reply(`❌ *Wrong!* You typed "${text}" but the word was "${typingGame.word}"\n📚 Practice more!`);
          }
          activeGames.delete(`${userId}_typing`);
        }
        
        else if (fastclickGame && fastclickGame.asked) {
          const clickTime = (Date.now() - fastclickGame.startTime) / 1000;
          await m.reply(`👆 *Fast Click Result*\n\n✅ You clicked!\n⏱️ Reaction time: ${clickTime.toFixed(2)} seconds\n🎯 ${clickTime < 2 ? "Lightning fast! ⚡" : "Good job!"}`);
          activeGames.delete(`${userId}_fastclick`);
        }
        
        break;
    }
  }
};