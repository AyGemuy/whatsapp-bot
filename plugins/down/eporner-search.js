import epornersearch from "../../api/down/eporner-search.js";

export const cmd = {
  name: ["epornersearch"],
  command: ["epornersearch"],
  category: ["down"],
  async start({ m, text }) {
    if (!text) return m.reply("Silakan masukkan teks untuk diproses.");

    try {
      const output = await epornersearch(text);
      return m.reply(output);
    } catch (error) {
      console.error("Error pada AI epornersearch:", error);
      return m.reply(
        "Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.",
      );
    }
  },
};