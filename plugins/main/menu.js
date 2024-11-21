import { formatDateInTimeZone } from "../../lib/src/func.js";
import { timeZone } from "../../setting.js";
import db from "../../lib/database.js";
import path from "path";
import fs from "fs";
import { readdirSync } from "fs";

const generateTags = (folderPath) => {
  const tags = {};

  readdirSync(folderPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .forEach((dirent) => {
      const folderName = dirent.name;
      const capitalizedName =
        folderName.charAt(0).toUpperCase() + folderName.slice(1);
      tags[folderName] = { name: capitalizedName };
    });

  return tags;
};

// Contoh penggunaan
const folderPath = "./plugins";
const tags = generateTags(folderPath);

export const cmd = {
  name: ["menu"],
  command: ["menu", "help"],
  category: ["main"],
  detail: { desc: "Menampilkan daftar semua perintah yang tersedia." },
  async start({ m, conn, prefix, plugins }) {
    const { version } = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    const currentDate = new Date();
    const ucapannye = ucapan();
    let teks =
      `${ucapannye}\n` +
      `Sistem otomatis *Whatsapp Bot* yang dibuat dengan *_baileys_* yang siap membantu anda.\n\n` +
      `◦  *Waktu* · ${formatDateInTimeZone(currentDate, timeZone)}\n`;

    for (const tag in tags) {
      teks += `\n*${tags[tag].name.toUpperCase()}*\n`;
      const filteredCommands = plugins.commands.filter((cmd) => {
        const commandDetails = Object.values(cmd)[0];
        return commandDetails.category && commandDetails.category.includes(tag);
      });

      console.log(
        `Perintah untuk kategori ${tags[tag].name}:`,
        filteredCommands,
      );

      filteredCommands.forEach((cmd, index) => {
        const commandDetails = Object.values(cmd)[0];
        commandDetails.command.forEach((cmdName) => {
          teks += `${index + 1}. ${prefix + cmdName}${commandDetails.detail?.use ? ` < *${commandDetails.detail.use}* >` : ""}${commandDetails.setting?.isNsfw ? `  (*+18*)` : ""}\n`;
        });
      });
    }
    teks += `\n> Bot Ini menggunakan script: https://github.com/AyGemuy/whatsapp-bot\n\n>\t\t\tWhatsApp Bot@${version}\n\n`;

    if (teks.trim() === "") {
      teks = "Tidak ada perintah yang ditemukan untuk kategori ini.";
    }

    await m.reply(teks);
  },
};

function ucapan() {
  const time = new Date();
  const greetings = {
    midnight: "Selamat tengah malam 🌌",
    morning: "Selamat pagi 🌄",
    noon: "Selamat siang 🌤",
    afternoon: "Selamat sore 🌇",
    night: "Selamat malam 🎑",
  };

  const hour = parseInt(
    formatDateInTimeZone(time, timeZone).split(",")[1].split(":")[0],
  );

  if (hour == 0) return greetings.midnight;
  if (hour >= 6 && hour < 12) return greetings.morning;
  if (hour == 12) return greetings.noon;
  if (hour >= 13 && hour < 19) return greetings.afternoon;
  return greetings.night;
}