let discordName = document.getElementById("discordName");
let discordMotd = document.getElementById("discordMotd");
let avatarLink = document.getElementById("avatarLink");

let rpcName = document.getElementById("rpcName");
let rpcDetails = document.getElementById("rpcDetails");

let webSocket = new WebSocket("wss://api.lanyard.rest/socket");
let discordID = "627013557695021087";

function updateClock() {
  const clock = document.querySelector('.clock');
  const clockTimezone = document.querySelector('.clockTimezone');

  // lấy thời gian hiện tại
  const now = moment();

  // định dạng ngày giờ
  const time = now.format('HH:mm:ss');
  const timezone = now.format('ddd, D MMM YYYY');

  // hiển thị ngày giờ
  clock.innerHTML = time;
  clockTimezone.innerHTML = timezone;
}

// cập nhật thời gian mỗi giây
setInterval(updateClock, 1000);

fetch(`https://api.lanyard.rest/v1/users/${discordID}`)
  .then((response) => response.json())
  .then((e) => {
    
    if(e.data["discord_user"]){
      discordName.innerText = `${e.data.discord_user.username}#${e.data.discord_user.discriminator}`;
      avatarLink.href = `https://discord.com/users/${discordID}`;
      discordMotd.innerText = e.data.kv.motd;
      document.getElementById("discordAvatar").src = `https://cdn.discordapp.com/avatars/${discordID}/${e.data["discord_user"].avatar}.png?size=4096`;
      if (e.data.discord_status == "online") {
        document.getElementById("statusCircle").style.backgroundColor = "#23a55a";
      }
      else if (e.data.discord_status == "idle"){
        document.getElementById("statusCircle").style.backgroundColor = "#f0b232";
      }
      else if (e.data.discord_status == "dnd"){
        document.getElementById("statusCircle").style.backgroundColor = "#f23f43";
      }
      else if (e.data.discord_status == "offline"){
        document.getElementById("statusCircle").style.backgroundColor = "#80848e";
      }
    }

    if (e.data["activities"].length > 0) {
      rpcName.innerText = e.data["activities"][0].name
      rpcDetails.innerText = e.data["activities"][0].details + '\n' + e.data["activities"][0].state
      document.getElementById("rpcIcon").src = `https://cdn.discordapp.com/app-assets/${e.data["activities"][0].application_id}/${e.data["activities"][0].assets.large_image}.png`;
      document.getElementById("rpcSmallIcon").src = `https://cdn.discordapp.com/app-assets/${e.data["activities"][0].application_id}/${e.data["activities"][0].assets.small_image}.png`;
    } else {
      rpcName.innerText = "None"
      rpcDetails.innerText = "I'm not currently playing anything"
      rpcState.innerText = ""
      document.getElementById("rpcIcon").src = `https://hoocs151.github.io/hoocsxyz/images/game.png`;
      document.getElementById("rpcSmallIcon").src = `https://raw.githubusercontent.com/Hoocs151/hoocs/main/images/transparent.png`;
    }
  });

webSocket.addEventListener("message", (event) => {
  data = JSON.parse(event.data);

  if (event.data == '{"op":1,"d":{"heartbeat_interval":30000}}') {
    webSocket.send(
      JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: discordID,
        },
      })
    );
    setInterval(() => {
      webSocket.send(
        JSON.stringify({
          op: 3,
          d: {
            heartbeat_interval: 30000,
          },
        })
      );
    }, 30000);
  }
  if (data.t == "PRESENCE_UPDATE") {
    if (data.d.activities.length > 0) {
      rpcName.innerText = data.d["activities"][0].name
      rpcDetails.innerText = data.d["activities"][0].details + '\n' + data.d["activities"][0].state
      document.getElementById("rpcIcon").src = `https://cdn.discordapp.com/app-assets/${data.d["activities"][0].application_id}/${data.d["activities"][0].assets.large_image}.png`;
      document.getElementById("rpcSmallIcon").src = `https://cdn.discordapp.com/app-assets/${data.d["activities"][0].application_id}/${data.d["activities"][0].assets.small_image}.png`;
    } else {
      rpcName.innerText = "None"
      rpcDetails.innerText = "I'm not currently playing anything"
      rpcState.innerText = ""
      document.getElementById("rpcIcon").src = `https://hoocs151.github.io/hoocsxyz/images/game.png`;
      document.getElementById("rpcSmallIcon").src = `https://hoocs151.github.io/hoocsxyz/images/transparent.png`;
    }
  }
});