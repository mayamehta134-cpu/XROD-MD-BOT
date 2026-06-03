module.exports = {
  name: "ping",
  category: "general",
  use: ".ping",
  async run({ conn, from, m }) {
    const start = Date.now();
    await conn.sendMessage(from, { text: "🏓 Pong!" });
    const end = Date.now();
    const latency = end - start;
    
    await conn.sendMessage(from, { 
      text: `🏓 *Pong!*\n\n⏱️ Latency: ${latency}ms\n🤖 Bot: Active` 
    });
  }
};