const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  try {
    if (message.author.id === ayarlar.sahip) {
      let işlem = args[0],
        komut = args[1];
      switch (işlem.toLowerCase()) {
        case "delete":
          let e1 = db.delete(komut);
          message.reply(`\`\`\`${e1}\`\`\``);
          break;
        case "get":
          let e2 = db.get(komut);
          message.reply(
            `\`\`\`js\n${require("util").inspect(e2, { depth: 0 })}\`\`\``,
          );
          break;
        case "size":
          message.reply(Object.keys(db.get("users")).length);
          break;
        case "list":
          let se = "";
          Object.keys(db.get("users")).forEach((ae) => {
            se += "- " + ae + "\n";
          });
          message.channel.send(`\`\`\`diff\n${se}\`\`\``);
          break;
        case "full":
          let se2 = "";
          Object.keys(db.get("users")).forEach((ae) => {
            se2 +=
              db.get(`users.${ae}`).name +
              `: ${ae} _/\\_ ` +
              db.get(`users.${ae}`).dtarih +
              ` _/\\_ ` +
              db.get(`users.${ae}`).katılım +
              "\n";
          });
          message.channel.send(`\`\`\`fix\n${se2}\`\`\``);
          break;
        default:
          message.reply("Böyle bir işlem bulunmamakta.");
          break;
      }
    }
  } catch (e) {
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(
          `\`\`\`diff\n- Bir Hata Oluştu -\`\`\`\n\`\`\`js\n${e}\`\`\``,
        ),
    );
    console.log(e);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4,
};

exports.help = {
  name: "db",
};
