const http = require('http');
http.createServer(function(req, res) {
  res.write("Discord bot is active.\nPleace check it.");
  res.end();
}).listen(8080);

// Discord bot implements
const Discord = require('discord.js');
const a = 'intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]';
const client = new Discord.Client({ a });
const prefix = 'p!';
const token = process.env.DISCORD_BOT_TOKEN;

// botが準備できれば発動され、 上から順に処理される。
client.on('ready', () => {
  // コンソールにReady!!と表示
  console.log('Ready!!');

  // ステータスを設定する
  setInterval(() => {
    client.user.setActivity({
      name: `所属サーバー数は、${client.guilds.cache.size}サーバー｜Ping値は、${client.ws.ping}msです`,
    });
  }, 10000);
  client.channels.cache.get('889486664760721418').send('起動しました！');

  // readyイベントここまで
});

// ↓BOTstop用のresetBot関数の中身
function stopBot(channel) {
  // チャンネルにボットをリセットする旨のメッセージを送る [任意]
  channel.send('停止します');
  client.destroy();
  console.log('管理者によって、停止しました');
}

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
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          type: 'rich',
          title: 'Planet botについて',
          description: 'node.jsで作成された、適当なbotです。\n\n\nご不明な点は、以下のボタンから、サポートサーバーに参加して、お問い合わせください！',
          color: 0x498205,
          thumbnail: {
            url: 'https://dm2301files.storage.live.com/y4mHu8xS098WXra-akl0FwsCHTS9kaUNUgNOpn3lRpFd4bgAqmdzehL-InVE9WiZBZf6CeLkhebhbW40FC2_htnvc4o_1tqs1MjpdvuF4KGyHSxsArUXDsrhGbPoSRub9ZUA-c_xQlCdbs6r421fAJ73ZqQ8nIubzx2v_IJQG4Bi6ToveLanJyIkxWxDe-spoWX?width=500&height=500&cropmode=none',
            height: 0,
            width: 0,
          },
        },
      ],
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
            url:
              'https://cdn.glitch.com/093732ff-8a9a-41f2-bbc6-103db32effb2%2FPlanet%20BOT.png?v=1626835130086',
          },
          footer: {
            icon_url:
              'https://cdn.glitch.com/093732ff-8a9a-41f2-bbc6-103db32effb2%2FNEW%E3%83%AD%E3%82%B4_%E6%AD%A3%E6%96%B9%E5%BD%A2.jpg?v=1626835161805',
            text: 'This bot is made by Hoshimikan6490',
          },
          timestamp: new Date(),
        },
      ],
    });
  } else if (command === 'ping') {
    message.channel.send({
      embeds: [
        {
          title: '🏓Ping!!',
          description: `Pingは${Date.now() - message.createdTimestamp}msです。\n APIのPingは ${Math.round(client.ws.ping)}msです。`,
          color: 15132165,
          timestamp: new Date(),
        },
      ],
    });
  } else if (command === 'botadmin') {
    message.channel.send({
      embeds: [
        {
          title: 'このBOTの管理者👇',
          description: '<@728495196303523900>が管理しております。お問い合わせはこの人までどうぞ！',
          color: 3823616,
          timestamp: new Date(),
        },
      ],
    });
  } else if (command === 'me') {
    // ↓ここに指定した文字列がボットの発言になる
    const ReplyTtext = 'はい。メンションしてあげたよ！ｗ';
    message.reply(ReplyTtext);
  } else if (command === 'omikuji') {
    const arr = ['大吉', '中吉', '小吉', '吉', '凶', '大凶'];
    const random = Math.floor(Math.random() * arr.length);
    const result = arr[random];
    const reply = ['あなたは', result, 'を引きました！'].join('');
    message.channel.send({
      embeds: [
        {
          title: 'おみくじの結果！',
          description: reply,
          color: 4817413,
          footer: {
            icon_url:
              'https://cdn.glitch.com/093732ff-8a9a-41f2-bbc6-103db32effb2%2FNEW%E3%83%AD%E3%82%B4_%E6%AD%A3%E6%96%B9%E5%BD%A2.jpg?v=1626835161805',
            text: 'This bot is made by Hoshimikan6490',
          },
          timestamp: new Date(),
        },
      ],
    });
  } else if (command === 'tc_create') {
    // チャンネル管理権限チェック
    if (!message.member.permissions.has('MANAGE_CHANNELS')) {
      message.channel.send(`${message.author}\nあなたは、チャンネル管理権限を持っていないため、このコマンドを実行する権限がありません。`);
      // チャンネル名が無ければreturn
    } else if (!args.length) {
      message.channel.send(`${message.author}\n申し訳ありません。チャンネル名を指定してください。`);
    } else {
      message.channel.send(`チャンネル「${args}」を作成します。`);
      message.guild.channels.create(`${args}`, { parent: message.channel.parent });
    }
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

client.login(token);
