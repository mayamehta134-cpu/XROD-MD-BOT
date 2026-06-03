const axios = require('axios');

module.exports = {
  name: "stalk",
  alias: ["igstalk", "githubstalk", "twitterstalk", "tiktokstalk", "ytstalk", "spotifystalk", "npmstalk", "gorestalk", "fbstalk", "stalkmenu"],
  category: "stalk",
  use: ".igstalk username or .githubstalk username or .stalkmenu",
  async run({ XROD, m, inputCMD, text, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 📊 STALK MENU
      case "stalkmenu":
        const menu = `
╭━━━〔 📊 STALK MENU 〕━━━⬣
┃ ${prefix}igstalk - Instagram stalk
┃ ${prefix}githubstalk - GitHub stalk
┃ ${prefix}twitterstalk - Twitter stalk
┃ ${prefix}tiktokstalk - TikTok stalk
┃ ${prefix}ytstalk - YouTube stalk
┃ ${prefix}spotifystalk - Spotify stalk
┃ ${prefix}npmstalk - NPM stalk
┃ ${prefix}gorestalk - Google review
┃ ${prefix}fbstalk - Facebook stalk
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}igstalk username
${prefix}githubstalk username
${prefix}ytstalk @channel
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 📸 INSTAGRAM STALK
      case "igstalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}igstalk username\n\nExample: ${prefix}igstalk cristiano`);
        
        await m.reply(`🔍 *Stalking Instagram user: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/ig?username=${encodeURIComponent(text)}`);
          
          if (data && data.result) {
            const user = data.result;
            const result = `
╭━━━〔 📸 INSTAGRAM STALK 〕━━━⬣
┃ 👤 *Username:* ${user.username}
┃ 📛 *Name:* ${user.full_name || "N/A"}
┃ 📝 *Bio:* ${user.bio || "No bio"}
┃ 🔗 *Followers:* ${user.followers || 0}
┃ 🔗 *Following:* ${user.following || 0}
┃ 📷 *Posts:* ${user.posts || 0}
┃ 🔒 *Private:* ${user.is_private ? "Yes" : "No"}
┃ ✅ *Verified:* ${user.is_verified ? "Yes" : "No"}
┃ 🔗 *Profile:* https://instagram.com/${user.username}
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (user.profile_pic) {
              await XROD.sendMessage(from, { image: { url: user.profile_pic }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ User not found!");
          }
        } catch (err) {
          await m.reply("❌ Instagram stalk error! Username might be incorrect.");
        }
        break;
      
      // 🐙 GITHUB STALK
      case "githubstalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}githubstalk username\n\nExample: ${prefix}githubstalk facebook`);
        
        await m.reply(`🔍 *Stalking GitHub user: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://api.github.com/users/${encodeURIComponent(text)}`);
          
          if (data) {
            const result = `
╭━━━〔 🐙 GITHUB STALK 〕━━━⬣
┃ 👤 *Username:* ${data.login}
┃ 📛 *Name:* ${data.name || "N/A"}
┃ 📝 *Bio:* ${data.bio || "No bio"}
┃ 📍 *Location:* ${data.location || "N/A"}
┃ 📦 *Public Repos:* ${data.public_repos}
┃ 🍴 *Public Gists:* ${data.public_gists}
┃ 👥 *Followers:* ${data.followers}
┃ 🔗 *Following:* ${data.following}
┃ 📅 *Joined:* ${new Date(data.created_at).toLocaleDateString()}
┃ 🔗 *Profile:* ${data.html_url}
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (data.avatar_url) {
              await XROD.sendMessage(from, { image: { url: data.avatar_url }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ User not found!");
          }
        } catch (err) {
          await m.reply("❌ GitHub stalk error!");
        }
        break;
      
      // 🐦 TWITTER STALK
      case "twitterstalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}twitterstalk username\n\nExample: ${prefix}twitterstalk elonmusk`);
        
        await m.reply(`🔍 *Stalking Twitter user: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/twitter?username=${encodeURIComponent(text)}`);
          
          if (data && data.result) {
            const user = data.result;
            const result = `
╭━━━〔 🐦 TWITTER STALK 〕━━━⬣
┃ 👤 *Username:* @${user.username}
┃ 📛 *Name:* ${user.name || "N/A"}
┃ 📝 *Bio:* ${user.bio || "No bio"}
┃ 📍 *Location:* ${user.location || "N/A"}
┃ 🐦 *Tweets:* ${user.tweets || 0}
┃ 👥 *Followers:* ${user.followers || 0}
┃ 🔗 *Following:* ${user.following || 0}
┃ ❤️ *Likes:* ${user.likes || 0}
┃ ✅ *Verified:* ${user.verified ? "Yes" : "No"}
┃ 🔗 *Profile:* https://twitter.com/${user.username}
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (user.avatar) {
              await XROD.sendMessage(from, { image: { url: user.avatar }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ User not found!");
          }
        } catch (err) {
          await m.reply("❌ Twitter stalk error!");
        }
        break;
      
      // 🎵 TIKTOK STALK
      case "tiktokstalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}tiktokstalk username\n\nExample: ${prefix}tiktokstalk tiktok`);
        
        await m.reply(`🔍 *Stalking TikTok user: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(text)}`);
          
          if (data && data.result) {
            const user = data.result;
            const result = `
╭━━━〔 🎵 TIKTOK STALK 〕━━━⬣
┃ 👤 *Username:* @${user.username}
┃ 📛 *Name:* ${user.name || "N/A"}
┃ 📝 *Bio:* ${user.bio || "No bio"}
┃ 👥 *Followers:* ${user.followers || 0}
┃ 🔗 *Following:* ${user.following || 0}
┃ ❤️ *Likes:* ${user.likes || 0}
┃ 🎬 *Videos:* ${user.videos || 0}
┃ ✅ *Verified:* ${user.verified ? "Yes" : "No"}
┃ 🔗 *Profile:* https://tiktok.com/@${user.username}
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (user.avatar) {
              await XROD.sendMessage(from, { image: { url: user.avatar }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ User not found!");
          }
        } catch (err) {
          await m.reply("❌ TikTok stalk error!");
        }
        break;
      
      // 📺 YOUTUBE STALK
      case "ytstalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}ytstalk channel_name or channel_id\n\nExample: ${prefix}ytstalk PewDiePie`);
        
        await m.reply(`🔍 *Stalking YouTube channel: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=${encodeURIComponent(text)}&key=YOUR_YOUTUBE_API_KEY`);
          
          if (data && data.items && data.items.length > 0) {
            const channel = data.items[0];
            const snippet = channel.snippet;
            const stats = channel.statistics;
            
            const result = `
╭━━━〔 📺 YOUTUBE STALK 〕━━━⬣
┃ 👤 *Channel:* ${snippet.title}
┃ 📝 *Description:* ${snippet.description?.substring(0, 100)}...
┃ 👥 *Subscribers:* ${parseInt(stats.subscriberCount).toLocaleString()}
┃ 🎬 *Videos:* ${parseInt(stats.videoCount).toLocaleString()}
┃ 👁️ *Views:* ${parseInt(stats.viewCount).toLocaleString()}
┃ 📅 *Joined:* ${new Date(snippet.publishedAt).toLocaleDateString()}
┃ 🔗 *Profile:* https://youtube.com/@${text}
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (snippet.thumbnails?.default?.url) {
              await XROD.sendMessage(from, { image: { url: snippet.thumbnails.default.url }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ Channel not found!");
          }
        } catch (err) {
          await m.reply("❌ YouTube stalk error! API key required.");
        }
        break;
      
      // 🎵 SPOTIFY STALK
      case "spotifystalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}spotifystalk artist_name\n\nExample: ${prefix}spotifystalk Ed Sheeran`);
        
        await m.reply(`🔍 *Stalking Spotify artist: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(text)}&type=artist&limit=1`, {
            headers: { 'Authorization': `Bearer YOUR_SPOTIFY_TOKEN` }
          });
          
          if (data && data.artists && data.artists.items.length > 0) {
            const artist = data.artists.items[0];
            
            const result = `
╭━━━〔 🎵 SPOTIFY STALK 〕━━━⬣
┃ 🎤 *Artist:* ${artist.name}
┃ 👥 *Followers:* ${artist.followers.total.toLocaleString()}
┃ 🎵 *Popularity:* ${artist.popularity}/100
┃ 🎭 *Genres:* ${artist.genres.slice(0, 3).join(", ") || "N/A"}
┃ 🔗 *Profile:* ${artist.external_urls.spotify}
╰━━━━━━━━━━━━━━⬣
            `;
            
            if (artist.images && artist.images[0]) {
              await XROD.sendMessage(from, { image: { url: artist.images[0].url }, caption: result });
            } else {
              await m.reply(result);
            }
          } else {
            await m.reply("❌ Artist not found!");
          }
        } catch (err) {
          await m.reply("❌ Spotify stalk error! API token required.");
        }
        break;
      
      // 📦 NPM STALK
      case "npmstalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}npmstalk package_name\n\nExample: ${prefix}npmstalk axios`);
        
        await m.reply(`🔍 *Stalking NPM package: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(text)}`);
          
          if (data) {
            const latest = data['dist-tags']?.latest;
            const version = data.versions[latest];
            
            const result = `
╭━━━〔 📦 NPM STALK 〕━━━⬣
┃ 📦 *Package:* ${data.name}
┃ 🔢 *Version:* ${latest}
┃ 📝 *Description:* ${data.description || "No description"}
┃ 👤 *Author:* ${version.author?.name || "Unknown"}
┃ 📊 *Weekly Downloads:* ${version.downloads || "N/A"}
┃ 📁 *Repository:* ${version.repository?.url || "N/A"}
┃ 📄 *License:* ${version.license || "N/A"}
┃ 🔗 *NPM:* https://npmjs.com/package/${data.name}
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
      
      // ⭐ GOOGLE REVIEW STALK
      case "gorestalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}gorestalk place_name\n\nExample: ${prefix}gorestalk Taj Mahal`);
        
        await m.reply(`🔍 *Searching Google reviews for: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(text)}&inputtype=textquery&fields=place_id,name,rating,formatted_address&key=YOUR_GOOGLE_API_KEY`);
          
          if (data && data.candidates && data.candidates.length > 0) {
            const place = data.candidates[0];
            
            const result = `
╭━━━〔 ⭐ GOOGLE REVIEW STALK 〕━━━⬣
┃ 📍 *Place:* ${place.name}
┃ ⭐ *Rating:* ${place.rating || "N/A"}/5
┃ 📍 *Address:* ${place.formatted_address || "N/A"}
┃ 🔗 *Place ID:* ${place.place_id}
╰━━━━━━━━━━━━━━⬣
            `;
            await m.reply(result);
          } else {
            await m.reply("❌ Place not found!");
          }
        } catch (err) {
          await m.reply("❌ Google review error! API key required.");
        }
        break;
      
      // 📘 FACEBOOK STALK
      case "fbstalk":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}fbstalk username or page name\n\nExample: ${prefix}fbstalk facebook`);
        
        await m.reply(`🔍 *Stalking Facebook: ${text}...*`);
        
        try {
          const { data } = await axios.get(`https://graph.facebook.com/v18.0/${encodeURIComponent(text)}?fields=id,name,about,fan_count,website,username&access_token=YOUR_FB_ACCESS_TOKEN`);
          
          if (data && data.id) {
            const result = `
╭━━━〔 📘 FACEBOOK STALK 〕━━━⬣
┃ 📛 *Name:* ${data.name}
┃ 👤 *Username:* ${data.username || "N/A"}
┃ 📝 *About:* ${data.about?.substring(0, 100) || "No info"}
┃ 👥 *Followers:* ${data.fan_count?.toLocaleString() || "N/A"}
┃ 🔗 *Website:* ${data.website || "N/A"}
┃ 🔗 *Profile:* https://facebook.com/${data.username || data.id}
╰━━━━━━━━━━━━━━⬣
            `;
            await m.reply(result);
          } else {
            await m.reply("❌ Page/Profile not found!");
          }
        } catch (err) {
          await m.reply("❌ Facebook stalk error! Access token required.");
        }
        break;
      
      default:
        break;
    }
  }
};