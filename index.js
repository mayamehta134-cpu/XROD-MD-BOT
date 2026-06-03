const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Telegraf, Markup } = require('telegraf');
const Pino = require('pino');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');

// =============== CONFIGURATION ===============
const BOT_TOKEN = '8155564776:AAF2nJqNrFQpB3hBpJk9LpVpQ2Xp3VpQ2X'; // Telegram Bot Token
const WHATSAPP_CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWpej7oQhWH4A2HK2k';
const PREFIX = ".";

// Create sessions folder
if (!fs.existsSync('./sessions')) fs.mkdirSync('./sessions');
if (!fs.existsSync('./auth_info_baileys')) fs.mkdirSync('./auth_info_baileys');

// =============== STORE PLUGINS ===============
let plugins = new Map();
let currentQR = null;
let whatsappSock = null;

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
                console.log(`❌ Error loading ${file}: ${e.message}`);
            }
        }
    }
    console.log(`\n📦 Total ${loadedCount} plugins loaded!\n`);
}

// =============== TELEGRAM BOT SETUP ===============
const bot = new Telegraf(BOT_TOKEN);
const telegramSessions = new Map();

// Generate QR and send to Telegram
async function sendQRToTelegram(ctx) {
    if (!whatsappSock) {
        return ctx.reply('❌ WhatsApp bot is not ready yet. Please wait...');
    }
    
    // Generate QR code
    const qrBuffer = await qrcode.toBuffer(currentQR || 'https://xrod.com');
    
    await ctx.replyWithPhoto(
        { source: qrBuffer },
        {
            caption: `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃              📱 QR CODE TO PAIR 📱              ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *How to pair:*

1️⃣ Open WhatsApp
2️⃣ Three Dots (⋮) → Linked Devices
3️⃣ Tap "Link a Device"
4️⃣ Scan this QR code

✅ *QR code works for ALL countries!*
⚠️ *Code expires in 2 minutes!*
            `
        }
    );
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
/qr - Get QR code to scan
/menu - Show all WhatsApp commands
/status - Check bot status
/help - Show help menu

*Made with ❤️ by XROD*
    `, Markup.inlineKeyboard([
        [Markup.button.url('📱 JOIN WHATSAPP CHANNEL', WHATSAPP_CHANNEL_LINK)],
        [Markup.button.callback('🔐 GET PAIRING CODE', 'get_pairing')],
        [Markup.button.callback('📱 GET QR CODE', 'get_qr')],
        [Markup.button.callback('📋 SHOW MENU', 'show_menu')],
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

*Example:* /pair 923001234567
    `);
});

bot.action('get_qr', async (ctx) => {
    await ctx.answerCbQuery();
    await sendQRToTelegram(ctx);
});

bot.action('show_menu', async (ctx) => {
    await ctx.answerCbQuery();
    
    const menu = `
╭━━━〔 XROD MD BOT 〕━━━⬣
┃ 👑 .ownermenu
┃ 🤖 .aimenu
┃ 🎮 .funmenu
┃ 🔥 .roastmenu
┃ 🎵 .mediamenu
┃ 📥 .downloadmenu
┃ 🔍 .searchmenu
┃ 🛠️ .toolsmenu
┃ 👥 .groupmenu
┃ ⚙️ .settingsmenu
┃ 🎨 .logomenu
┃ 📝 .textpromenu
┃ 😂 .mememenu
┃ 🎲 .randommenu
┃ 💰 .economymenu
┃ 🏆 .gamesmenu
┃ 📊 .stalkmenu
┃ 🌐 .convertmenu
┃ 📚 .educationmenu
┃ 💎 .premiummenu
╰━━━━━━━━━━━━━━⬣

📌 *Type any command on WhatsApp after pairing!*
    `;
    
    ctx.reply(menu);
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
📦 *Plugins loaded:* ${plugins.size}
⚡ *Status:* Active

📌 *Use /pair [number] or /qr*
    `);
});

bot.command('help', (ctx) => {
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃                 📚 HELP MENU 📚                ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *Commands:*

/pair [countrycode][number] - Get 8-digit code
/qr - Get QR code to scan
/menu - Show all WhatsApp commands
/status - Check bot status
/help - Show this menu

📱 *How to pair WhatsApp:*

*Method 1 (8-Digit Code):*
• Send /pair 923001234567
• Get 8-digit code
• Enter in WhatsApp → Linked Devices

*Method 2 (QR Code):*
• Send /qr command
• Scan the QR code from Telegram

🌍 *Works for ALL countries!*
    `, Markup.inlineKeyboard([
        [Markup.button.url('📱 JOIN WHATSAPP CHANNEL', WHATSAPP_CHANNEL_LINK)],
        [Markup.button.callback('🔐 GET PAIRING CODE', 'get_pairing')],
        [Markup.button.callback('📱 GET QR CODE', 'get_qr')]
    ]));
});

bot.command('menu', async (ctx) => {
    const menu = `
╭━━━〔 XROD MD BOT 〕━━━⬣
┃ 👑 .ownermenu
┃ 🤖 .aimenu
┃ 🎮 .funmenu
┃ 🔥 .roastmenu
┃ 🎵 .mediamenu
┃ 📥 .downloadmenu
┃ 🔍 .searchmenu
┃ 🛠️ .toolsmenu
┃ 👥 .groupmenu
┃ ⚙️ .settingsmenu
┃ 🎨 .logomenu
┃ 📝 .textpromenu
┃ 😂 .mememenu
┃ 🎲 .randommenu
┃ 💰 .economymenu
┃ 🏆 .gamesmenu
┃ 📊 .stalkmenu
┃ 🌐 .convertmenu
┃ 📚 .educationmenu
┃ 💎 .premiummenu
╰━━━━━━━━━━━━━━⬣

📌 *Type any command on WhatsApp after pairing!*
    `;
    ctx.reply(menu);
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
📦 *Plugins loaded:* ${plugins.size}
⚡ *Status:* Working

📌 *Use:* /pair [number] or /qr
    `);
});

bot.command('qr', async (ctx) => {
    await sendQRToTelegram(ctx);
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

🌍 *Any country code works!*
        `);
    }
    
    let number = args[1].replace(/\D/g, '');
    
    if (number.length < 10 || number.length > 15) {
        return ctx.reply('❌ *Invalid number!*\n\nUse format: [countrycode][number]');
    }
    
    const msg = await ctx.reply(`🔄 *Generating pairing code for* +${number}...\n⏳ Please wait...`);
    
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
┃  1️⃣ Open WhatsApp                             ┃
┃  2️⃣ Three Dots → Linked Devices               ┃
┃  3️⃣ Tap "Link a Device"                       ┃
┃  4️⃣ Enter code: *${code}*                     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Valid for 2 minutes*
📱 *Number:* +${number}
⚡ *Expires in:* 2 minutes
                `, { parse_mode: 'Markdown' });
                
            } catch (err) {
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `
❌ *Failed to generate code!*

📌 *Try QR code method:* /qr
🌍 *QR code works for ALL countries!*
                `);
            }
        }, 3000);
        
    } catch (err) {
        await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `
❌ *Error!* Please try again.

📱 *Try QR code method:* /qr
        `);
    }
});

// =============== WHATSAPP BOT SETUP ===============
async function startWhatsAppBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    whatsappSock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: Pino({ level: 'silent' }),
        browser: ['XROD MD', 'Chrome', '1.0.0']
    });
    
    whatsappSock.ev.on('creds.update', saveCreds);
    
    whatsappSock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            currentQR = qr;
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📱 NEW QR CODE GENERATED');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            // Generate QR as text for terminal
            const qrTerminal = await qrcode.toString(qr, { type: 'terminal', small: true });
            console.log(qrTerminal);
            console.log('\n📌 Type /qr on Telegram to get this QR code!\n');
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
    whatsappSock.ev.on('messages.upsert', async ({ messages }) => {
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
                    XROD: whatsappSock,
                    conn: whatsappSock,
                    m: msg,
                    message: msg,
                    inputCMD: command,
                    text: args.join(' '),
                    from,
                    reply: async (txt) => await whatsappSock.sendMessage(from, { text: txt })
                });
            } catch(e) {
                console.log(`Error in ${command}:`, e);
                await whatsappSock.sendMessage(from, { text: '❌ Error executing command!' });
            }
        } else {
            await whatsappSock.sendMessage(from, { text: `❌ Command "${command}" not found!\n\nType .menu for available commands.` });
        }
    });
}

// =============== START BOTH BOTS ===============
console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     🌍 XROD UNIVERSAL WHATSAPP BOT 🌍                  ║');
console.log('║     QR Code + Pairing Code + Full Menu Working         ║');
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
    console.log(`🌍 Type /qr to get QR code in Telegram!`);
    console.log(`📋 Type /menu to see all WhatsApp commands!\n`);
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
