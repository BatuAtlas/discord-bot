const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  try {
    if (!args[0] || !args[1] || !args[2] || !message.mentions.users.first())
      return message.reply("Eksik Bilgiler var!");
    if (args[0].toLowerCase() == "kız" || args[0].toLowerCase() == "erkek") {
      if (ayarlar.kayıtchat != message.channel.id)
        return message.reply("Burası Kayıt Odası Değil!").then((sg) => {
          sg.delete({ timeout: 5000 });
        });
      let kisi = message.mentions.users.first();
      let author = author;
      let onay, nickname, dtarih, yaş, bugünt;
      let nick = args[1].toLowerCase();
      let temiznick = [];
      if (nick.split(" ").length >= 3)
        return message.channel.send("Geçersiz İsim!");
      nick.split(" ").forEach((ua) => {
        temiznick.push(
          ua.split("")[0].toUpperCase() + ua.split("").splice(1).join(""),
        );
      });
      nickname = temiznick.join(" ");
      let reg = /(([0-9]{2}))([-])(([0-9]{2}))([-])(([0-9]{4}))/g;
      let lower = args[2].toLowerCase();
      if (
        lower.length != 10 ||
        !reg.test(lower) ||
        Number(lower.split("-")[0]) > 31 ||
        Number(lower.split("-")[1]) > 12 ||
        Number(lower.split("-")[2]) <= 1900 ||
        new Date().getFullYear() <= Number(lower.split("-")[2]) ||
        new Date().getFullYear() - Number(lower.split("-")[2]) < 9
      )
        return message.channel.send(
          "Geçersiz kullanım biçimi. Doğru kullanım => Gün/Ay/Yıl (Ex: 14-02-2001)",
        );
      let d = new Date();
      let Gün = d.getDate(),
        Ay = d.getMonth() + 1,
        Yıl = d.getFullYear();
      let DGün = parseInt(lower.split("-")[0], 10),
        Dayy = parseInt(lower.split("-")[1], 10),
        DYıl = parseInt(lower.split("-")[2], 10);
      let ekslt =
        Ay == Dayy ? (DGün == Gün ? 0 : DGün > Gün ? 1 : 0) : Dayy > Ay ? 1 : 0;
      yaş = Yıl - DYıl - ekslt;
      dtarih = lower;
      bugünt = `${Gün.toString().length == 1 ? "0" + Gün : Gün}-${Ay.toString().length == 1 ? "0" + Ay : Ay}-${Yıl}`;
      let ld = message.guild.members.cache.get(author).user.createdAt;
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor("#000")
          .setThumbnail(
            kisi.avatarURL({ dynamic: true, format: "png", size: 1024 }),
          )
          .setDescription(
            ":diamonds:Kullanıcı Adı: **" +
              nickname +
              "**\n:diamonds:Yaşı: **" +
              yaş +
              "**\n:diamonds:Doğum Tarihi: **" +
              dtarih +
              "**",
          )
          .setAuthor("ApSePeri Kayıt Platformu")
          .addField(
            "Hesap Kuruluş Tarihi",
            `\`\`\`${ld.getDate().toString().length == 1 ? "0" + ld.getDate() : ld.getDate()}/${(ld.getMonth() + 1).toString().length == 1 ? "0" + (ld.getMonth() + 1) : ld.getMonth() + 1}/${ld.getFullYear()} = ${(ld.getDate().length = 1 ? "0" + ld.getDate() : ld.getDate())}/${(ld.getMonth() + 1).toString().replace("1", "Ocak").replace("2", "Şubat").replace("3", "Mart").replace("4", "Nisan").replace("5", "Mayıs").replace("6", "Haziran").replace("7", "Temmuz").replace("8", "Ağustos").replace("9", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")}/${ld.getFullYear()}\`\`\``,
            true,
          )
          .setFooter("Kayıt İşlemi yapılıyor..."),
      );
      db.set(`users.${author}.name`, nickname);
      db.set(`users.${author}.id`, author);
      db.set(`users.${author}.dtarih`, dtarih);
      db.set(`users.${author}.fastage`, yaş);
      db.set(`users.${author}.katılım`, bugünt);
      db.set(`users.${author}.cins`, args[0].toLowerCase());
      message.guild.member(kisi).roles.add(ayarlar.kayıtlırol);
      if (args[0].toLowerCase() == "kız") {
        message.guild.member(kisi).roles.add("kız");
      } else {
        message.guild.member(kisi).roles.add("erkekrol");
      }
      message.guild.member(kisi).roles.remove(ayarlar.onaysızrol);
      message.member.setNickname(`${nickname} - ${yaş}`);
      client.channels.cache
        .get(ayarlar.logchan)
        .send(`\`\`\`${nickname} - ${yaş} \`\`\`\`\`\`Id: ${author}\`\`\``);
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor("GREEN")
          .setThumbnail(kisi.avatarURL)
          .addField(
            "Kullanıcı Başarıyla Kaydedildi!\n\n\nDöküman ID:",
            "\`\`\`" + `users.${author}` + "\`\`\`",
          ),
      );
      client.channels.cache.get(ayarlar.sohbetchat).send(
        new Discord.MessageEmbed()
          .setColor("PURPLE")
          .setThumbnail(
            kisi.avatarURL({ dynamic: true, format: "png", size: 1024 }),
          )
          .setDescription(
            `:large_blue_diamond: **${nickname} - ${yaş}** Aramıza katıldı :partying_face:\n\n\n\n:white_heart: Senle birlikte **${client.guilds.cache.get(ayarlar.sunucuid).members.cache.filter((member) => !member.user.bot).size}** kişiyiz`,
          ),
      );
    }
  } catch (e) {
    console.log(e);
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription(
          `\`\`\`diff\n- Bir Hata Oluştu -\`\`\`\n\`\`\`js\n${e}\`\`\``,
        ),
    );
  }
};

exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: "k",
};
