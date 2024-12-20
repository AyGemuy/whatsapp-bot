import { jidDecode, downloadContentFromMessage } from "@whiskeysockets/baileys";
import PhoneNumber from "awesome-phonenumber";
import fs from "fs";
import axios from "axios";
import crypto from "crypto";

import store from "./store.js";
import { timeZone } from "../../setting.js";

export function formatDateInTimeZone(date, timeZone) {
  const options = {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function getName(jid) {
  if (jid === "0@s.whatsapp.net") {
    return "WhatsApp";
  }

  for (const chatKey in store.messages) {
    if (store.messages.hasOwnProperty(chatKey)) {
      const usersArray = store.messages[chatKey].array;
      const userMsgs = usersArray.filter(
        (m) => m.sender === jid && m?.pushName,
      );
      if (userMsgs.length !== 0) {
        return userMsgs[userMsgs.length - 1].pushName;
      }
    }
  }

  return PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
    "international",
  );
}

export function decodeJid(jid) {
  if (/:\d+@/gi.test(jid)) {
    const decode = jidDecode(jid) || {};
    return (
      decode.user && decode.server ? `${decode.user}@${decode.server}` : jid
    ).trim();
  }
  return jid.trim();
}

export async function downloadMediaMessage(media) {
  const type = Object.keys(media)[0];
  const msg = media[type];

  if (!msg || !(msg.url || msg.directPath)) {
    return null;
  }

  const stream = await downloadContentFromMessage(
    msg,
    type.replace(/Message/i, ""),
  );
  const buffers = [];

  for await (const chunk of stream) {
    buffers.push(chunk);
  }

  const resultBuffer = Buffer.concat(buffers);
  stream.destroy();

  return resultBuffer;
}

export async function getFile(PATH) {
  let res = null,
    filename;
  let buffer = Buffer.isBuffer(PATH)
    ? PATH
    : /^data:.*?\/.*?base64,/i.test(PATH)
      ? Buffer.from(PATH.split(",")[1], "base64")
      : /^https?:\/\//.test(PATH)
        ? Buffer.from((res = await fetchBuffer(PATH)), "binary")
        : fs.existsSync(PATH)
          ? ((filename = PATH), fs.readFileSync(PATH))
          : typeof PATH === "string"
            ? PATH
            : Buffer.alloc(0);

  if (!Buffer.isBuffer(buffer)) throw new TypeError("Result is not a buffer.");

  const type = determineFileType(buffer);

  return {
    res,
    ...type,
    buffer,
  };
}
