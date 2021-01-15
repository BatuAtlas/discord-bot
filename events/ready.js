const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json');
module.exports = client => {
  
  const aktiviteListesi = [

    '◕ ApSePeri System',
    '✧ ApSePeri System',
    '⚡ ApSePeri System'

  ]

console.log(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);
console.log("    ___         _____      ____               ")
console.log("   /   |  ____ / ___/___  / __ \\___  _____(_) ")
console.log("  / /| | / __ \\\\__ \\/ _ \\/ /_/ / _ \\/ ___/ /")
console.log(" / ___ |/ /_/ /__/ /  __/ ____/  __/ /  / /   ")
console.log("/_/  |_/ .___/____/\\___/_/    \\___/_/  /_/    ")
console.log("      /_/                                     ")
console.log(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);
console.log("▼▬▼ ApSePeri ")
console.log("▼▬▼ Register 2.3 ")
console.log(`▼▬▼ Prefix : ${ayarlar.prefix}`);
console.log(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);

  
/*setInterval(() => {
    client.user.setActivity(aktiviteListesi[Math.floor(Math.random() * (aktiviteListesi.length + 1))])
  }, 7000)*/
}
