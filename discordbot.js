const http = require('http');
http.createServer(function(req, res) {
  res.write('Discord bot is active.\nPleace check it.');
  res.end();
}).listen(8080);


// Discord bot implements
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const prefix = 'p!';
const token = process.env.DISCORD_BOT_TOKEN;

// botが準備できれば発動され、 上から順に処理される。
client.on("ready", () => {
  // コンソールにReady!!と表示
  console.log("Ready!!");

  // ステータスを設定する
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜　Ping値は、${client.ws.ping}msです`
    })
  }, 10000)
  client.channels.cache.get("889486664760721418").send("起動しました！");

  // readyイベントここまで
});


// botがメッセージを受信すると発動され、 上から順に処理される。
client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'about') {
    message.channel.send({
      components: [
        {
          type: 1,
          components: [
            {
              style: 5,
              label: 'サポートサーバーへ参加する',
              url: 'https://discord.gg/uYYaVRuUuJ',
              disabled: false,
              type: 2
            }
          ]
        }
      ],
      embeds: [
        {
          type: 'rich',
          title: 'Planet botについて',
          description: 'node.jsで作成された、適当なbotです。\n\n\nご不明な点は、以下のボタンから、サポートサーバーに参加して、お問い合わせください！',
          color: 0x498205,
          thumbnail: {
            url: 'attachment://logo.png'
          },
          footer: {
            text: 'This bot is made by Hoshimikan6490',
            icon_url: 'attachment://me.png',
          },
        }
      ],
      files: [
        {
          attachment: "images/logo.png",
          name: "logo.png"
        }, {
          attachment: "images/me.png",
          name: "me.png"
        }
      ]
    });

  } else if (command === 'help') {
    message.channel.send({
      embeds: [
        {
          title: 'Planet BOT HELP',
          description:
            '`p!ping`でPINGを見てみよう！\n\n`p!botadmin`でこのBOTの管理者のメンションをするよ\n\n`p!me`であなたにメンションするよ\n\n`p!help`でこれを表示するよ\n\n`p!omikuji`でおみくじを引けるよ\n\n`p!tc_create <チャンネル名>`でテキストチャンネルを作成するよ\n　※要、チャンネル管理権限\n\n`p!stop`でBOTを停止するよ(__**BOT管理者限定機能**__)',
          color: 4303284,
          thumbnail: {
            url: 'attachment://logo.png'
          },
          timestamp: new Date()
        }
      ],
      files: [
        {
          attachment: "images/logo.png",
          name: "logo.png"
        }
      ]
    });
  } else if (command === 'ping') {
    message.channel.send({
      embeds: [
        {
          title: '🏓Ping!!',
          description: `Pingは${Date.now() - message.createdTimestamp}msです。\n APIのPingは ${Math.round(client.ws.ping)}msです。`,
          color: 15132165,
          timestamp: new Date()
        }
      ]
    });

  } else if (command === 'botadmin') {
    message.channel.send({
      embeds: [
        {
          title: 'このBOTの管理者👇',
          description: '<@728495196303523900>が管理しております。お問い合わせはこの人までどうぞ！',
          color: 3823616,
          timestamp: new Date()
        }
      ]
    });

  } else if (command === 'me') {
    message.reply("メンションしてほしいんだよね？笑笑")

  } else if (command === 'omikuji') {
    let arr = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
    var random = Math.floor(Math.random() * arr.length);
    var result = arr[random];
    message.channel.send({
      embeds: [
        {
          title: 'おみくじの結果！',
          description: 'あなたは、' + result + 'を引きました！',
          color: 4817413,
          timestamp: new Date()
        }
      ]
    });

  } else if (command === 'tc_create') {
    // チャンネル管理権限チェック
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      return message.channel.send(`${message.author}\nあなたは、チャンネル管理権限を持っていないため、このコマンドを実行する権限がありません。`);
      // チャンネル名が無ければreturn
    } else if (!args.length) {
      return message.channel.send(`${message.author}\n申し訳ありません。チャンネル名を指定してください。`);
    }
    message.channel.send(`チャンネル「${args}」を作成しました。`);
    message.guild.channels.create(`${args}`, { parent: message.channel.parent });

  } else if (command === 'stop') {
    // ↓UserIDがHoshimikan6490なら、
    if (message.author.id === '728495196303523900') {
      // ↓リセットを実行
      stopBot(message.channel);
      // ↓そうでないのなら、エラーメッセージを送信
    } else {
      message.channel.send('申し訳ございません。あなたにそのコマンドを実行する権限がありません。\n詳細は作者までお問い合わせください。');
    }
  } else {
    message.channel.send('そのコマンドは存在しません。(m´・ω・｀)m ｺﾞﾒﾝ…');
  }
});


// ↓BOTstop用のresetBot関数の中身
function stopBot(channel) {
  // チャンネルにボットをリセットする旨のメッセージを送る [任意]
  channel.send('停止します');
  client.destroy();
  console.log('管理者によって、停止しました');
}


client.login(token);
