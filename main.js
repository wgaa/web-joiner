if (location.protocol === "file:" || location.protocol === "content:") {
  alert("HTMLファイルが直接開かれたことを検知しました。\nCORSエラーや、hCaptchaウィジェットのHostエラーなどが理由で正常に使用できない可能性があります。\nhttps://discord-joiner.soyaaaaana.com を使用してください。");
}

let captcha_invites = [];

let strict_mode = false;
let auto_scroll_mode = true;

let first = true;
function log(message) {
  const element = document.getElementById("log");
  if (element) {
    element.value += (first ? "" :"\n") + message;
    if (auto_scroll_mode) {
      element.scrollTop = element.scrollHeight;
    }
  }
  first = false;
}

function startCaptcha() {
  removeCaptcha();
  if (captcha_invites.length) {
    initCaptcha(captcha_invites[0].captcha_sitekey, captcha_invites[0].captcha_rqdata);
  }
  else {
    // complete
    elementDisabled(false);
    log("✅ 全ての操作が完了しました！");
  }
}

function removeCaptcha() {
  document.querySelectorAll("iframe[data-hcaptcha-widget-id]").forEach(widget => {
    hcaptcha.remove(widget.getAttribute("data-hcaptcha-widget-id"));
  });
}

async function onSuccess(key) {
  console.log("Captcha Solved: " + key);
  log("✅ Captchaが解決されました！");
  const invite_data = captcha_invites[0];
  await invite_main(invite_data.discord_token, invite_data.invite_code, invite_data.x_context_properties, invite_data.x_fingerprint, invite_data.session_id, invite_data.captcha_session_id, invite_data.captcha_rqtoken, key);
  captcha_invites.shift();
  startCaptcha();
}

let loaded = false;

function onCaptchaLoad() {
  loaded = true;
}

function initCaptcha(sitekey, rqdata) {
  const container = document.getElementById("captcha-box");

  if (!container) {
    log("❌ キャプチャを表示するためのコンテナが見つかりません。");
    return;
  }

  if (!loaded) {
    log("❌ hCaptchaウィジェットはまだ読み込まれていません。少し待ってから再試行してください。");
    return;
  }

  try {
    let params = { 
      sitekey: "f0864320-0452-4f48-b2f2-8eea8b8e93fa", // ★いくらさんのSitekeyに変更
      callback: onSuccess,
      theme: "dark"
    };

    container.innerHTML = "";
    window.hcaptcha.render("captcha-box", params);

    hcaptcha.setData("captcha-box", { rqdata: rqdata });

    log("hCaptchaウィジェットを配置しました。解決してください。");
  }
  catch (e) {
    console.error(e);
    log("❌ hCaptchaのレンダリングに失敗しました。");
  }
}

function CheckOs() {
  var ua = navigator.userAgent;
  var os;

  if (ua.match(/Win(dows )?NT 10\.0/)) {
    os = { name: "Windows", version: "10" };
  }
  else if (ua.match(/Win(dows )?NT 6\.3/)) {
    os = { name: "Windows", version: "8.1" };
  }
  else if (ua.match(/Win(dows )?NT 6\.2/)) {
    os = { name: "Windows", version: "8" };
  }
  else if (ua.match(/Win(dows )?(NT [654]|9.)/)) {
    os = { name: "Windows", version: "0" };
  }
  else if (ua.match(/Mac OS X ([0-9]+)[_.]([0-9]+)[_.]([0-9]+)/)) {
    os = { name: "macOS", version: RegExp.$1 + "." + RegExp.$2 + "." + RegExp.$3 };
  }
  else if (ua.match(/Mac|PPC/)) {
    os = { name: "macOS", version: "0" };
  }
  else if (ua.match(/iPhone|iPad/)) {
    os = { name: "iOS", version: "0" };
  }
  else if (ua.match(/Android ([\.\d]+)/)) {
    os = { name: "Android", version: RegExp.$1 };
  }
  else if (ua.match(/Linux/)) {
    os = { name: "Linux", version: "0" };
  }
  else if (ua.match(/^.*\s([A-Za-z]+BSD)/)) {
    os = { name: RegExp.$1, version: "0" };
  }
  else {
    os = { name: "Unknown", version: "0" };
  }

  return os;
}

function CheckBrowser() {
  var nvUA = navigator.userAgent;
  var cutSt, cutEd;
  var bwVer;
  var bw;

  cutEd = nvUA.length;

  if (nvUA.indexOf("MSIE") != -1) {
    bw = { name: "Internet Explorer", version: "10" };
  }
  else if (nvUA.indexOf("Trident") != -1) {
    bw = { name: "Internet Explorer", version: "11" };
  }
  else if (nvUA.indexOf("Edge") != -1 || nvUA.indexOf("Edg") != -1) {
    if (nvUA.indexOf("Edge") != -1) {
      cutSt = nvUA.indexOf("Edge");
      bwVer = nvUA.substring(cutSt + 5, cutEd);
    }
    else {
      cutSt = nvUA.indexOf("Edg");
      bwVer = nvUA.substring(cutSt + 4, cutEd);
    }
    bw = { name: "Edge", version: bwVer };
  }
  else if (nvUA.indexOf("Firefox") != -1) {
    cutSt = nvUA.indexOf("Firefox");
    bwVer = nvUA.substring(cutSt + 8, cutEd);
    bw = { name: "FireFox", version: bwVer };
  }
  else if (nvUA.indexOf("OPR") != -1) {
    cutSt = nvUA.indexOf("OPR");
    bwVer = nvUA.substring(cutSt + 4, cutEd);
    bw = { name: "Opera", version: bwVer };
  }
  else if (nvUA.indexOf("Safari") != -1) {
    if (nvUA.indexOf("Chrome") != -1) {
      cutSt = nvUA.indexOf("Chrome");
      cutEd = nvUA.indexOf(" ", cutSt);
      bwVer = nvUA.substring(cutSt + 7, cutEd);
      bw = { name: "Chrome", version: bwVer };
    }
    else {
      cutSt = nvUA.indexOf("Version");
      cutEd = nvUA.indexOf(" ", cutSt);
      bwVer = nvUA.substring(cutSt + 8, cutEd);
      bw = { name: "Safari", version: bwVer };
    }
  }
  else {
    bw = { name: "Unknown", version: "0" };
  }

  return bw;
}

function generateRandomString(length, string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
  return Array.from(crypto.getRandomValues(new Uint8Array(length))).map((n) => string[n % string.length]).join('')
}

function generateLaunchSignature() {
  const BITS = 0b00000000100000000001000000010000000010000001000000001000000000000010000010000001000000000100000000000001000000000000100000000000n;
  const MASK_ALL = (1n << 128n) - 1n;
  let randomInt = 0n;
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  for (let i = 0; i < 16; i++) {
    randomInt = (randomInt << 8n) | BigInt(bytes[i]);
  }
  const resultInt = randomInt & (~BITS & MASK_ALL);
  const hex = resultInt.toString(16).padStart(32, '0');
  return hex.substring(0, 8) + '-' + hex.substring(8, 12) + '-' + hex.substring(12, 16) + '-' + hex.substring(16, 20) + '-' + hex.substring(20, 32);
}

const createUUID = () => {
  let d = new BigUint64Array(2);
  crypto.getRandomValues(d);
  let h = (d[0].toString(16).padStart(16, '0') + d[1].toString(16).padStart(16, '0')).slice(0, 32);
  h = h.substring(0, 12) + '4' + h.substring(13);
  const v = ((parseInt(h[16], 16) & 0x3) | 0x8).toString(16);
  h = h.substring(0, 16) + v + h.substring(17);
  return h.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
};

function getSuperPropertiesJson() {
  const os = CheckOs();
  const browser = CheckBrowser();

  return {
    "os": os.name,
    "browser": browser.name,
    "device": "",
    "system_locale": navigator.language,
    "has_client_mods": false,
    "browser_user_agent": navigator.userAgent,
    "browser_version": browser.version,
    "os_version": os.version,
    "referrer": "",
    "referring_domain": "",
    "referrer_current": "",
    "referring_domain_current": "",
    "release_channel": "stable",
    "client_build_number": 472914,
    "client_event_source": null,
    "client_launch_id": typeof crypto.randomUUID === "function" ? crypto.randomUUID() : createUUID(),
    "launch_signature": generateLaunchSignature(),
    "client_heartbeat_session_id": typeof crypto.randomUUID === "function" ? crypto.randomUUID() : createUUID(),
    "client_app_state": "focused",
  };
}

function getSuperProperties() {
  return btoa(JSON.stringify(getSuperPropertiesJson()));
}

function getSessionId(discord_token) {
  return new Promise((resolve, reject) => {
    let complete = false;
    const ws = new WebSocket("wss://gateway.discord.gg/?encoding=json&v=9");

    ws.onopen = () => {
      ws.send(JSON.stringify({
        op: 2,
        d: {
          token: discord_token,
          capabilities: 1734653,
          properties: getSuperPropertiesJson(),
          presence: {
            status: "unknown",
            since: 0,
            activities: [],
            afk: false
          }
        }
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.op === 0 || data.t === "READY") {
        complete = true;
        ws.close();
        resolve(data.d.session_id);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error: ", error);
      reject(error);
    };

    ws.onclose = () => {
      if (!complete) {
        reject();
      }
    };
  });
}

// ★いくらさんのWorker URLに変更
const PROXY_URL = "https://orange-term-46ed.snwioug.workers.dev/?url=";

async function getFingerprintAndSetCookie() {
  const target = encodeURIComponent("https://discord.com/api/v9/experiments");
  const response = await fetch(PROXY_URL + target, {
    headers: {
      "x-context-properties": btoa(JSON.stringify({ location: "/channels/@me" })),
      "x-debug-options": "bugReporterEnabled",
      "x-discord-locale": new Intl.Locale(navigator.language).baseName,
      "x-discord-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      "x-super-properties": getSuperProperties(),
    },
    credentials: "include"
  });

  if (response.ok) {
    return (await response.json()).fingerprint;
  }

  return null;
}

function getMaskedToken(discord_token) {
  return `${discord_token.split(".")[0]}.***`;
}

async function invite(discord_token, invite_code) {
  log("x-context-propertiesの値を計算しています...");

  const target = encodeURIComponent(`https://discord.com/api/v9/invites/${invite_code}?with_counts=true&with_expiration=true&with_permissions=true`);
  let response = await fetch(PROXY_URL + target, {
    "headers": {
      "x-debug-options": "bugReporterEnabled",
      "x-discord-locale": new Intl.Locale(navigator.language).baseName,
      "x-discord-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      "x-super-properties": getSuperProperties()
    }
  });

  let x_context_properties;
  if (response.ok) {
    const json = await response.json();
    x_context_properties = btoa(JSON.stringify({
      "location": "Accept Invite Page",
      "location_guild_id": json.guild.id,
      "location_channel_id": json.channel.id,
      "location_channel_type": 0
    }));

    document.getElementById("server_name").innerText = json.guild.name;
    document.getElementById("server_id").innerText = json.guild.id;
    document.getElementById("server_info").style.display = "block";

    log("✅ x-context-propertiesの値を取得しました！");
  }
  else {
    x_context_properties = btoa(JSON.stringify({ "location": "Accept Invite Page" }));
    log(`❌ x-context-propertiesの取得に失敗しました。招待リンクが無効である可能性があります。`);
  }

  log("x-fingerprintの値とCookieを取得しています...");
  let x_fingerprint = await getFingerprintAndSetCookie();

  await invite_data(discord_token, invite_code, x_context_properties, x_fingerprint);

  return {
    x_context_properties: x_context_properties,
    x_fingerprint: x_fingerprint
  };
}

async function invite_data(discord_token, invite_code, x_context_properties, x_fingerprint) {
  const token_mask = getMaskedToken(discord_token);
  log(`${token_mask} session_idの値を取得しています...`);

  let session_id;
  try {
    session_id = await getSessionId(discord_token);
    log(`✅ ${token_mask} session_idを取得しました！`);
  }
  catch (e) {
    session_id = generateRandomString(32, "abcdef0123456789");
    log(`⚠️ ${token_mask} session_idを取得できませんでした。値を生成しました。`);
  }

  return await invite_main(discord_token, invite_code, x_context_properties, x_fingerprint, session_id, null, null, null);
}

async function invite_main(discord_token, invite_code, x_cp, x_fp, sid, h_sid, h_rq, h_key) {
  const token_mask = getMaskedToken(discord_token);

  const headers = {
    "authorization": discord_token,
    "content-type": "application/json",
    "x-super-properties": getSuperProperties(),
  };

  if (x_cp) { headers["x-context-properties"] = x_cp; }
  if (x_fp) { headers["x-fingerprint"] = x_fp; }
  if (h_key) { headers["x-captcha-key"] = h_key; }
  if (h_rq) { headers["x-captcha-rqtoken"] = h_rq; }
  if (h_sid) { headers["x-captcha-session-id"] = h_sid; }

  const target = encodeURIComponent("https://discord.com/api/v9/invites/" + invite_code);
  const response = await fetch(PROXY_URL + target, {
    headers: headers,
    body: JSON.stringify({ session_id: sid }),
    method: "POST",
    credentials: "include",
  });

  if ((!h_sid || !h_rq || !h_key) && response.status === 400) {
    log(`⚠️ ${token_mask} Captchaが必要であることを検知しました。`);
    const json = await response.json();

    captcha_invites.push({
      discord_token: discord_token,
      invite_code: invite_code,
      x_context_properties: x_cp,
      x_fingerprint: x_fp,
      session_id: sid,
      captcha_sitekey: json.captcha_sitekey,
      captcha_session_id: json.captcha_session_id,
      captcha_rqdata: json.captcha_rqdata,
      captcha_rqtoken: json.captcha_rqtoken,
    });
    return;
  }

  if (response.ok) {
    log(`✅ ${token_mask} サーバーへの参加に成功しました！`);
  }
  else {
    log(`❌ ${token_mask} サーバーへの参加に失敗しました (${response.status})`);
  }
}

function elementDisabled(disabled) {
  if (disabled) {
    document.getElementById("execute").setAttribute("disabled", "");
    document.getElementById("strict").setAttribute("disabled", "");
  }
  else {
    document.getElementById("execute").removeAttribute("disabled");
    document.getElementById("strict").removeAttribute("disabled");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  function updateTheme() {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.body.setAttribute("data-bs-theme", theme);
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);
  updateTheme();
  document.body.style.display = "block";

  document.getElementById("auto_scroll").addEventListener("change", async (e) => {
    auto_scroll_mode = e.target.checked;
  });

  document.getElementById("execute").addEventListener("click", async (e) => {
    elementDisabled(true);
    strict_mode = document.getElementById("strict").checked;

    const tokens = document.getElementById("tokens").value.replaceAll("\r", "").split("\n").map(token => token.trim()).filter(token => Boolean(token));
    const invite_code = document.getElementById("invite").value.trim().replace(/^(https?:\/\/)?((canary\.|ptb\.)?discord(app)?\.com\.?\/invite\/|discord.gg\/?.*(?=\/))\//, "");

    if (!invite_code) {
      log("❌ 招待リンクが指定されていません。");
      elementDisabled(false);
      return;
    }

    if (tokens.length) {
      log((first ? "" : "\n") + "サーバー参加のセットアップを開始します。");

      let first_token = tokens.shift();
      let data = await invite(first_token, invite_code);

      for (const token of tokens) {
        await invite_data(token, invite_code, data.x_context_properties, data.x_fingerprint);
      }

      log(`要求されたCaptcha数は${captcha_invites.length}個です。`);
      startCaptcha();
    }
    else {
      log("❌ トークンが指定されていません。");
      elementDisabled(false);
    }
  });
});
