import morphic from "../../api/ai/morphic.js";

export const cmd = {
  name: ["morphic"],
  command: ["morphic"],
  category: ["ai"],
  async start({ m, text }) {
    if (!text) return m.reply("Silakan masukkan teks untuk diproses.");

    try {
      const output = await morphic(text);
      return m.reply(output);
    } catch (error) {
      console.error("Error pada AI morphic:", error);
      return m.reply(
        "Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.",
      );
    }
  },
};
