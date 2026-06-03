const axios = require('axios');
const QRCode = require('qrcode');
const { exec } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

module.exports = {
  name: "tools",
  alias: ["qr", "readqr", "shorten", "unshorten", "binary", "unbinary", "base64", "unbase64", "calc", "currency", "password", "hash", "ip", "whois", "toolsmenu"],
  category: "tools",
  use: ".qr text or .shorten url or .toolsmenu",
  async run({ XROD, m, inputCMD, text, quoted, mime, from }) {
    
    const prefix = ".";
    
    switch (inputCMD) {
      
      // 🛠️ TOOLS MENU
      case "toolsmenu":
        const menu = `
╭━━━〔 🛠️ TOOLS MENU 〕━━━⬣
┃ ${prefix}qr - Generate QR
┃ ${prefix}readqr - Read QR code
┃ ${prefix}shorten - Shorten URL
┃ ${prefix}unshorten - Expand URL
┃ ${prefix}binary - Text to binary
┃ ${prefix}unbinary - Binary to text
┃ ${prefix}base64 - Encode base64
┃ ${prefix}unbase64 - Decode base64
┃ ${prefix}calc - Calculator
┃ ${prefix}currency - Currency convert
┃ ${prefix}password - Generate password
┃ ${prefix}hash - Hash generator
┃ ${prefix}ip - IP info
┃ ${prefix}whois - Domain whois
╰━━━━━━━━━━━━━━⬣

📌 *How to use:*
${prefix}qr https://example.com
${prefix}shorten https://example.com/long/url
${prefix}calc 25+30
        `;
        await XROD.sendMessage(from, { text: menu });
        break;
      
      // 📱 GENERATE QR CODE
      case "qr":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}qr text or URL\n\nExample: ${prefix}qr https://github.com`);
        
        await m.reply("📱 *Generating QR code...*");
        
        try {
          const qrBuffer = await QRCode.toBuffer(text);
          await XROD.sendMessage(from, { 
            image: qrBuffer, 
            caption: `📱 *QR Code*\n\n📝 Content: ${text}` 
          });
        } catch (err) {
          await m.reply("❌ Failed to generate QR code!");
        }
        break;
      
      // 📖 READ QR CODE
      case "readqr":
        if (!m.quoted && !/image/.test(mime)) {
          return m.reply(`❌ Reply to a *QR code image* with *${prefix}readqr*`);
        }
        
        await m.reply("📖 *Reading QR code...*");
        
        try {
          const mediaQr = await XROD.downloadAndSaveMediaMessage(quoted);
          const qrOutput = `./qr_${Date.now()}.png`;
          
          exec(`zbarimg --quiet ${mediaQr} > ${qrOutput}`, async (err) => {
            fs.unlinkSync(mediaQr);
            
            if (err) {
              return m.reply("❌ Could not read QR code! Make sure it's a valid QR image.");
            }
            
            const result = fs.readFileSync(qrOutput, 'utf8');
            fs.unlinkSync(qrOutput);
            
            if (result) {
              await m.reply(`✅ *QR Code Data:*\n\n${result}`);
            } else {
              await m.reply("❌ No data found in QR code!");
            }
          });
        } catch (err) {
          await m.reply("❌ Failed to read QR code!");
        }
        break;
      
      // 🔗 SHORTEN URL
      case "shorten":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}shorten URL\n\nExample: ${prefix}shorten https://github.com/username/repo/long/path`);
        
        if (!text.startsWith("http")) {
          text = "https://" + text;
        }
        
        await m.reply("🔗 *Shortening URL...*");
        
        try {
          const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`);
          
          if (data) {
            await m.reply(`✅ *URL Shortened!*\n\n🔗 Original: ${text}\n📎 Short: ${data}`);
          } else {
            await m.reply("❌ Failed to shorten URL!");
          }
        } catch (err) {
          await m.reply("❌ URL shortening error!");
        }
        break;
      
      // 🔓 EXPAND URL
      case "unshorten":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}unshorten short_url\n\nExample: ${prefix}unshorten https://tinyurl.com/xxx`);
        
        await m.reply("🔓 *Expanding URL...*");
        
        try {
          const response = await axios.get(text, { maxRedirects: 0, validateStatus: null });
          const expandedUrl = response.headers.location || text;
          
          await m.reply(`✅ *URL Expanded!*\n\n📎 Short: ${text}\n🔗 Original: ${expandedUrl}`);
        } catch (err) {
          await m.reply("❌ Failed to expand URL!");
        }
        break;
      
      // 💻 TEXT TO BINARY
      case "binary":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}binary text\n\nExample: ${prefix}binary Hello`);
        
        const binaryResult = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        
        await m.reply(`💻 *Text to Binary*\n\n📝 Text: ${text}\n🔢 Binary:\n${binaryResult}`);
        break;
      
      // 🔢 BINARY TO TEXT
      case "unbinary":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}unbinary binary_code\n\nExample: ${prefix}unbinary 01001000 01100101`);
        
        const binaryText = text.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        
        await m.reply(`🔢 *Binary to Text*\n\n🔢 Binary: ${text}\n📝 Text: ${binaryText}`);
        break;
      
      // 📝 BASE64 ENCODE
      case "base64":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}base64 text\n\nExample: ${prefix}base64 Hello World`);
        
        const base64Encoded = Buffer.from(text).toString('base64');
        
        await m.reply(`📝 *Base64 Encode*\n\n📝 Original: ${text}\n🔐 Encoded: ${base64Encoded}`);
        break;
      
      // 🔓 BASE64 DECODE
      case "unbase64":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}unbase64 base64_string\n\nExample: ${prefix}unbase64 SGVsbG8gV29ybGQ=`);
        
        try {
          const base64Decoded = Buffer.from(text, 'base64').toString('utf8');
          await m.reply(`🔓 *Base64 Decode*\n\n🔐 Encoded: ${text}\n📝 Decoded: ${base64Decoded}`);
        } catch (err) {
          await m.reply("❌ Invalid base64 string!");
        }
        break;
      
      // 🧮 CALCULATOR
      case "calc":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}calc expression\n\nExample: ${prefix}calc 25*4+10/2\n\n*Supports:* + - * / % ( )`);
        
        try {
          let expression = text.replace(/[^0-9+\-*/().%]/g, '');
          const result = eval(expression);
          
          await m.reply(`🧮 *Calculator*\n\n📝 Expression: ${text}\n✅ Result: ${result}`);
        } catch (err) {
          await m.reply("❌ Invalid expression!");
        }
        break;
      
      // 💱 CURRENCY CONVERTER
      case "currency":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}currency amount from to\n\nExample: ${prefix}currency 100 USD INR\n\n*Supported:* USD, EUR, GBP, INR, JPY, AUD, CAD, CHF, CNY, RUB`);
        
        const currParts = text.split(' ');
        if (currParts.length < 3) {
          return m.reply(`❌ *Usage:* ${prefix}currency amount from to\n\nExample: ${prefix}currency 100 USD INR`);
        }
        
        const amount = parseFloat(currParts[0]);
        const fromCurr = currParts[1].toUpperCase();
        const toCurr = currParts[2].toUpperCase();
        
        if (isNaN(amount)) return m.reply("❌ Invalid amount!");
        
        await m.reply("💱 *Converting currency...*");
        
        try {
          const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurr}`);
          
          if (data && data.rates && data.rates[toCurr]) {
            const rate = data.rates[toCurr];
            const converted = (amount * rate).toFixed(2);
            
            await m.reply(`💱 *Currency Conversion*\n\n💰 Amount: ${amount} ${fromCurr}\n💱 Rate: 1 ${fromCurr} = ${rate} ${toCurr}\n✅ Result: ${converted} ${toCurr}`);
          } else {
            await m.reply("❌ Currency not supported!");
          }
        } catch (err) {
          await m.reply("❌ Currency conversion error!");
        }
        break;
      
      // 🔐 GENERATE PASSWORD
      case "password":
        let length = parseInt(text) || 12;
        if (length < 6) length = 6;
        if (length > 32) length = 32;
        
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        
        let password = "";
        let allChars = uppercase + lowercase + numbers + symbols;
        
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];
        
        for (let i = password.length; i < length; i++) {
          password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        await m.reply(`🔐 *Generated Password*\n\n📏 Length: ${length}\n🔑 Password: \`${password}\``);
        break;
      
      // 🔒 HASH GENERATOR
      case "hash":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}hash text\n\nExample: ${prefix}hash Hello\n\n*Hash types:* MD5, SHA1, SHA256, SHA512`);
        
        const md5 = crypto.createHash('md5').update(text).digest('hex');
        const sha1 = crypto.createHash('sha1').update(text).digest('hex');
        const sha256 = crypto.createHash('sha256').update(text).digest('hex');
        const sha512 = crypto.createHash('sha512').update(text).digest('hex');
        
        await m.reply(`🔒 *Hash Generator*\n\n📝 Text: ${text}\n\n🔐 MD5: \`${md5}\`\n🔐 SHA1: \`${sha1}\`\n🔐 SHA256: \`${sha256}\`\n🔐 SHA512: \`${sha512}\``);
        break;
      
      // 🌐 IP INFORMATION
      case "ip":
        const ipAddress = text || await getPublicIP();
        
        await m.reply("🌐 *Fetching IP information...*");
        
        try {
          const { data } = await axios.get(`http://ip-api.com/json/${encodeURIComponent(ipAddress)}`);
          
          if (data && data.status === "success") {
            await m.reply(`
╭━━━〔 🌐 IP INFORMATION 〕━━━⬣
┃ 🌍 *IP:* ${data.query}
┃ 📍 *Country:* ${data.country}
┃ 🏙️ *City:* ${data.city}
┃ 📮 *ZIP:* ${data.zip}
┃ 📡 *ISP:* ${data.isp}
┃ 🗺️ *Lat/Lon:* ${data.lat}, ${data.lon}
┃ 🌐 *Region:* ${data.regionName}
╰━━━━━━━━━━━━━━⬣
            `);
          } else {
            await m.reply("❌ IP not found!");
          }
        } catch (err) {
          await m.reply("❌ IP lookup error!");
        }
        break;
      
      // 🔍 WHOIS LOOKUP
      case "whois":
        if (!text) return m.reply(`❌ *Usage:* ${prefix}whois domain.com\n\nExample: ${prefix}whois google.com`);
        
        await m.reply("🔍 *Performing WHOIS lookup...*");
        
        try {
          const { data } = await axios.get(`https://whoisapi.com/api/v1/whois?domain=${encodeURIComponent(text)}`);
          
          if (data) {
            await m.reply(`
╭━━━〔 🔍 WHOIS LOOKUP 〕━━━⬣
┃ 🌐 *Domain:* ${data.domainName || text}
┃ 📅 *Created:* ${data.creationDate || "N/A"}
┃ 📆 *Expires:* ${data.expirationDate || "N/A"}
┃ 🔄 *Updated:* ${data.updatedDate || "N/A"}
┃ 👤 *Registrar:* ${data.registrar || "N/A"}
┃ 📧 *Email:* ${data.registrantEmail || "N/A"}
╰━━━━━━━━━━━━━━⬣
            `);
          } else {
            await m.reply("❌ Domain not found!");
          }
        } catch (err) {
          await m.reply("❌ WHOIS lookup error!");
        }
        break;
      
      default:
        break;
    }
  }
};

async function getPublicIP() {
  try {
    const { data } = await axios.get('https://api.ipify.org?format=json');
    return data.ip;
  } catch {
    return "8.8.8.8";
  }
}