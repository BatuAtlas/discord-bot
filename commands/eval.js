const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  if (message.author.id == ayarlar.sahip) {
    if (!args[0]) return;
    try {
      let codein = args.join(" ");
      let codes = eval(codein),
        code;

      if (typeof codes != "string")
        code = require("util").inspect(codes, { depth: 0 });
      let çıkış = `\`\`\`js\n${code}\n\`\`\``;
      message.channel.send(
        new Discord.MessageEmbed()
          .addField("Giriş:", `\`\`\`js\n${[codein]}\n\`\`\``)
          .addField("Çıkış:", `${çıkış}`)
          .setColor("RANDOM"),
      );
      console.log(require("util").inspect(codes, { depth: 1 }));
    } catch (e) {
      message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4,
};

exports.help = {
  name: "eval",
};
