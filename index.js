const { Telegraf, Markup } = require('telegraf');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const fs = require('fs');
const path = require('path');

// =============== CONFIGURATION ===============
const BOT_TOKEN = '8727180497:AAEEa4tCJ0lWHyc8DmnydKXvJzMeenCwgH8'; // ✅ TERA TOKEN
const WHATSAPP_CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWpej7oQhWH4A2HK2k'; // ✅ TERA CHANNEL LINK
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/xxxxxxxx';

// Create sessions folder
if (!fs.existsSync('./sessions')) fs.mkdirSync('./sessions');

const bot = new Telegraf(BOT_TOKEN);
const sessions = new Map();

// =============== /START COMMAND ===============
bot.start((ctx) => {
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     🤖 XROD PAIRING BOT 🤖         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

🌟 *Welcome to XROD Pairing Bot!*

🔹 *Get WhatsApp 8-digit pairing code*
🔹 *Join our WhatsApp channel for updates*
🔹 *Fast & Free service*

📌 *Commands:*
/pair 923xxxxxxxxx - Get pairing code
/status - Check bot status
/help - Show help menu

*Made with ❤️ by XROD*
    `, Markup.inlineKeyboard([
        [Markup.button.url('📱 JOIN WHATSAPP CHANNEL', WHATSAPP_CHANNEL_LINK)],
        [Markup.button.url('👥 JOIN WHATSAPP GROUP', WHATSAPP_GROUP_LINK)],
        [Markup.button.callback('🔐 GET PAIRING CODE', 'get_pairing')],
        [Markup.button.callback('📊 CHECK STATUS', 'check_status')]
    ]));
});

// =============== BUTTON HANDLERS ===============
bot.action('get_pairing', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     🔐 GET PAIRING CODE 🔐         ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 *Send your WhatsApp number in this format:*

\`/pair 923001234567\`

📌 *Country Codes:*
🇵🇰 Pakistan: 923xxxxxxxxx
🇮🇳 India: 91xxxxxxxxxx
🇺🇸 USA: 1xxxxxxxxxx

*Example:* /pair 923001234567
    `);
});

bot.action('check_status', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃          📊 BOT STATUS            ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Bot is online & working!*
🤖 *Service:* WhatsApp Pairing
📱 *Method:* 8-Digit Code
⚡ *Status:* Active
👥 *Active sessions:* ${sessions.size}

📌 *Use /pair your_number*
    `);
});

// =============== /HELP COMMAND ===============
bot.command('help', (ctx) => {
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃           📚 HELP MENU            ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📌 *Commands:*
/pair 923xxxxxxxxx - Get 8-digit pairing code
/status - Check bot status
/help - Show this menu

📱 *How to pair WhatsApp:*
1️⃣ Send /pair your_number
2️⃣ Get 8-digit code
3️⃣ Open WhatsApp → Linked Devices
4️⃣ Tap "Link a Device"
5️⃣ Enter the 8-digit code

⚠️ *Note:* Code expires in 2 minutes!
    `, Markup.inlineKeyboard([
        [Markup.button.url('📱 JOIN WHATSAPP CHANNEL', WHATSAPP_CHANNEL_LINK)],
        [Markup.button.callback('🔐 GET PAIRING CODE', 'get_pairing')]
    ]));
});

// =============== /STATUS COMMAND ===============
bot.command('status', (ctx) => {
    ctx.reply(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃          📊 BOT STATUS            ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Bot is online!*
🤖 *Service:* WhatsApp Pairing
📱 *Method:* 8-Digit Code
⚡ *Status:* Working
👥 *Active sessions:* ${sessions.size}

📌 *Use:* /pair 923xxxxxxxxx
    `);
});

// =============== /PAIR COMMAND ===============
bot.command('pair', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        return ctx.reply(`
❌ *Invalid format!*

📌 *Usage:* /pair 923xxxxxxxxx

*Examples:*
🇵🇰 /pair 923001234567
🇮🇳 /pair 911234567890
🇺🇸 /pair 11234567890
        `);
    }
    
    let number = args[1].replace(/\D/g, '');
    
    if (!number.startsWith('92') && !number.startsWith('91') && !number.startsWith('1')) {
        number = '92' + number;
    }
    
    if (number.length < 10 || number.length > 15) {
        return ctx.reply('❌ *Invalid number!*\n\nUse format: 923xxxxxxxxx (Pakistan) or 91xxxxxxxxxx (India)');
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
        
        sessions.set(sessionId, setTimeout(() => {
            try {
                fs.rmSync(sessionPath, { recursive: true, force: true });
                sessions.delete(sessionId);
            } catch(e) {}
        }, 120000));
        
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(number);
                
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     🔐 YOUR PAIRING CODE 🔐        ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

\`\`\`
👉 ${code} 👈
\`\`\`

╭━━━〔 📱 HOW TO PAIR 〕━━━⬣
┃ 1️⃣ Open WhatsApp
┃ 2️⃣ Three Dots → Linked Devices
┃ 3️⃣ Tap "Link a Device"
┃ 4️⃣ Enter code: *${code}*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

✅ *Valid for 2 minutes*
📱 *Number:* +${number}
⚡ *Expires in:* 2 minutes

⚠️ *Don't share this code with anyone!*
                `, { parse_mode: 'Markdown' });
                
            } catch (err) {
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `
❌ *Failed to generate code!*

📌 *Possible reasons:*
• Invalid WhatsApp number
• Number not registered on WhatsApp

📱 *Try again:* /pair 923xxxxxxxxx
                `);
            }
        }, 3000);
        
    } catch (err) {
        await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `
❌ *Error!* Please try again.

📱 *Usage:* /pair 923xxxxxxxxx
        `);
    }
});

// =============== START BOT ===============
bot.launch().then(() => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     🤖 TELEGRAM BOT STARTED 🤖        ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\n✅ Bot is running!`);
    console.log(`📱 WhatsApp Pairing System Active\n`);
});

process.once('SIGINT', () => {
    for (const [id, timeout] of sessions) {
        clearTimeout(timeout);
        try {
            fs.rmSync(`./sessions/${id}`, { recursive: true, force: true });
        } catch(e) {}
    }
    bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
    for (const [id, timeout] of sessions) {
        clearTimeout(timeout);
        try {
            fs.rmSync(`./sessions/${id}`, { recursive: true, force: true });
        } catch(e) {}
    }
    bot.stop('SIGTERM');
});
