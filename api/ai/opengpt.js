import fetch from "node-fetch";
async function OpenGpt(prompt, id = "clf3yg8730000ih08ndbdi2v4") {
  try {
    const url = "https://open-gpt.app/api/generate";
    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
      Referer: `https://open-gpt.app/id/app/${id}`,
    };
    const body = JSON.stringify({
      userInput: prompt,
      id: id,
      userKey: "",
    });
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.text();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
export default OpenGpt;
