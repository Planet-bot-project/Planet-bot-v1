//botのステータスを表示
const http = require('http');
http.createServer(function(req, res) {
  res.write("Discord bot is active.\nPleace check it.");
  res.end();
}).listen(8080);

// BOTの初期設定
const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const prefix = "p!";
const token = process.env.DISCORD_BOT_TOKEN;

// botが準備できれば発動され、 上から順に処理される。
client.on("ready", () => {
  // コンソールにReady!!と表示
  console.log("Ready!!");

  // ステータスを設定する
    //ステータスの選択肢
    //・online：オンライン
    //・idle：退席中
    //・dnd：取り込み中
    //・invisibl：オンラインを隠す
  client.user.setActivity(
     // ○○サーバーを設定
    client.guilds.cache.size + "サーバー",
	 // ～をプレイ中に設定
	  { type: "WATCHING" },
	 // オンラインに設定
	  { status: "online" });
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
          "type": 1,
          "components": [
            {
              "style": 5,
              "label": `サポートサーバーへ参加する`,
              "url": `https://discord.gg/uYYaVRuUuJ`,
              "disabled": false,
              "type": 2
            }
          ]
        }
      ],
      embeds: [
        {
          "type": "rich",
          "title": `Planet botについて`,
          "description": `node.jsで作成された、適当なbotです。\n\n\nご不明な点は、下記「お問い合わせ」ボタンから、どうぞ！`,
          "color": 0x498205,
          "thumbnail": {
            "url": `https://dm2301files.storage.live.com/y4mHu8xS098WXra-akl0FwsCHTS9kaUNUgNOpn3lRpFd4bgAqmdzehL-InVE9WiZBZf6CeLkhebhbW40FC2_htnvc4o_1tqs1MjpdvuF4KGyHSxsArUXDsrhGbPoSRub9ZUA-c_xQlCdbs6r421fAJ73ZqQ8nIubzx2v_IJQG4Bi6ToveLanJyIkxWxDe-spoWX?width=500&height=500&cropmode=none`,
            "height": 0,
            "width": 0
          }
        }
      ]
    })
  } else if (command === 'ping') {
		message.channel.send({
      embeds: [
        {
          title: "🏓Ping!!",
          description: `Pingは${Date.now() - message.createdTimestamp}msです。\n APIのPingは ${Math.round(client.ws.ping)}msです。`,
          color: 15132165,
          timestamp: new Date()
        }
       ]
    })
  } else if (command === 'botadmin') {
    message.channel.send({
      embeds: [
        {
         title: "このBOTの管理者👇",
         description:
           "<@728495196303523900>が管理しております。お問い合わせはこの人までどうぞ！",
         color: 3823616,
         timestamp: new Date()
        }
       ]
    })
  } else if (command === 'me') {
    // ↓ここに指定した文字列がボットの発言になる
    let reply_text = "👈あなたの名前";
    message
      .reply(reply_text)
      .then(message => console.log("Sent message: " + reply_text))
      .catch(console.error);
    return;
    
  } else if (command === 'help') {
    message.channel.send({
      embeds: [
        {
         title: "Planet BOT HELP",
         description:
           "`p!ping`でPINGを見てみよう！\n\n`p!botadmin`で管理者のメンションをするよ\n\n`p!me`であなたにメンションするよ\n\n`p!help`でこれを表示するよ\n\n`p!omikuji`でおみくじを引けるよ\n\n`p!reset`でBOTを再起動するよ(__**管理者限定機能**__)\n\n`p!stop`でBOTを停止するよ(__**管理者限定機能**__)",
         color: 4303284,
         thumbnail: {
           url:
             "https://cdn.glitch.com/093732ff-8a9a-41f2-bbc6-103db32effb2%2FPlanet%20BOT.png?v=1626835130086"
         },
         footer: {
           icon_url:
             "https://cdn.glitch.com/093732ff-8a9a-41f2-bbc6-103db32effb2%2FNEW%E3%83%AD%E3%82%B4_%E6%AD%A3%E6%96%B9%E5%BD%A2.jpg?v=1626835161805",
           text: "This bot is made by Hoshimikan6490"
         },
         timestamp: new Date()
        }
       ]
     })
  } else if (command === 'reset') {
  // ↓UserIDがHoshimikan6490なら、
    if (message.author.id === "728495196303523900") {
    // ↓リセットを実行
      resetBot(message.channel);
    // ↓そうでないのなら、エラーメッセージを送信
    } else {
      message.channel.send("申し訳ございません。あなたにそのコマンドを実行する権限がありません。\n詳細は作者までお問い合わせください。");
    }
  } else if (command === 'stop') {
  // ↓UserIDがHoshimikan6490なら、
    if (message.author.id === "728495196303523900") {
    // ↓リセットを実行
      stopBot(message.channel);
    // ↓そうでないのなら、エラーメッセージを送信
    } else {
      message.channel.send("申し訳ございません。あなたにそのコマンドを実行する権限がありません。\n詳細は作者までお問い合わせください。");
    }
  } else if (command === 'omikuji') {
    let arr = ["大吉", "中吉", "小吉", "吉", "凶", "大凶"];
    var random = Math.floor(Math.random() * arr.length);
    var result = arr[random];
    message.channel.send({
      embeds: [
        {
          title: "おみくじの結果！",
          description: "あなたは、" + result + "を引きました！",
          color: 4817413,
          footer: {
            icon_url:
            "https://cdn.glitch.com/093732ff-8a9a-41f2-bbc6-103db32effb2%2FNEW%E3%83%AD%E3%82%B4_%E6%AD%A3%E6%96%B9%E5%BD%A2.jpg?v=1626835161805",
            text: "This bot is made by Hoshimikan6490"
          },
          timestamp: new Date()
        }
      ]
    });
  } else {
    message.channel.send('そのコマンドは存在しません。(m´・ω・｀)m ｺﾞﾒﾝ…')
  }
})
    

// ↓BOTリセット用のresetBot関数の中身
function resetBot(channel) {
  // チャンネルにボットをリセットする旨のメッセージを送る
  channel
    .send("再起動しています...");
    .then(msg => client.destroy());
    .then(() => client.login(process.env.DISCORD_BOT_TOKEN));
    .send("起動しました！");
}

// ↓BOTstop用のresetBot関数の中身
function stopBot(channel) {
  // チャンネルにボットをリセットする旨のメッセージを送る [任意]
  channel
    .send("停止しています...");
    .then(msg => client.destroy());
    .send("停止しました！");
}

client.login(token);
