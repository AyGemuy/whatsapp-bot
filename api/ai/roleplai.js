import fetch from "node-fetch";
import * as cheerio from "cheerio";
async function getRoleplaiAnswer(query, bid = 208) {
  try {
    const params = new URLSearchParams({
      u: "TflXtuyrQ75379eeb40a883e5e4dbf25e7855343e3LWqjdlU1",
      q: query,
    });
    const response = await fetch(
      `https://roleplai.app/web/chat.php?bid=${bid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
          Referer: `https://roleplai.app/web/?b=${bid}&linkto=hotbots`,
        },
        body: params.toString(),
      },
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    return $(".bubble")
      .map((_, el) => $(el).text())
      .get()[0];
  } catch (error) {
    console.error("Get answer error:", error);
    return null;
  }
}
export default getRoleplaiAnswer;
