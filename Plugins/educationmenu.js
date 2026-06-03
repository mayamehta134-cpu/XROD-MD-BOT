const axios = require('axios');

module.exports = {
  name: "education",
  alias: ["wiki", "dictionary", "synonym", "antonym", "translate", "grammar", "spell", "maths", "physics", "chemistry", "biology", "history", "gk", "quiz", "educationmenu"],
  category: "education",
  use: ".wiki query or .dictionary word or .educationmenu",
  async run({ XROD, m, inputCMD, text, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 📚 EDUCATION MENU
      case "educationmenu":
        const menu = `
╭━━━〔 📚 EDUCATION MENU 〕━━━⬣
┃ ${prefix}wiki - Wikipedia
┃ ${prefix}dictionary - Dictionary
┃ ${prefix}synonym - Synonyms
┃ ${prefix}antonym - Antonyms
┃ ${prefix}translate - Translate
┃ ${prefix}grammar - Grammar check
┃ ${prefix}spell - Spell check
┃ ${prefix}maths - Math solver
┃ ${prefix}physics - Physics help
┃ ${prefix}chemistry - Chemistry help
┃ ${prefix}biology - Biology help
┃ ${prefix}history - History facts
┃ ${prefix}gk - General knowledge
┃ ${prefix}quiz - Educational quiz
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}wiki Albert Einstein
${prefix}dictionary love
${prefix}translate en:fr Hello
${prefix}maths 25+30
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 📖 WIKIPEDIA
      case "wiki":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}wiki search_term\n\nExample: ${prefix}wiki Albert Einstein`);
        
        await m.reply("🔍 *Searching Wikipedia...*");
        
        try {
          const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`);
          if (data && data.extract) {
            let result = `📖 *${data.title}*\n\n${data.extract.substring(0, 1500)}`;
            if (data.content_urls && data.content_urls.desktop) {
              result += `\n\n🔗 Read more: ${data.content_urls.desktop.page}`;
            }
            await m.reply(result);
          } else {
            await m.reply("❌ No Wikipedia page found!");
          }
        } catch (err) {
          await m.reply("❌ No results found! Try different keywords.");
        }
        break;
      
      // 📘 DICTIONARY
      case "dictionary":
      case "dict":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}dictionary word\n\nExample: ${prefix}dictionary love`);
        
        await m.reply("📖 *Looking up word...*");
        
        try {
          const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
          if (data && data[0]) {
            const wordData = data[0];
            let meaning = wordData.meanings[0];
            let definition = meaning.definitions[0];
            
            let result = `📘 *${wordData.word}*\n`;
            result += `🎯 *Part of Speech:* ${meaning.partOfSpeech}\n`;
            result += `📝 *Definition:* ${definition.definition}\n`;
            if (definition.example) result += `💡 *Example:* ${definition.example}\n`;
            if (wordData.phonetic) result += `🔊 *Pronunciation:* ${wordData.phonetic}\n`;
            
            await m.reply(result);
          } else {
            await m.reply("❌ Word not found!");
          }
        } catch (err) {
          await m.reply("❌ Word not found in dictionary!");
        }
        break;
      
      // 🔄 SYNONYMS
      case "synonym":
      case "synonyms":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}synonym word\n\nExample: ${prefix}synonym happy`);
        
        await m.reply("🔍 *Finding synonyms...*");
        
        try {
          const { data } = await axios.get(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(text)}&max=10`);
          if (data && data.length > 0) {
            const synonyms = data.map(s => s.word).join(", ");
            await m.reply(`📝 *Synonyms for "${text}":*\n\n${synonyms}`);
          } else {
            await m.reply("❌ No synonyms found!");
          }
        } catch (err) {
          await m.reply("❌ Error finding synonyms!");
        }
        break;
      
      // 🔄 ANTONYMS
      case "antonym":
      case "antonyms":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}antonym word\n\nExample: ${prefix}antonym good`);
        
        await m.reply("🔍 *Finding antonyms...*");
        
        try {
          const { data } = await axios.get(`https://api.datamuse.com/words?rel_ant=${encodeURIComponent(text)}&max=10`);
          if (data && data.length > 0) {
            const antonyms = data.map(a => a.word).join(", ");
            await m.reply(`📝 *Antonyms for "${text}":*\n\n${antonyms}`);
          } else {
            await m.reply("❌ No antonyms found!");
          }
        } catch (err) {
          await m.reply("❌ Error finding antonyms!");
        }
        break;
      
      // 🌐 TRANSLATE
      case "translate":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}translate source:target text\n\nExample: ${prefix}translate en:hi Hello\n\n*Language codes:* en, hi, ur, es, fr, de, ar, zh, ja, ru`);
        
        await m.reply("🌐 *Translating...*");
        
        let langPart = text.split(' ')[0];
        let textToTranslate = text.substring(langPart.length + 1);
        
        if (!langPart.includes(':') || !textToTranslate) {
          return m.reply(`❌ *Usage:* ${prefix}translate en:hi Hello\n\n*Language codes:* en(English), hi(Hindi), ur(Urdu), es(Spanish), fr(French), de(German), ar(Arabic), zh(Chinese), ja(Japanese), ru(Russian)`);
        }
        
        const [source, target] = langPart.split(':');
        
        try {
          const { data } = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${source}|${target}`);
          if (data && data.responseData && data.responseData.translatedText) {
            await m.reply(`🌐 *Translation:*\n\n📝 Original: ${textToTranslate}\n✅ Translated: ${data.responseData.translatedText}`);
          } else {
            await m.reply("❌ Translation failed!");
          }
        } catch (err) {
          await m.reply("❌ Translation error!");
        }
        break;
      
      // ✅ GRAMMAR CHECK
      case "grammar":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}grammar sentence\n\nExample: ${prefix}grammar She go to school everyday`);
        
        await m.reply("🔍 *Checking grammar...*");
        
        try {
          const { data } = await axios.post('https://api.languagetool.org/v2/check', 
            new URLSearchParams({
              text: text,
              language: 'en-US'
            }), {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
          );
          
          if (data && data.matches && data.matches.length > 0) {
            let result = `📝 *Grammar Check Results:*\n\nOriginal: "${text}"\n\n`;
            for (let i = 0; i < Math.min(3, data.matches.length); i++) {
              const match = data.matches[i];
              result += `❌ *Issue ${i+1}:* ${match.message}\n`;
              result += `💡 *Suggestion:* ${match.replacements[0]?.value || 'No suggestion'}\n\n`;
            }
            await m.reply(result);
          } else {
            await m.reply("✅ *Good!* No grammar issues found.");
          }
        } catch (err) {
          await m.reply("❌ Grammar check error! Try again.");
        }
        break;
      
      // 🔤 SPELL CHECK
      case "spell":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}spell word\n\nExample: ${prefix}spell recieve`);
        
        await m.reply("🔍 *Checking spelling...*");
        
        try {
          const { data } = await axios.get(`https://api.datamuse.com/words?sp=${encodeURIComponent(text)}&max=5`);
          if (data && data.length > 0 && data[0].word !== text.toLowerCase()) {
            const suggestions = data.map(s => s.word).join(", ");
            await m.reply(`🔤 *Spell Check for "${text}":*\n\n💡 Did you mean: ${suggestions}`);
          } else {
            await m.reply(`✅ *"${text}"* appears to be spelled correctly!`);
          }
        } catch (err) {
          await m.reply("❌ Spell check error!");
        }
        break;
      
      // ➗ MATHS SOLVER
      case "maths":
      case "math":
      case "solve":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}maths expression\n\nExample: ${prefix}maths 25*4+10/2\n\n*Supports:* +, -, *, /, %, ^, sqrt(), sin(), cos(), tan()`);
        
        await m.reply("🧮 *Calculating...*");
        
        try {
          let expression = text.replace(/[^0-9+\-*/().%^√sincostan]/g, '');
          expression = expression.replace(/\^/g, '**');
          
          const result = eval(expression);
          await m.reply(`📐 *Math Solver*\n\n🔢 Expression: ${text}\n✅ Result: ${result}`);
        } catch (err) {
          await m.reply("❌ Invalid math expression! Use: + - * / ( ) numbers only");
        }
        break;
      
      // ⚛️ PHYSICS HELP
      case "physics":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}physics formula_name\n\n*Available:* velocity, acceleration, force, energy, power, pressure, density, ohm`);
        
        const physicsFormulas = {
          "velocity": "v = s/t\nwhere v = velocity, s = distance, t = time",
          "acceleration": "a = (v-u)/t\na = acceleration, v = final velocity, u = initial velocity, t = time",
          "force": "F = m × a\nF = force (N), m = mass (kg), a = acceleration (m/s²)",
          "energy": "KE = ½ × m × v²\nKE = kinetic energy (J), m = mass (kg), v = velocity (m/s)",
          "power": "P = W/t\nP = power (W), W = work (J), t = time (s)",
          "pressure": "P = F/A\nP = pressure (Pa), F = force (N), A = area (m²)",
          "density": "ρ = m/V\nρ = density (kg/m³), m = mass (kg), V = volume (m³)",
          "ohm": "V = I × R\nV = voltage (V), I = current (A), R = resistance (Ω)"
        };
        
        const query = text.toLowerCase();
        if (physicsFormulas[query]) {
          await m.reply(`⚛️ *Physics Formula: ${query.toUpperCase()}*\n\n📐 ${physicsFormulas[query]}`);
        } else {
          await m.reply(`❌ Formula not found!\n\n*Available:* ${Object.keys(physicsFormulas).join(", ")}`);
        }
        break;
      
      // 🧪 CHEMISTRY HELP
      case "chemistry":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}chemistry element_name\n\nExample: ${prefix}chemistry water\n\n*Available:* water, salt, methane, ammonia, ethanol, glucose`);
        
        const chemistryData = {
          "water": "💧 *Water (H₂O)*\n\n• Universal solvent\n• Boiling point: 100°C\n• Freezing point: 0°C\n• Density: 1 g/cm³",
          "salt": "🧂 *Salt (NaCl)*\n\n• Sodium Chloride\n• Used for seasoning\n• Melting point: 801°C\n• Soluble in water",
          "methane": "🔥 *Methane (CH₄)*\n\n• Natural gas\n• Greenhouse gas\n• Boiling point: -161°C\n• Flammable",
          "ammonia": "🧪 *Ammonia (NH₃)*\n\n• Pungent smell\n• Used in cleaners\n• Boiling point: -33°C\n• Soluble in water",
          "ethanol": "🍺 *Ethanol (C₂H₅OH)*\n\n• Alcohol\n• Boiling point: 78°C\n• Flammable\n• Used in disinfectants",
          "glucose": "🍬 *Glucose (C₆H₁₂O₆)*\n\n• Simple sugar\n• Melting point: 146°C\n• Energy source\n• Soluble in water"
        };
        
        const chemQuery = text.toLowerCase();
        if (chemistryData[chemQuery]) {
          await m.reply(chemistryData[chemQuery]);
        } else {
          await m.reply(`❌ Compound not found!\n\n*Available:* ${Object.keys(chemistryData).join(", ")}`);
        }
        break;
      
      // 🧬 BIOLOGY HELP
      case "biology":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}biology topic\n\nExample: ${prefix}biology photosynthesis\n\n*Available:* photosynthesis, respiration, dna, cell, heart, brain`);
        
        const biologyData = {
          "photosynthesis": "🌿 *Photosynthesis*\n\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\nPlants convert sunlight, CO₂, and water into glucose and oxygen.",
          "respiration": "💨 *Cellular Respiration*\n\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP\n\nCells convert glucose and oxygen into energy.",
          "dna": "🧬 *DNA (Deoxyribonucleic Acid)*\n\n• Contains genetic information\n• Double helix structure\n• Made of nucleotides\n• Found in nucleus",
          "cell": "🔬 *Cell Structure*\n\n• Basic unit of life\n• Contains nucleus, mitochondria, ribosomes\n• Two types: Prokaryotic & Eukaryotic",
          "heart": "❤️ *Human Heart*\n\n• Pumps blood throughout body\n• 4 chambers: atria and ventricles\n• Beats ~100,000 times daily",
          "brain": "🧠 *Human Brain*\n\n• Controls body functions\n• 3 main parts: cerebrum, cerebellum, brainstem\n• ~100 billion neurons"
        };
        
        const bioQuery = text.toLowerCase();
        if (biologyData[bioQuery]) {
          await m.reply(biologyData[bioQuery]);
        } else {
          await m.reply(`❌ Topic not found!\n\n*Available:* ${Object.keys(biologyData).join(", ")}`);
        }
        break;
      
      // 📜 HISTORY FACTS
      case "history":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}history topic\n\nExample: ${prefix}history world war 2`);
        
        await m.reply("📜 *Searching history...*");
        
        try {
          const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`);
          if (data && data.extract) {
            let result = `📜 *Historical Information: ${data.title}*\n\n${data.extract.substring(0, 1000)}`;
            await m.reply(result);
          } else {
            await m.reply("❌ No historical information found!");
          }
        } catch (err) {
          await m.reply("❌ No results found!");
        }
        break;
      
      // 📚 GK (General Knowledge)
      case "gk":
      case "generalknowledge":
        const gkQuestions = [
          { q: "What is the capital of France?", a: "Paris" },
          { q: "Who wrote 'Romeo and Juliet'?", a: "William Shakespeare" },
          { q: "What is the largest ocean on Earth?", a: "Pacific Ocean" },
          { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci" },
          { q: "What is the currency of Japan?", a: "Japanese Yen" },
          { q: "Who discovered penicillin?", a: "Alexander Fleming" },
          { q: "What is the tallest mountain in the world?", a: "Mount Everest" },
          { q: "Who invented the light bulb?", a: "Thomas Edison" },
          { q: "What is the national bird of India?", a: "Peacock" },
          { q: "Who was the first person to walk on the moon?", a: "Neil Armstrong" }
        ];
        
        const randomGK = gkQuestions[Math.floor(Math.random() * gkQuestions.length)];
        await m.reply(`📚 *General Knowledge*\n\n❓ ${randomGK.q}\n\n💡 *Answer:* ${randomGK.a}`);
        break;
      
      // 🎯 EDUCATIONAL QUIZ
      case "quiz":
        const quizQuestions = [
          { q: "What is the chemical symbol for Gold?", o: ["Go", "Gd", "Au", "Ag"], a: "Au" },
          { q: "Who developed the theory of relativity?", o: ["Newton", "Galileo", "Einstein", "Tesla"], a: "Einstein" },
          { q: "What is the square root of 144?", o: ["10", "11", "12", "13"], a: "12" },
          { q: "Which planet is known as the Red Planet?", o: ["Jupiter", "Mars", "Venus", "Saturn"], a: "Mars" },
          { q: "What is the hardest natural substance?", o: ["Iron", "Gold", "Diamond", "Platinum"], a: "Diamond" }
        ];
        
        const randomQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
        let quizText = `🎯 *Educational Quiz*\n\n❓ ${randomQuiz.q}\n\n`;
        for (let i = 0; i < randomQuiz.o.length; i++) {
          quizText += `${i+1}. ${randomQuiz.o[i]}\n`;
        }
        quizText += `\n*Reply with the number or answer!*`;
        
        await XROD.sendMessage(from, { text: quizText });
        break;
      
      default:
        break;
    }
  }
};