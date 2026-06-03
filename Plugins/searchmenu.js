const axios = require('axios');

module.exports = {
  name: "search",
  alias: ["google", "image", "wiki", "lyrics", "weather", "news", "movie", "anime", "manga", "npm", "github", "pypi", "searchmenu"],
  category: "search",
  use: ".google query or .image cat or .searchmenu",
  async run({ XROD, m, inputCMD, text, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 🔍 SEARCH MENU
      case "searchmenu":
        const menu = `
╭━━━〔 🔍 SEARCH MENU 〕━━━⬣
┃ ${prefix}google - Google search
┃ ${prefix}image - Image search
┃ ${prefix}wiki - Wikipedia
┃ ${prefix}lyrics - Song lyrics
┃ ${prefix}weather - Weather info
┃ ${prefix}news - Latest news
┃ ${prefix}movie - Movie info
┃ ${prefix}anime - Anime search
┃ ${prefix}manga - Manga search
┃ ${prefix}npm - NPM package
┃ ${prefix}github - GitHub repo
┃ ${prefix}pypi - PyPI package
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}google What is AI
${prefix}image cute cat
${prefix}weather Mumbai
${prefix}news technology
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 🔍 GOOGLE SEARCH
      case "google":
      case "g":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}google search term\n\nExample: ${prefix}google What is WhatsApp bot`);
        
        await m.reply(`🔍 *Searching Google for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/search/google?q=${encodeURIComponent(text)}`);
          
          if (data && data.result && data.result.length > 0) {
            let results = `🔍 *Google Search Results:*\n📝 *${text}*\n\n`;
            for (let i = 0; i < Math.min(5, data.result.length); i++) {
              results += `${i+1}. *${data.result[i].title}*\n`;
              results += `🔗 ${data.result[i].link}\n`;
              results += `📄 ${data.result[i].description.substring(0, 100)}...\n\n`;
            }
            await m.reply(results);
          } else {
            await m.reply("❌ No results found!");
          }
        } catch (err) {
          await m.reply("❌ Google search error! Try again.");
        }
        break;
      
      // 🖼️ IMAGE SEARCH
      case "image":
      case "img":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}image search term\n\nExample: ${prefix}image cute cat`);
        
        await m.reply(`🔍 *Searching images for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/search/image?q=${encodeURIComponent(text)}`);
          
          if (data && data.result && data.result.length > 0) {
            const images = data.result;
            for (let i = 0; i < Math.min(3, images.length); i++) {
              await XROD.sendMessage(from, {
                image: { url: images[i].url },
                caption: `🖼️ *${text}* - Image ${i+1}`
              });
              await new Promise(r => setTimeout(r, 1000));
            }
          } else {
            await m.reply("❌ No images found!");
          }
        } catch (err) {
          // Fallback to another API
          try {
            const { data } = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(text)}&client_id=YOUR_UNSPLASH_KEY`);
            if (data.results && data.results.length > 0) {
              await XROD.sendMessage(from, {
                image: { url: data.results[0].urls.regular },
                caption: `🖼️ *${text}*\n📸 ${data.results[0].user.name}`
              });
            }
          } catch(e) {
            await m.reply("❌ Image search error! Try again.");
          }
        }
        break;
      
      // 📖 WIKIPEDIA
      case "wiki":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}wiki search term\n\nExample: ${prefix}wiki Albert Einstein`);
        
        await m.reply(`📖 *Searching Wikipedia for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`);
          
          if (data && data.extract) {
            let result = `📖 *Wikipedia: ${data.title}*\n\n${data.extract.substring(0, 1500)}`;
            if (data.content_urls && data.content_urls.desktop) {
              result += `\n\n🔗 Read more: ${data.content_urls.desktop.page}`;
            }
            await m.reply(result);
          } else {
            await m.reply("❌ No Wikipedia page found!");
          }
        } catch (err) {
          await m.reply("❌ Wikipedia search error!");
        }
        break;
      
      // 🎵 SONG LYRICS
      case "lyrics":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}lyrics song name\n\nExample: ${prefix}lyrics Shape of You`);
        
        await m.reply(`🎵 *Searching lyrics for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(text.split(' ')[0])}/${encodeURIComponent(text.split(' ').slice(1).join(' '))}`);
          
          if (data && data.lyrics) {
            let lyrics = data.lyrics;
            if (lyrics.length > 4000) {
              lyrics = lyrics.substring(0, 4000) + "...\n\n[Lyrics truncated]";
            }
            await m.reply(`🎵 *Lyrics: ${text}*\n\n${lyrics}`);
          } else {
            await m.reply("❌ Lyrics not found!");
          }
        } catch (err) {
          await m.reply("❌ Couldn't fetch lyrics! Try another song.");
        }
        break;
      
      // 🌤️ WEATHER
      case "weather":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}weather city name\n\nExample: ${prefix}weather Mumbai`);
        
        await m.reply(`🌤️ *Getting weather for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(text)}?format=j1`);
          
          if (data && data.current_condition) {
            const current = data.current_condition[0];
            const location = data.nearest_area[0];
            
            const result = `
╭━━━〔 🌤️ WEATHER INFO 〕━━━⬣
┃ 📍 *Location:* ${location.areaName[0].value}, ${location.country[0].value}
┃ 🌡️ *Temperature:* ${current.temp_C}°C / ${current.temp_F}°F
┃ 🎯 *Feels Like:* ${current.FeelsLikeC}°C
┃ 💨 *Wind:* ${current.windspeedKmph} km/h
┃ 💧 *Humidity:* ${current.humidity}%
┃ ☁️ *Clouds:* ${current.cloudcover}%
┃ 🌅 *Sunrise:* ${data.weather[0].astronomy[0].sunrise}
┃ 🌇 *Sunset:* ${data.weather[0].astronomy[0].sunset}
╰━━━━━━━━━━━━━━⬣
            `;
            await m.reply(result);
          } else {
            await m.reply("❌ City not found!");
          }
        } catch (err) {
          await m.reply("❌ Weather info error! Try another city.");
        }
        break;
      
      // 📰 NEWS
      case "news":
        const category = text || "general";
        await m.reply(`📰 *Fetching latest ${category} news...*`);
        
        try {
          const { data } = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=5&apikey=YOUR_API_KEY`);
          
          if (data && data.articles && data.articles.length > 0) {
            let newsResult = `📰 *Latest ${category.toUpperCase()} News*\n\n`;
            for (let i = 0; i < Math.min(5, data.articles.length); i++) {
              const article = data.articles[i];
              newsResult += `${i+1}. *${article.title}*\n`;
              newsResult += `📝 ${article.description?.substring(0, 100)}...\n`;
              newsResult += `🔗 ${article.url}\n\n`;
            }
            await m.reply(newsResult);
          } else {
            await m.reply("❌ No news found!");
          }
        } catch (err) {
          // Fallback news
          const fallbackNews = [
            "📰 *Latest News*\n\n1. Technology advances rapidly in 2024\n2. New AI models being developed\n3. Global climate initiatives announced\n\nUse .news technology for specific news",
          ];
          await m.reply(fallbackNews[0]);
        }
        break;
      
      // 🎬 MOVIE INFO
      case "movie":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}movie movie name\n\nExample: ${prefix}movie Inception`);
        
        await m.reply(`🎬 *Searching for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=YOUR_OMDB_KEY`);
          
          if (data && data.Response === "True") {
            const result = `
╭━━━〔 🎬 MOVIE INFO 〕━━━⬣
┃ 🎥 *Title:* ${data.Title}
┃ 📅 *Year:* ${data.Year}
┃ ⭐ *Rated:* ${data.Rated}
┃ 🎭 *Genre:* ${data.Genre}
┃ ⏱️ *Runtime:* ${data.Runtime}
┃ 🎬 *Director:* ${data.Director}
┃ ✍️ *Writer:* ${data.Writer}
┃ 🎭 *Actors:* ${data.Actors}
┃ 📊 *IMDB Rating:* ${data.imdbRating}/10
┃ 📝 *Plot:* ${data.Plot.substring(0, 200)}...
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (data.Poster && data.Poster !== "N/A") {
              await XROD.sendMessage(from, { image: { url: data.Poster }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ Movie not found!");
          }
        } catch (err) {
          await m.reply("❌ Movie search error!");
        }
        break;
      
      // 🎌 ANIME SEARCH
      case "anime":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}anime anime name\n\nExample: ${prefix}anime Naruto`);
        
        await m.reply(`🎌 *Searching for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`);
          
          if (data && data.data && data.data.length > 0) {
            const anime = data.data[0];
            
            const result = `
╭━━━〔 🎌 ANIME INFO 〕━━━⬣
┃ 🎬 *Title:* ${anime.title}
┃ 📅 *Year:* ${anime.year || "N/A"}
┃ ⭐ *Score:* ${anime.score || "N/A"}/10
┃ 🎭 *Genre:* ${anime.genres.map(g => g.name).join(", ")}
┃ 📺 *Episodes:* ${anime.episodes || "N/A"}
┃ 📊 *Status:* ${anime.status}
┃ 📝 *Synopsis:* ${anime.synopsis?.substring(0, 200)}...
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (anime.images?.jpg?.image_url) {
              await XROD.sendMessage(from, { image: { url: anime.images.jpg.image_url }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ Anime not found!");
          }
        } catch (err) {
          await m.reply("❌ Anime search error!");
        }
        break;
      
      // 📖 MANGA SEARCH
      case "manga":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}manga manga name\n\nExample: ${prefix}manga One Piece`);
        
        await m.reply(`📖 *Searching for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(text)}&limit=1`);
          
          if (data && data.data && data.data.length > 0) {
            const manga = data.data[0];
            
            const result = `
╭━━━〔 📖 MANGA INFO 〕━━━⬣
┃ 📚 *Title:* ${manga.title}
┃ 📅 *Year:* ${manga.year || "N/A"}
┃ ⭐ *Score:* ${manga.score || "N/A"}/10
┃ 🎭 *Genre:* ${manga.genres.map(g => g.name).join(", ")}
┃ 📊 *Status:* ${manga.status}
┃ 📝 *Synopsis:* ${manga.synopsis?.substring(0, 200)}...
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (manga.images?.jpg?.image_url) {
              await XROD.sendMessage(from, { image: { url: manga.images.jpg.image_url }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ Manga not found!");
          }
        } catch (err) {
          await m.reply("❌ Manga search error!");
        }
        break;
      
      // 📦 NPM PACKAGE
      case "npm":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}npm package name\n\nExample: ${prefix}npm axios`);
        
        await m.reply(`📦 *Searching NPM for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(text)}`);
          
          if (data) {
            const latest = data['dist-tags']?.latest;
            const version = data.versions[latest];
            
            const result = `
╭━━━〔 📦 NPM PACKAGE 〕━━━⬣
┃ 📦 *Package:* ${data.name}
┃ 🔢 *Version:* ${latest}
┃ 📝 *Description:* ${data.description || "No description"}
┃ 👤 *Author:* ${version.author?.name || "Unknown"}
┃ 📊 *Downloads:* ${version.downloads || "N/A"}
┃ 📁 *Repository:* ${version.repository?.url || "N/A"}
╰━━━━━━━━━━━━━━⬣
            `;
            await m.reply(result);
          } else {
            await m.reply("❌ Package not found!");
          }
        } catch (err) {
          await m.reply("❌ NPM package not found!");
        }
        break;
      
      // 🐙 GITHUB REPO
      case "github":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}github repository\n\nExample: ${prefix}github facebook/react`);
        
        await m.reply(`🐙 *Searching GitHub for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://api.github.com/repos/${encodeURIComponent(text)}`);
          
          if (data) {
            const result = `
╭━━━〔 🐙 GITHUB REPO 〕━━━⬣
┃ 📦 *Repo:* ${data.full_name}
┃ 📝 *Description:* ${data.description || "No description"}
┃ ⭐ *Stars:* ${data.stargazers_count}
┃ 🍴 *Forks:* ${data.forks_count}
┃ 👁️ *Watchers:* ${data.watchers_count}
┃ 🐛 *Issues:* ${data.open_issues}
┃ 📅 *Created:* ${new Date(data.created_at).toLocaleDateString()}
┃ 🔗 *URL:* ${data.html_url}
╰━━━━━━━━━━━━━━⬣
            `;
            await m.reply(result);
          } else {
            await m.reply("❌ Repository not found!");
          }
        } catch (err) {
          await m.reply("❌ GitHub repository not found!");
        }
        break;
      
      // 🐍 PYPI PACKAGE
      case "pypi":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}pypi package name\n\nExample: ${prefix}pypi requests`);
        
        await m.reply(`🐍 *Searching PyPI for "${text}"...*`);
        
        try {
          const { data } = await axios.get(`https://pypi.org/pypi/${encodeURIComponent(text)}/json`);
          
          if (data && data.info) {
            const result = `
╭━━━〔 🐍 PYPI PACKAGE 〕━━━⬣
┃ 📦 *Package:* ${data.info.name}
┃ 🔢 *Version:* ${data.info.version}
┃ 📝 *Description:* ${data.info.summary || "No description"}
┃ 👤 *Author:* ${data.info.author || "Unknown"}
┃ 📄 *License:* ${data.info.license || "Unknown"}
┃ 🔗 *URL:* ${data.info.project_urls?.Homepage || "N/A"}
╰━━━━━━━━━━━━━━⬣
            `;
            await m.reply(result);
          } else {
            await m.reply("❌ Package not found!");
          }
        } catch (err) {
          await m.reply("❌ PyPI package not found!");
        }
        break;
      
      default:
        break;
    }
  }
};