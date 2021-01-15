const Discord = require("discord.js");
const db = require("quick.db");
const ayarlar = require("../ayarlar.json");

exports.run = async (client, message, args) => {
  try {
    if (ayarlar.kayıtchat != message.channel.id)
      return message.reply("Burası Kayıt Odası Değil!").then((sg) => {
        sg.delete({ timeout: 5000 });
      });
    let author = message.author.id;
    let onay, nickname, dtarih, yaş, bugünt;
    message.channel.send(
      new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setTitle("ApSePeri Kayıt İşlemi")
        .setFooter("║Bu mesajın altında isminizi yazınız"),
    );
    onay = true;
    while (onay) {
      const filter = (response) => {
        return response.author.id === author;
      };
      await message.channel
        .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
        .then(async (collected) => {
          await girişim(collected.first().content);
        })
        .catch((e) => {
          message.reply("60 saniyedir cevap vermediniz. İşlem iptal edildi.");
          onay = false;
          console.log(e);
        });

      function girişim(e) {
        try {
          let girişim = !nickname ? 1 : !dtarih ? 2 : 3;
          switch (girişim) {
            case 1:
              if (e.toLowerCase() == "hayır") return (onay = false);
              let nick = e.toLowerCase();
              let temiznick = [];
              if (nick.split(" ").length >= 3)
                return message.channel.send("Geçersiz İsim!");
              nick.split(" ").forEach((ua) => {
                temiznick.push(
                  ua.split("")[0].toUpperCase() +
                    ua.split("").splice(1).join(""),
                );
              });
              nickname = temiznick.join(" ");
              message.channel.send(
                new Discord.MessageEmbed()
                  .setColor("ORANGE")
                  .setThumbnail(message.author.avatarURL)
                  .addField(
                    "ApSePeri Kayıt İşlemi\n\n\n▼İsim başarıyla girildi ▼",
                    `\`\`\`${nickname}\`\`\``,
                  )
                  .setFooter(
                    "║Bu mesajın altında doğum tarihiniz Gün-Ay-Yıl formatında giriniz => 22-06-2001",
                  ),
              );
              break;
            case 2:
              if (e.toLowerCase() == "hayır") return (onay = false);
              let reg = /(([0-9]{2}))([-])(([0-9]{2}))([-])(([0-9]{4}))/g;
              let lower = e.toLowerCase();
              if (
                e.length != 10 ||
                !reg.test(e) ||
                Number(e.split("-")[0]) > 31 ||
                Number(e.split("-")[1]) > 12 ||
                Number(e.split("-")[2]) <= 1900 ||
                new Date().getFullYear() <= Number(e.split("-")[2]) ||
                new Date().getFullYear() - Number(e.split("-")[2]) < 9
              )
                return message.channel.send(
                  "Geçersiz kullanım biçimi. Doğru kullanım => Gün/Ay/Yıl (Ex: 14-02-2001)",
                );
              let d = new Date();
              let Gün = d.getDate(),
                Ay = d.getMonth() + 1,
                Yıl = d.getFullYear();
              let DGün = parseInt(e.split("-")[0], 10),
                Dayy = parseInt(e.split("-")[1], 10),
                DYıl = parseInt(e.split("-")[2], 10);
              let ekslt =
                Ay == Dayy
                  ? DGün == Gün
                    ? 0
                    : DGün > Gün
                      ? 1
                      : 0
                  : Dayy > Ay
                    ? 1
                    : 0;
              yaş = Yıl - DYıl - ekslt;
              dtarih = lower;
              bugünt = `${Gün.toString().length == 1 ? "0" + Gün : Gün}-${Ay.toString().length == 1 ? "0" + Ay : Ay}-${Yıl}`;
              let ld = message.guild.members.cache.get(message.author.id).user
                .createdAt;
              message.channel.send(
                new Discord.MessageEmbed()
                  .setColor("#000")
                  .setThumbnail(
                    message.author.avatarURL({
                      dynamic: true,
                      format: "png",
                      size: 1024,
                    }),
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
                  //.addBlankField()
                  .addField(
                    "Hesap Kuruluş Tarihi",
                    `\`\`\`${ld.getDate().toString().length == 1 ? "0" + ld.getDate() : ld.getDate()}/${(ld.getMonth() + 1).toString().length == 1 ? "0" + (ld.getMonth() + 1) : ld.getMonth() + 1}/${ld.getFullYear()} = ${(ld.getDate().length = 1 ? "0" + ld.getDate() : ld.getDate())}/${(ld.getMonth() + 1).toString().replace("1", "Ocak").replace("2", "Şubat").replace("3", "Mart").replace("4", "Nisan").replace("5", "Mayıs").replace("6", "Haziran").replace("7", "Temmuz").replace("8", "Ağustos").replace("9", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")}/${ld.getFullYear()}\`\`\``,
                    true,
                  )
                  .setFooter("Kayıt işlemini onaylamak için [Evet] yazınız."),
              );
              break;

            case 3:
              if (e.toLowerCase() == "evet") {
                db.set(`users.${message.author.id}.name`, nickname);
                db.set(`users.${message.author.id}.id`, message.author.id);
                db.set(`users.${message.author.id}.dtarih`, dtarih);
                db.set(`users.${message.author.id}.fastage`, yaş);
                db.set(`users.${message.author.id}.katılım`, bugünt);
                message.guild
                  .member(message.author)
                  .roles.add(ayarlar.kayıtlırol);
                message.guild
                  .member(message.author)
                  .roles.remove(ayarlar.onaysızrol);
                message.member.setNickname(`${nickname} - ${yaş}`);
                client.channels.cache
                  .get(ayarlar.logchan)
                  .send(
                    `\`\`\`${nickname} - ${yaş} \`\`\`\`\`\`Id: ${message.author.id}\`\`\``,
                  );
                message.channel.send(
                  new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(message.author.avatarURL)
                    .addField(
                      "Kullanıcı Başarıyla Kaydedildi!\n\n\nDöküman ID:",
                      "\`\`\`" + `users.${message.author.id}` + "\`\`\`",
                    ),
                );
                client.channels.cache.get(ayarlar.sohbetchat).send(
                  new Discord.MessageEmbed()
                    .setColor("PURPLE")
                    .setThumbnail(
                      message.author.avatarURL({
                        dynamic: true,
                        format: "png",
                        size: 1024,
                      }),
                    )
                    .setDescription(
                      `:large_blue_diamond: **${nickname} - ${yaş}** Aramıza katıldı :partying_face:\n\n\n\n:white_heart: Senle birlikte **${client.guilds.cache.get(ayarlar.sunucuid).members.cache.filter((member) => !member.user.bot).size}** kişiyiz`,
                    ),
                );
              } else {
                message.channel.send("Kayıt İşlemi İptal Edildi.");
              }
              onay = false;
              break;
          }
        } catch (e) {
          message.channel.send(
            new Discord.MessageEmbed()
              .setColor("RED")
              .setDescription(
                `\`\`\`diff\n- Bir Hata Oluştu -\`\`\`\n\`\`\`js\n${e}\`\`\``,
              ),
          );
          onay = false;
          console.log(e);
        }
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
    onay = false;
    console.log(e);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0,
};

exports.help = {
  name: "kayıt",
};
