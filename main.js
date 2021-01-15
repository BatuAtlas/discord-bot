const Discord = require("discord.js");
const client = new Discord.Client();
const { Client, Util } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const ayarlar = require("./ayarlar.json");
require("./util/eventLoader")(client);

/*var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var ejs = require('ejs');
app.engine('.ejs', ejs.__express);
app.set('views',__dirname+'/views');
app.use(express.static(__dirname + '/html'));

app.get('/account', function(req, res){
    res.render(__dirname+'/html/index.ejs',{botname:"ApSePeri",hesapadı:"Batu",hesapyaşı:"14"});
});

app.get('/', function(req, res){
  res.render(__dirname+'/html/login.ejs',{botname:"ApSePeri"});
});



const listener = app.listen(3000, () => {console.log("Your app is listening on port " + listener.address().port);});
*/
setInterval(timefunc, 21600000);
function timefunc() {
  try {
    let d = new Date();
    let tarih = `${d.getDate().toString().length == 1 ? "0" + d.getDate() : d.getDate()}-${(d.getMonth() + 1).toString().length == 1 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1}`;
    var mm = client.guilds.cache.get(ayarlar.sunucuid).members.cache;
    mm.forEach((e) => {
      let a = db.get(`users.${e.user.id}`);
      if (a) {
        console.log(
          e.user.id +
            ":" +
            a.dtarih.split("").slice(0, 5).join("") +
            " --- " +
            tarih,
        );
        if (e._roles.includes(ayarlar.doğumgünürol)) {
          if (a.dtarih.split("").slice(0, 5).join("") != tarih) {
            e.roles.remove(ayarlar.doğumgünürol);
          }
        } else {
          if (a.dtarih.split("").slice(0, 5).join("").trim() == tarih.trim()) {
            e.roles.add(ayarlar.doğumgünürol);
            e.setNickname(`${a.name} - ${a.fastage + 1}`);
            client.channels.cache.get(ayarlar.sohbetchat).send(
              new Discord.MessageEmbed()
                .setColor("#e85000")
                .setThumbnail(
                  client.guilds.cache
                    .get(ayarlar.sunucuid)
                    .members.cache.get(e.user.id)
                    .user.avatarURL({
                      dynamic: true,
                      format: "png",
                      size: 1024,
                    }),
                )
                .setTitle("Yeni Bir Doğum Günü Çocuğu Var :mega: ")
                .setDescription(
                  `:diamond_shape_with_a_dot_inside: *Doğum günün kutlu olsun **${a.name}***\n:diamond_shape_with_a_dot_inside: *Yeni yaşın kutlu olsun.*\n:large_orange_diamond: **${a.fastage} ==> ${a.fastage + 1}**\n\n**Bugüne özel Doğum Günü çocuğu rolüne sahip olacaksın :smiling_face_with_3_hearts: **`,
                ),
            );
            db.add(`users.${e.user.id}.fastage`, 1);
          }
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}
client.on("ready", timefunc);
client.on("message", (m) => {
  function roleadd(e, r) {
    try {
      m.guild.member(e).roles.add(r);
    } catch (e) {}
  }
  function roleremove(e, r) {
    try {
      m.guild.member(e).roles.remove(r);
    } catch (e) {}
  }
  try {
    let mid = m.channel.id;
    if (mid == ayarlar.kurallarchat) {
      if (verfy(m.content)) {
        roleadd(m.author, ayarlar.kurallarrol);
        roleremove(m.author, ayarlar.unregisteredrol);
      }
      m.delete({});
    }
    if (mid == ayarlar.girischat) {
      if (verfy(m.content)) {
        roleadd(m.author, ayarlar.onaysızrol);
        roleremove(m.author, ayarlar.kurallarrol);
      }
      m.delete({});
    }
  } catch (e) {}
});
client.on("guildMemberAdd", async (member) => {
  try {
    let vr = db.fetch(`users.${member.user.id}`);
    if (!vr) {
      member.roles.add(ayarlar.unregisteredrol);
    } else {
      member.setNickname(`${vr.name} - ${vr.fastage}`);
      member.roles.add(ayarlar.kayıtlırol);
      //if(args[0].toLowerCase()=="kız"){message.guild.member(kisi).roles.add("kız")}else{message.guild.member(kisi).roles.add("erkekrol")}
      client.channels.cache
        .get(ayarlar.logchan)
        .send(
          `\`\`\`${vr.name} - ${vr.fastage} REJECTED? \`\`\`\`\`\`Id: ${vr.id}\`\`\``,
        );
      client.channels.cache.get(ayarlar.sohbetchat).send(
        new Discord.MessageEmbed()
          .setColor("PURPLE")
          .setThumbnail(
            `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=2048`,
          )
          .setDescription(
            `:large_blue_diamond: **${vr.name} - ${vr.fastage}** Aramıza tekrardan katıldı :partying_face:\n\n:fast_forward: İlk giriş tarihi: **${vr.katılım}**\n\n:white_heart: Senle birlikte **${client.guilds.cache.get(ayarlar.sunucuid).members.cache.filter((member) => !member.user.bot).size}** kişiyiz`,
          ),
      );
    }
  } catch (e) {
    console.log(e);
  }
});
function verfy(e) {
  try {
    if (e.toLowerCase() == "evet") {
      return true;
    } else return false;
  } catch (e) {}
}
/*<---->*/
var prefix = ayarlar.prefix;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  console.log("▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nLoading...");
  /*console.log(`${files.length} komut yüklenecek.`)*/ files.forEach((f) => {
    let props = require(`./commands/${f}`);
    /*console.log(`Yüklenen komut: ${prefix}${props.help.name}`)*/ client.commands.set(
      props.help.name,
      props,
    );
    props.conf.aliases.forEach((alias) => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = (command) => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./commands/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = (message) => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 1;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 2;
  if (message.author.id === message.guild.owner.id) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};
process.on("unhandledRejection", (error) => {
  console.error("JavaScript Hatası: ", error);
});
client.on("error", (error) => {
  console.error("Discord.JS bir hatayla karşılaştı: ", error);
});
client.login(ayarlar.token);