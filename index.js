const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Telegraf, Markup } = require('telegraf');
const Pino = require('pino');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');

// =============== CONFIGURATION ===============
const BOT_TOKEN = '8155564776:AAF2nJqNrFQpB3hBpJk9LpVpQ2Xp3VpQ2X'; // Telegram Bot Token
const WHATSAPP_CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWpej7oQhWH4A2HK2k';
const PREFIX = ".";

// Create sessions folder
if (!fs.existsSync('./sessions')) fs.mkdirSync('./sessions');
if (!fs.existsSync('./auth_info_baileys')) fs.mkdirSync('./auth_info_baileys');

// =============== TELEGRAM BOT SETUP ===============
const bot = new Telegraf(BOT_TOKEN);
const telegramSessions = new Map();

// Store plugins
let plugins = new Map();

// Load all plugins from Plugins folder
function loadPlugins() {
    const pluginsPath = path.join(__dirname, 'Plugins');
    if (!fs.existsSync(pluginsPath)) {
        console.log('❌ Plugins folder not found!');
        return;
    }
    
    const files = fs.readdirSync(pluginsPath);
    let loadedCount = 0;
    
    for (const file of files) {
        if (file.endsWith('.js')) {
            try {
                const plugin = require(`./Plugins/${file}`);
                if (plugin.name) {
                    plugins.set(plugin.name, plugin);
                    if (plugin.alias && Array.isArray(plugin.alias)) {
                        plugin.alias.forEach(alias => {
                            plugins.set(alias, plugin);
                        });
                    }
                    loadedCount++;
                    console.log(`✅ Loaded: ${file}`);
                }
            } catch(e) {
                console.log(`❌ Error loading ${file}`);
            }
        }
    }
    console.log(`\n📦 Total ${loadedCount} plugins loaded!\n`);
}

// =============== TELEGRAM COMMANDS ===============
bot.start((ctx) => {
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃        🌍 XROD UNIVERSAL PAIRING BOT 🌍        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🌟 *Welcome to XROD Pairing Bot!*

🔹 *Works for ALL countries*
🔹 *8-digit pairing code + QR code*
🔹 *Fast & Free service*

📌 *Commands:*
/pair [number] - Get 8-digit code
/qr - Get QR code instructions
/status - Check bot status
/help - Show help menu

🌍 *Supported Countries:*
🇵🇰 Pakistan, 🇮🇳 India, 🇺🇸 USA, 🇬🇧 UK, 🇦🇪 UAE, 🇨🇦 Canada, 🇦🇺 Australia, 🇩🇪 Germany, 🇫🇷 France, 🇯🇵 Japan, 🇸🇬 Singapore, 🇲🇾 Malaysia, 🇮🇩 Indonesia, 🇧🇩 Bangladesh, 🇱🇰 Sri Lanka, 🇳🇵 Nepal + ALL others!

*Made with ❤️ by XROD*
    `, Markup.inlineKeyboard([
        [Markup.button.url('📱 JOIN WHATSAPP CHANNEL', WHATSAPP_CHANNEL_LINK)],
        [Markup.button.callback('🔐 GET PAIRING CODE', 'get_pairing')],
        [Markup.button.callback('📱 GET QR CODE', 'get_qr')],
        [Markup.button.callback('📊 CHECK STATUS', 'check_status')]
    ]));
});

bot.action('get_pairing', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃           🔐 GET PAIRING CODE 🔐               ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 *Send your WhatsApp number in this format:*

\`/pair [countrycode][number]\`

🌍 *Country Codes:*
🇵🇰 Pakistan: 923xxxxxxxxx
🇮🇳 India: 91xxxxxxxxxx
🇺🇸 USA: 1xxxxxxxxxx
🇬🇧 UK: 44xxxxxxxxxx
🇦🇪 UAE: 971xxxxxxxxx
🇨🇦 Canada: 1xxxxxxxxxx
🇦🇺 Australia: 61xxxxxxxxx
🇩🇪 Germany: 49xxxxxxxxx
🇫🇷 France: 33xxxxxxxxx
🇯🇵 Japan: 81xxxxxxxxx
🇸🇬 Singapore: 65xxxxxxxx
🇲🇾 Malaysia: 60xxxxxxxx
🇮🇩 Indonesia: 62xxxxxxxx
🇧🇩 Bangladesh: 880xxxxxxxxx
🇱🇰 Sri Lanka: 94xxxxxxxx
🇳🇵 Nepal: 977xxxxxxxx

*Example:* /pair 923001234567
    `);
});

bot.action('get_qr', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃            📱 GET QR CODE 📱                   ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *How to pair using QR code:*

1️⃣ Make sure bot is running on server
2️⃣ Check terminal for QR code
3️⃣ Open WhatsApp
4️⃣ Settings → Linked Devices
5️⃣ Tap "Link a Device"
6️⃣ Scan the QR code from terminal

✅ *QR code works for ALL countries!*
⚠️ *Use QR code if pairing code fails*
    `);
});

bot.action('check_status', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃              📊 BOT STATUS 📊                  ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Bot is online & working!*
🤖 *Service:* WhatsApp Universal Pairing
🌍 *Coverage:* ALL countries
📱 *Methods:* 8-Digit Code + QR Code
⚡ *Status:* Active
👥 *Active sessions:* ${telegramSessions.size}

📌 *Use /pair [countrycode][number]*
📌 *Or use /qr for QR code method*
    `);
});

bot.command('help', (ctx) => {
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃                 📚 HELP MENU 📚                ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *Commands:*

/pair [countrycode][number] - Get 8-digit code
/qr - Get QR code instructions
/status - Check bot status
/help - Show this menu

📱 *How to pair WhatsApp:*

*Method 1 (8-Digit Code):*
• Send /pair 923001234567
• Get 8-digit code
• Enter in WhatsApp → Linked Devices

*Method 2 (QR Code):*
• Use /qr for instructions
• Scan QR from terminal

🌍 *Works for ALL countries!*

⚠️ *Code expires in 2 minutes!*
    `, Markup.inlineKeyboard([
        [Markup.button.url('📱 JOIN WHATSAPP CHANNEL', WHATSAPP_CHANNEL_LINK)],
        [Markup.button.callback('🔐 GET PAIRING CODE', 'get_pairing')],
        [Markup.button.callback('📱 GET QR CODE', 'get_qr')]
    ]));
});

bot.command('status', (ctx) => {
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃              📊 BOT STATUS 📊                  ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Bot is online!*
🤖 *Service:* WhatsApp Universal Pairing
🌍 *Coverage:* ALL countries
📱 *Methods:* 8-Digit Code + QR Code
⚡ *Status:* Working
👥 *Active sessions:* ${telegramSessions.size}

📌 *Use:* /pair [countrycode][number]
🌍 *Any country code works!*
    `);
});

bot.command('qr', (ctx) => {
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃            📱 QR CODE METHOD 📱                ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *Follow these steps:*

1️⃣ Make sure bot is running on server
2️⃣ Check terminal for QR code
3️⃣ Open WhatsApp
4️⃣ Settings → Linked Devices
5️⃣ Tap "Link a Device"
6️⃣ Scan the QR code from terminal

✅ *QR code works for ALL countries!*
🌍 *This is the most reliable method!*
    `);
});

bot.command('pair', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply(`
❌ *Invalid format!*

📌 *Usage:* /pair [countrycode][number]

*Examples:*
🇵🇰 Pakistan: /pair 923001234567
🇮🇳 India: /pair 911234567890
🇺🇸 USA: /pair 11234567890
🇬🇧 UK: /pair 441234567890
🇦🇪 UAE: /pair 971501234567

🌍 *Any country code works!*
        `);
    }
    
    let number = args[1].replace(/\D/g, '');
    
    if (number.length < 10 || number.length > 15) {
        return ctx.reply('❌ *Invalid number!*\n\nUse format: [countrycode][number]\nExample: 923001234567 (Pakistan)');
    }
    
    const msg = await ctx.reply(`🔄 *Generating pairing code for* +${number}...\n⏳ Please wait (5-10 seconds)...`);
    
    try {
        const sessionId = `session_${number}_${Date.now()}`;
        const sessionPath = `./sessions/${sessionId}`;
        
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: Pino({ level: 'silent' }),
            browser: ['XROD Pair', 'Chrome', '1.0.0']
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        telegramSessions.set(sessionId, setTimeout(() => {
            try {
                fs.rmSync(sessionPath, { recursive: true, force: true });
                telegramSessions.delete(sessionId);
            } catch(e) {}
        }, 120000));
        
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(number);
                
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃           🔐 YOUR PAIRING CODE 🔐               ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

\`\`\`
👉 ${code} 👈
\`\`\`

╭━━━〔 📱 HOW TO PAIR 〕━━━━━━━━━━━━━━━━━━━━━━━━╮
┃                                                ┃
┃  1️⃣ Open WhatsApp                             ┃
┃  2️⃣ Three Dots (⋮) → Linked Devices           ┃
┃  3️⃣ Tap "Link a Device"                       ┃
┃  4️⃣ Enter this code: *${code}*                ┃
┃                                                ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Valid for 2 minutes*
📱 *Number:* +${number}
🌍 *Country:* Auto-detected
⚡ *Expires in:* 2 minutes

⚠️ *Don't share this code with anyone!*
                `, { parse_mode: 'Markdown' });
                
            } catch (err) {
                let errorMsg = `
❌ *Failed to generate code!*

📌 *Possible reasons:*
• Invalid WhatsApp number
• Number not registered on WhatsApp
• Country code may not support pairing code

🌍 *TRY QR CODE METHOD:* /qr

📱 *This method works for ALL countries!*
                `;
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, errorMsg);
            }
        }, 3000);
        
    } catch (err) {
        await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `
❌ *Error!* Please try again.

📱 *Usage:* /pair [countrycode][number]

🌍 *Or try QR code method:* /qr
        `);
    }
});

// =============== WHATSAPP BOT SETUP ===============
async function startWhatsAppBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: Pino({ level: 'silent' }),
        browser: ['XROD MD', 'Chrome', '1.0.0']
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📱 SCAN THIS QR CODE WITH WHATSAPP');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            qrcode.generate(qr, { small: true });
            console.log('\n1. Open WhatsApp');
            console.log('2. Tap Three Dots (⋮) → Linked Devices');
            console.log('3. Tap "Link a Device"');
            console.log('4. Scan this QR code');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        }
        
        if (connection === 'open') {
            console.log('\n✅ WHATSAPP BOT CONNECTED SUCCESSFULLY!');
            console.log('🤖 Bot is now online!\n');
            console.log('📌 Try: .menu on WhatsApp\n');
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('🔄 Reconnecting...');
                setTimeout(startWhatsAppBot, 3000);
            }
        }
    });
    
    // =============== WHATSAPP COMMAND HANDLER ===============
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        
        if (!text.startsWith(PREFIX)) return;
        
        const args = text.slice(PREFIX.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        // Check in plugins
        if (plugins.has(command)) {
            const plugin = plugins.get(command);
            try {
                await plugin.run({
                    XROD: sock,
                    m: msg,
                    inputCMD: command,
                    text: args.join(''),
                    from
                });
            } catch(e) {
                console.log(`Error in ${command}:`, e);
            }
        } else {
            // Command not found
            await sock.sendMessage(from, { text: `❌ Command "${command}" not found!\n\nType .menu for available commands.` });
        }
    });
}

// =============== START BOTH BOTS ===============
console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     🌍 XROD UNIVERSAL WHATSAPP BOT 🌍                  ║');
console.log('║     Works for ALL Countries - Pairing + QR Code        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Load plugins
loadPlugins();

// Start WhatsApp Bot
startWhatsAppBot();

// Start Telegram Bot
bot.launch().then(() => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     🤖 TELEGRAM BOT STARTED 🤖        ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n✅ Telegram Bot is running!`);
    console.log(`🌍 Universal pairing for ALL countries!\n`);
});

// Graceful shutdown
process.once('SIGINT', () => {
    for (const [id, timeout] of telegramSessions) {
        clearTimeout(timeout);
        try {
            fs.rmSync(`./sessions/${id}`, { recursive: true, force: true });
        } catch(e) {}
    }
    bot.stop('SIGINT');
    process.exit();
});
