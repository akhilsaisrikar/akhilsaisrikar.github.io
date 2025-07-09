<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>IPTV Web Player</title>
  <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #111;
      color: #fff;
      display: flex;
      height: 100vh;
    }

    #sidebar {
      width: 300px;
      background: #1e1e1e;
      padding: 10px;
      overflow-y: auto;
    }

    #content {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .video-js {
      width: 100%;
      height: 400px;
      background: black;
    }

    .channel {
      padding: 5px;
      border-bottom: 1px solid #444;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .channel img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    .channel:hover {
      background: #333;
    }

    #logoOverlay {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 80px;
      height: 80px;
      background-image: url('https://upload.wikimedia.org/wikipedia/commons/9/9e/Video-Play-icon.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      z-index: 10;
    }

    #channelOverlay {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(0,0,0,0.8);
      padding: 12px 15px;
      border-radius: 10px;
      font-size: 18px;
      z-index: 10;
      display: none;
      min-width: 240px;
    }

    #settingsBtn {
      position: absolute;
      bottom: 15px;
      left: 15px;
      z-index: 11;
      padding: 8px 14px;
      background: #00adee;
      border: none;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    #settingsPanel {
      position: absolute;
      bottom: 70px;
      left: 15px;
      width: 280px;
      background: #1e1e1e;
      border: 1px solid #333;
      padding: 15px;
      border-radius: 10px;
      display: none;
      z-index: 12;
    }

    #settingsPanel h3 {
      margin: 0 0 10px;
      font-size: 18px;
    }

    #settingsPanel label {
      display: block;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    input[type="file"],
    input[type="password"] {
      width: 100%;
      margin-bottom: 10px;
      padding: 5px;
      border-radius: 4px;
      border: none;
    }
  </style>
</head>
<body>
  <div id="sidebar">
    <h3>📺 Channels</h3>
    <div id="channelList"></div>
  </div>

  <div id="content">
    <div id="logoOverlay"></div>
    <div id="channelOverlay"></div>

    <button id="settingsBtn">⚙️ Settings</button>
    <div id="settingsPanel">
      <h3>🔐 Settings</h3>
      <div id="passwordSection">
        <label for="settingsPassword">Enter Password</label>
        <input type="password" id="settingsPassword" placeholder="Enter password" />
        <button onclick="checkPassword()">Unlock</button>
      </div>

      <div id="settingsContent" style="display:none;">
        <label for="m3uInput">📂 Load M3U Playlist</label>
        <input type="file" id="m3uInput" accept=".m3u,.m3u8" />

        <label for="logoInput">🖼️ Upload Logo Overlay</label>
        <input type="file" id="logoInput" accept="image/*" />
      </div>
    </div>

    <video id="player" class="video-js vjs-default-skin" controls preload="auto"></video>
  </div>

  <script src="https://vjs.zencdn.net/8.10.0/video.min.js"></script>
  <script>
    const player = videojs("player");
    const channelListEl = document.getElementById("channelList");
    const logoOverlay = document.getElementById("logoOverlay");
    const channelOverlay = document.getElementById("channelOverlay");
    const settingsBtn = document.getElementById("settingsBtn");
    const settingsPanel = document.getElementById("settingsPanel");
    const settingsPassword = document.getElementById("settingsPassword");
    const passwordSection = document.getElementById("passwordSection");
    const settingsContent = document.getElementById("settingsContent");

    let channels = [];
    let currentChannelIndex = 0;

    const PASSWORD = "1234";

    settingsBtn.addEventListener("click", () => {
      settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
    });

    function checkPassword() {
      if (settingsPassword.value === PASSWORD) {
        passwordSection.style.display = "none";
        settingsContent.style.display = "block";
      } else {
        alert("Incorrect password");
      }
    }

    function parseM3U(content) {
      const lines = content.split("\n");
      let current = {};
      let parsed = [];

      for (let line of lines) {
        if (line.startsWith("#EXTINF")) {
          const nameMatch = line.match(/,(.*)/);
          const logoMatch = line.match(/tvg-logo="([^"]+)"/);
          current = {
            name: nameMatch ? nameMatch[1] : "Unnamed",
            logo: logoMatch ? logoMatch[1] : "",
          };
        } else if (line.startsWith("http")) {
          current.url = line.trim();
          parsed.push({...current});
        }
      }
      return parsed;
    }

    function loadChannels(data) {
      channelListEl.innerHTML = "";
      channels = data;

      data.forEach((ch, i) => {
        const el = document.createElement("div");
        el.className = "channel";
        el.innerHTML = `
          <img src="${ch.logo}" onerror="this.src='https://via.placeholder.com/40'" />
          <div><strong>${i + 1}.</strong> ${ch.name}</div>
        `;
        el.onclick = () => {
          currentChannelIndex = i;
          playChannel(ch);
        };
        channelListEl.appendChild(el);
      });

      if (channels.length > 0) {
        playChannel(channels[0]);
      }
    }

    function playChannel(channel) {
      player.src({ type: "application/x-mpegURL", src: channel.url });
      player.play();
      showChannelOverlay(currentChannelIndex);
    }

    function showChannelOverlay(index) {
      const curr = channels[index];
      const prev = channels[index - 1];
      const next = channels[index + 1];

      channelOverlay.innerHTML = `
        🎬 <strong>Channel ${index + 1}:</strong> ${curr.name}<br>
        ⏭️ Next: ${next ? next.name : '—'}<br>
        ⏮️ Previous: ${prev ? prev.name : '—'}
      `;
      channelOverlay.style.display = "block";
      setTimeout(() => {
        channelOverlay.style.display = "none";
      }, 4000);
    }

    document.getElementById("m3uInput").addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const parsed = parseM3U(reader.result);
        loadChannels(parsed);
      };
      if (file) reader.readAsText(file);
    });

    document.getElementById("logoInput").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        logoOverlay.style.backgroundImage = `url('${reader.result}')`;
      };
      reader.readAsDataURL(file);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        if (currentChannelIndex < channels.length - 1) {
          currentChannelIndex++;
          playChannel(channels[currentChannelIndex]);
        }
      } else if (e.key === "ArrowUp") {
        if (currentChannelIndex > 0) {
          currentChannelIndex--;
          playChannel(channels[currentChannelIndex]);
        }
      } else if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1;
        if (channels[idx]) {
          currentChannelIndex = idx;
          playChannel(channels[idx]);
        }
      }
    });
  </script>
</body>
</html>
