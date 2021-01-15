const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const kategoriler = require("../kategoriler.json");

exports.run = async (client, message, args) => {
  try {
    if (message.channel.id != ayarlar.adamasmacachat)
      return message.reply("Burası Adam Asmaca oyunun odası değil!");
    let members = message.mentions.users.map((e) => {
      return { username: e.username, bot: e.bot, id: e.id };
    });
    if (members.length == 0)
      return message.channel.send(
        new Discord.MessageEmbed()
          .setColor("#ffff66")
          .setImage(picture("hello"))
          .setTitle("Adam Asmaca")
          .setTimestamp()
          .setFooter("ApSePeri Adam Asmaca")
          .setDescription(
            "**Nasıl Oynanır?**\nOyunda sistem seçtiğiniz kategoriden rasgele bir kelime seçer. Sizde arkadaşlarınız ile seçilen kelimeyi bulmaya çalışırsınız.\n\n**Oyun nasıl başlatılır?**\nOyuna başlamak için `z!adam-asmaca` yazıp devamına kategoriyi ve oyunu oynayacağınız kişileri etiketlemelisiniz(Kendinizide etiketlemelisiniz)\n**Ex: **z!adam-asmaca hayvanlar <@" +
              message.author.id +
              "> <@!2> <@!3>\n\n**Kategoriler: **\n\`\`\`diff\n-Hayvanlar => " +
              kategoriler.hayvanlar.length +
              "\n-Bitkiler => " +
              kategoriler.bitkiler.length +
              "\n-Ülkeler => " +
              kategoriler.ülkeler.length +
              "\n-Meslekler => " +
              kategoriler.meslekler.length +
              "\`\`\`\n**Kurallar ve Bilgilendirme:**\`\`\`fix\n1) Oyunu en az 2, en fazla 10 kişi oynayabilir.\n2) Çöp adam 8 adımda tamamlanır.\n3) Eğer doğru kelime ve harfi derseniz adım sayınız azalmaz!\n4) Yanlış kelime ve harf verirseniz adım sayınız 1 eksilir!\n5)Yukarıda kategorilerin yanlarındaki sayılar o kategoride kaç kelime olduğunu belirtir.\n6) Eğer aranızda konuşmak isterseniz yazdığınız metnin en başına . koyun.\`\`\`",
          ),
      );
    if (members.length < 2)
      return message.reply(
        "Bu oyunu oynayabilmek için en az 2 kişi olunmalıdır!",
      );
    if (members.length > 10)
      return message.reply("Bu oyunu en az 10 kişi birlikte oynayabilir");
    if (!lister(args[0])) return message.reply("Böyle bir kategori yok!");
    if (members.some((w) => w.bot == true))
      return message.reply("Botlar ile oynayamazsın");
    let oyuncidlist = members.map((e) => {
      return e.id;
    });
    let oyunculist = members.map((e) => {
      return e.id;
    });
    let havalıliste = [];
    let onaylandılist = [];
    await members.forEach((e) => {
      havalıliste.push(
        `${onaylandılist.includes(e.username) ? "✔️" : "✖️"} => ${e.username}`,
      );
    });
    let mesaj = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#ffff66")
        .setTitle("Adam Asmaca")
        .setTimestamp()
        .setFooter("ApSePeri Adam Asmaca")
        .setDescription(`\`\`\`css\nAsagida verilen oyuncular ile oyun baslatilacaktir\nLutfen [Evet] yaziniz\`\`\`\n\n
**Oyuncu Listesi:**\n\`\`\`yaml\n${havalıliste.join("\n")}\`\`\``),
    );
    let onaylı2 = true;
    while (oyunculist.length != 0 && onaylı2) {
      const filter = (response) => {
        return (
          oyuncidlist.some((w) => response.author.id == w) &&
          response.content.toLowerCase() == "evet" &&
          response.content.split("").splice(0, 1).join("") != "."
        );
      };
      await message.channel
        .awaitMessages(filter, { max: 1, time: 100000, errors: ["time"] })
        .then(async (collected) => {
          if (oyunculist.includes(collected.first().author.id)) {
            await oyunculist.splice(
              oyunculist.indexOf(collected.first().author.id),
              1,
            );
          }
          await onaylandılist.push(collected.first().author.id);
          havalıliste = [];
          await members.forEach((e) => {
            havalıliste.push(
              `${onaylandılist.includes(e.id) ? "✔️" : "✖️"} => ${e.username}`,
            );
          });
          mesaj.edit(
            new Discord.MessageEmbed()
              .setColor("#ffff66")
              .setTitle("Adam Asmaca")
              .setTimestamp()
              .setFooter("ApSePeri Adam Asmaca")
              .setDescription(`\`\`\`css\nAsagida verilen oyuncular ile oyun baslatilacaktir\nLutfen [Evet] yaziniz\`\`\`\n\n
        **Oyuncu Listesi:**\n\`\`\`yaml\n${havalıliste.join("\n")}\`\`\``),
          );
        })
        .catch((e) => {
          onaylı2 = false;
          message.channel.send(
            "100 saniyedir cevap vermediniz. Oyun iptal edildi. Tüm oyuncular 100 saniye içinde evet yazmalıdır.",
          );
        });
    }
    let onaylı = oyunculist.length == 0 ? true : false;
    let kelime = await lister(args[0]);
    let gkelime = await tkret(kelime).split("");
    let say = await Math.floor(Math.random() * (kelime.split("").length + 1));
    gkelime[say] = await kelime.split("")[say];
    let söylenenkelimeler = [];
    let kalanadım = 8;
    await söylenenkelimeler.push(kelime.split("")[say]);
    if (onaylı)
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor("#ffff66")
          .setImage(picture(kalanadım))
          .setTitle("Adam Asmaca")
          .setDescription("\`\`\`" + gkelime.join(" ") + "\`\`\`")
          .setTimestamp()
          .setFooter("ApSePeri Adam Asmaca")
          .addField(
            "Söylenen Kelimeler",
            `${söylenenkelimeler.length == 0 ? "\`\`\`fix\nHiçbir kelime girilmedi\`\`\`" : `\`\`\`fix\n${söylenenkelimeler.join(" ")}\`\`\``}`,
            true,
          )
          .addField(
            "Kalan Adım Sayısı",
            `\`\`\`css\n[${kalanadım}]\`\`\``,
            true,
          ),
      );
    console.log(kelime);
    while (onaylı && kalanadım != 0 && gkelime.includes("_")) {
      const filter2 = (response) => {
        return (
          (oyuncidlist.some((w) => response.author.id == w) &&
            !söylenenkelimeler.some(
              (w) => response.content.toLowerCase() == w,
            ) &&
            söylenenkelimeler.some(
              (w) => response.content.toLowerCase() != w,
            ) &&
            response.content.split("").length == 1) ||
          (response.content.length == kelime.split("").length &&
            response.content.split("").splice(0, 1).join("") != ".")
        );
      };
      await message.channel
        .awaitMessages(filter2, { max: 1, time: 500000, errors: ["time"] })
        .then(async (collected) => {
          let söylenen = collected.first().content.toLowerCase();
          if (söylenen.split("").length == 1) {
            if (kelime.includes(söylenen)) {
              await çevir(söylenen);
              message.channel.send(
                new Discord.MessageEmbed()
                  .setColor("#ffff66")
                  .setImage(picture(kalanadım))
                  .setTitle("Adam Asmaca")
                  .setDescription("\`\`\`" + gkelime.join(" ") + "\`\`\`")
                  .setTimestamp()
                  .setFooter("ApSePeri Adam Asmaca")
                  .addField(
                    "Söylenen Kelimeler",
                    `${söylenenkelimeler.length == 0 ? "\`\`\`fix\nHiçbir kelime girilmedi\`\`\`" : `\`\`\`fix\n${söylenenkelimeler.join(" ")}\`\`\``}`,
                    true,
                  )
                  .addField(
                    "Kalan Adım Sayısı",
                    `\`\`\`css\n[${kalanadım}]\`\`\``,
                    true,
                  ),
              );
              if (kalanadım == 0) {
                b(kelime);
                onaylı = false;
              }
            } else {
              await kalanadım--;
              await söylenenkelimeler.push(söylenen);
              if (kalanadım == 0) {
                b(kelime);
                onaylı = false;
              } else {
                message.channel.send(
                  new Discord.MessageEmbed()
                    .setColor("#ffff66")
                    .setImage(picture(kalanadım))
                    .setTitle("Adam Asmaca")
                    .setDescription("\`\`\`" + gkelime.join(" ") + "\`\`\`")
                    .setTimestamp()
                    .setFooter("ApSePeri Adam Asmaca")
                    .addField(
                      "Söylenen Kelimeler",
                      `${söylenenkelimeler.length == 0 ? "\`\`\`fix\nHiçbir kelime girilmedi\`\`\`" : `\`\`\`fix\n${söylenenkelimeler.join(" ")}\`\`\``}`,
                      true,
                    )
                    .addField(
                      "Kalan Adım Sayısı",
                      `\`\`\`css\n[${kalanadım}]\`\`\``,
                      true,
                    ),
                );
              }
            }
            if (!gkelime.join("").includes("_")) {
              a(kelime);
              onaylı = false;
            }
          } else {
            if (söylenen == kelime) {
              await a(kelime);
              onaylı = false;
            } else {
              await kalanadım--;
              await söylenenkelimeler.push(söylenen);
              if (kalanadım == 0) {
                b(kelime);
                onaylı = false;
              } else {
                message.channel.send(
                  new Discord.MessageEmbed()
                    .setColor("#ffff66")
                    .setImage(picture(kalanadım))
                    .setTitle("Adam Asmaca")
                    .setDescription("\`\`\`" + gkelime.join(" ") + "\`\`\`")
                    .setTimestamp()
                    .setFooter("ApSePeri Adam Asmaca")
                    .addField(
                      "Söylenen Kelimeler",
                      `${söylenenkelimeler.length == 0 ? "\`\`\`fix\nHiçbir kelime girilmedi\`\`\`" : `\`\`\`fix\n${söylenenkelimeler.join(" ")}\`\`\``}`,
                      true,
                    )
                    .addField(
                      "Kalan Adım Sayısı",
                      `\`\`\`css\n      [${kalanadım}]\`\`\``,
                      true,
                    ),
                );
              }
            }
          }
        })
        .catch((e) => {
          onaylı = false;
          message.channel.send(
            "100 saniyedir cevap vermediniz. Oyun iptal edildi. Tüm oyuncular 100 saniye içinde evet yazmalıdır.",
          );
        });
      function çevir(aye) {
        let ssy = -1;
        kelime.split("").forEach((e) => {
          ssy++;
          if (e == aye) {
            gkelime[ssy] = kelime.split("")[ssy];
          }
        });
      }
    } //while
    function a(k) {
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle("ApSePeri Adam Asma Oyunu")
          .setThumbnail(client.user.avatarURL())
          .setDescription(
            ":small_orange_diamond: **Oyunu Kazadınız :star_struck:**\n\n:small_blue_diamond: Gizli kelime **" +
              k +
              "**",
          ),
      );
    }
    function b(k) {
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor("RED")
          .setTitle("ApSePeri Adam Asma Oyunu")
          .setThumbnail(client.user.avatarURL())
          .setDescription(
            ":small_orange_diamond: **Oyunu kaybettiniz :pensive: **\n\n:small_blue_diamond: Gizli kelime **" +
              k +
              "**",
          ),
      );
    }
  } catch (e) {
    message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    console.log(e);
  }
};

function tkret(ab) {
  let ttt = "";
  ab.split("").forEach((ts) => {
    ttt += ts == " " ? "/" : "_";
  });
  return ttt;
}

function lister(e) {
  switch (e.toLowerCase()) {
    case "ülkeler":
      return kategoriler.ülkeler[
        Math.floor(Math.random() * kategoriler.ülkeler.length)
      ];
      break;
    case "bitkiler":
      return kategoriler.bitkiler[
        Math.floor(Math.random() * kategoriler.bitkiler.length)
      ];
      break;
    case "meslekler":
      return kategoriler.meslekler[
        Math.floor(Math.random() * kategoriler.meslekler.length)
      ];
      break;
    case "hayvanlar":
      return kategoriler.hayvanlar[
        Math.floor(Math.random() * kategoriler.hayvanlar.length)
      ];
      break;
    default:
      return false;
      break;
  }
}
function picture(e) {
  let link = "https://cdn.discordapp.com/attachments/730971475816743013/";
  switch (e) {
    default:
      return link + "799552819907526656" + "/adamasmaca.png";
      break; //hello
    case 8:
      return link + "799549486010728478" + "/1.png";
      break;
    case 7:
      return link + "799549305320898560" + "/2.png";
      break;
    case 6:
      return link + "799549306918141952" + "/3.png";
      break;
    case 5:
      return link + "799549308051390494" + "/4.png";
      break;
    case 4:
      return link + "799549309568811068" + "/5.png";
      break;
    case 3:
      return link + "799549310727225344" + "/6.png";
      break;
    case 2:
      return link + "799549311876333588" + "/7.png";
      break;
    case 1:
      return link + "799549314501574686" + "/8.png";
      break;
    case 0:
      return link + "799554064869359626" + "/9.png";
      break; //die
  }
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["adamasmaca"],
  permLevel: 0,
};

exports.help = {
  name: "adam-asmaca",
};
