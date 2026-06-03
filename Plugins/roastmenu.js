module.exports = {
  name: "roast",
  alias: ["roast", "insult", "brutal", "savage", "shame", "expose", "roastmenu"],
  category: "fun",
  use: ".roast or .roast @user or .roastmenu",
  async run({ XROD, m, inputCMD, text, from, sender }) {
    
    const prefix = ".";
    const userMention = sender ? `@${sender.split('@')[0]}` : "You";
    
    // Roast collection
    const roasts = [
      "You're proof that evolution can go in reverse.",
      "I'd explain it to you, but I left my crayons at home.",
      "You bring everyone so much joy — when you leave.",
      "Your secrets are safe with me. I wasn't listening anyway.",
      "You're like a cloud. When you disappear, it's a beautiful day.",
      "You're not stupid; you just have bad luck thinking.",
      "Your birth certificate is an apology letter.",
      "You have the right to remain silent. Please use it.",
      "You're not pretty enough to be this dumb.",
      "I've seen salads more exciting than you.",
      "You're like a software update. I see you, but I ignore you.",
      "You're the reason God created middle fingers.",
      "If I wanted to hear from an idiot, I'd watch TikTok.",
      "You're like a broken pencil — pointless.",
      "I'd agree with you, but then we'd both be wrong.",
      "You're not a clown, you're the entire circus.",
      "You're the human equivalent of a participation trophy.",
      "Your brain is like a browser. 15 tabs open and all frozen.",
      "You're like a candle in the wind — useless.",
      "If brains were dynamite, you wouldn't have enough to blow your nose."
    ];
    
    const insults = [
      "You're a waste of oxygen.",
      "You're the reason shampoo has instructions.",
      "I've met rocks with more personality than you.",
      "You're like a Monday morning — nobody likes you.",
      "Your face could make an onion cry.",
      "You're so fake, Facebook is jealous.",
      "You're like a holiday. Nobody wants you to end, but nobody wants you to stay.",
      "You're the human version of a traffic jam.",
      "If you were any more useless, you'd be a screen door on a submarine.",
      "You're like a battery. Negative and not included.",
      "You're like a dictionary — you make no sense.",
      "Your life is like a broken elevator — full of ups and downs.",
      "You're the reason they put instructions on shampoo bottles.",
      "You're like a parking ticket — nobody wants you.",
      "You're the human equivalent of a wet blanket."
    ];
    
    const brutalRoasts = [
      "💀 You're so ugly, when you were born, the doctor slapped your parents.",
      "💀 If you were any more stupid, you'd have to be watered twice a week.",
      "💀 You're like a cloud — when you disappear, it's a beautiful day.",
      "💀 Your family tree must be a cactus because everyone on it is a prick.",
      "💀 You're the reason God created ugly people.",
      "💀 I'd call you a tool, but tools are useful.",
      "💀 You're like a penny — two-faced and worthless.",
      "💀 Your head is like a vacuum cleaner — full of dust and sucking.",
      "💀 If I wanted to kill myself, I'd climb your ego and jump to your IQ.",
      "💀 You're proof that God has a sense of humor."
    ];
    
    const savageRoasts = [
      "⚡ You're so broke, you can't even pay attention.",
      "⚡ Your secrets are safe with me. I don't listen anyway.",
      "⚡ You're like a software update — nobody wants you.",
      "⚡ You're the reason dumb and dumber had a sequel.",
      "⚡ Your life is like a broken pencil — pointless.",
      "⚡ You're the human equivalent of a participation trophy.",
      "⚡ I'd agree with you, but then we'd both be wrong.",
      "⚡ You're like a dictionary — you have no sense.",
      "⚡ Your brain is like a browser — 15 tabs open and all frozen.",
      "⚡ You're the reason they put instructions on everything."
    ];
    
    const shames = [
      "😳 *SHAME!* 🔔\n\nYou have brought dishonor to your family!\n\n*Your punishment:* 10 push-ups!",
      "😳 *SHAME!* 🔔\n\nThe council has judged you... GUILTY of being cringe!\n\n*Sentence:* 5 minutes of silence!",
      "😳 *SHAME!* 🔔\n\nYour ancestors are disappointed!\n\n*Your punishment:* Change profile picture for 1 hour!",
      "😳 *SHAME!* 🔔\n\nYou have been ratio'd by life itself!\n\n*Sentence:* Send 'I am cringe' in group!",
      "😳 *SHAME!* 🔔\n\nYour WiFi is ashamed of you!\n\n*Punishment:* Type 'I'm the problem' 5 times!"
    ];
    
    const exposes = [
      "📢 *EXPOSED!*\n\nThis user still uses Internet Explorer!\n\n*Case closed!* 🔨",
      "📢 *EXPOSED!*\n\nThey think the Earth is flat!\n\n*Evidence: Trust me bro* 🔨",
      "📢 *EXPOSED!*\n\nThey've never touched grass in 3 years!\n\n*Verdict: No bitches?* 🔨",
      "📢 *EXPOSED!*\n\nThey use light mode on everything!\n\n*Arrest them!* 🔨",
      "📢 *EXPOSED!*\n\nThey think pineapple belongs on pizza!\n\n*Straight to jail!* 🔨"
    ];
    
    // Get mentioned user if any
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const targetUser = (mentioned && mentioned[0]) || null;
    const targetName = targetUser ? `@${targetUser.split('@')[0]}` : null;
    
    switch (inputCMD) {
      
      // 🔥 ROAST MENU
      case "roastmenu":
        const menu = `
╭━━━〔 🔥 ROAST MENU 〕━━━⬣
┃ ${prefix}roast - Random roast
┃ ${prefix}insult - Random insult
┃ ${prefix}roast @user - Roast someone
┃ ${prefix}insult @user - Insult someone
┃ ${prefix}brutal - Brutal roast
┃ ${prefix}savage - Savage roast
┃ ${prefix}shame - Shame someone
┃ ${prefix}expose - Expose someone
╰━━━━━━━━━━━━━━⬣

📌 *Examples:*
${prefix}roast
${prefix}roast @user
${prefix}savage
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 🔥 ROAST
      case "roast":
        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
        
        if (targetUser) {
          await XROD.sendMessage(from, {
            text: `🔥 *ROAST OF THE DAY* 🔥\n\n@${targetUser.split('@')[0]}, ${randomRoast.toLowerCase()}`,
            mentions: [targetUser]
          });
        } else {
          await m.reply(`🔥 *ROAST OF THE DAY* 🔥\n\n${randomRoast}`);
        }
        break;
      
      // 😤 INSULT
      case "insult":
        const randomInsult = insults[Math.floor(Math.random() * insults.length)];
        
        if (targetUser) {
          await XROD.sendMessage(from, {
            text: `😤 *INSULT* 😤\n\n@${targetUser.split('@')[0]}, ${randomInsult.toLowerCase()}`,
            mentions: [targetUser]
          });
        } else {
          await m.reply(`😤 *INSULT* 😤\n\n${randomInsult}`);
        }
        break;
      
      // 💀 BRUTAL ROAST
      case "brutal":
        const brutalRoast = brutalRoasts[Math.floor(Math.random() * brutalRoasts.length)];
        
        if (targetUser) {
          await XROD.sendMessage(from, {
            text: `${brutalRoast}\n\n*Target:* @${targetUser.split('@')[0]}`,
            mentions: [targetUser]
          });
        } else {
          await m.reply(brutalRoast);
        }
        break;
      
      // ⚡ SAVAGE ROAST
      case "savage":
        const savageRoast = savageRoasts[Math.floor(Math.random() * savageRoasts.length)];
        
        if (targetUser) {
          await XROD.sendMessage(from, {
            text: `⚡ *SAVAGE MODE* ⚡\n\n${savageRoast}\n\n👉 @${targetUser.split('@')[0]} got destroyed! 👈`,
            mentions: [targetUser]
          });
        } else {
          await m.reply(`⚡ *SAVAGE MODE* ⚡\n\n${savageRoast}`);
        }
        break;
      
      // 😳 SHAME
      case "shame":
        const randomShame = shames[Math.floor(Math.random() * shames.length)];
        
        if (targetUser) {
          await XROD.sendMessage(from, {
            text: `${randomShame}\n\n🎯 *Shamed:* @${targetUser.split('@')[0]}\n\n*🔔 SHAME BELL RINGS* 🔔`,
            mentions: [targetUser]
          });
        } else {
          await m.reply(`${randomShame}\n\n*🔔 SHAME BELL RINGS* 🔔`);
        }
        break;
      
      // 📢 EXPOSE
      case "expose":
        const randomExpose = exposes[Math.floor(Math.random() * exposes.length)];
        
        if (targetUser) {
          await XROD.sendMessage(from, {
            text: `${randomExpose}\n\n👤 *Exposed:* @${targetUser.split('@')[0]}\n\n*CASE CLOSED!* 🔨`,
            mentions: [targetUser]
          });
        } else {
          await m.reply(`${randomExpose}\n\n*CASE CLOSED!* 🔨`);
        }
        break;
      
      default:
        break;
    }
  }
};