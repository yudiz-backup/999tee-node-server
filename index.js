const express = require("express");
// const nodeFetch = require('node-fetch');
const puppeteer = require("puppeteer");

const app = express();


app.all("/*", async function (req, res, ...rest) {
  try {
    // const c = req.headers['user-agent']
    // if (c === 'googlebot') {
    console.log("kacharo", req?.url, req?.headers?.["user-agent"]);
    const d = await getHtml(req?.url);
    res.send(d);
  } catch (error) {
    console.log(error);
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

async function getHtml(url) {
  return new Promise(async function (resolve, reject) {
    try {
      const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 1920, height: 1024 }
        // args: [
        //   "--no-sandbox",
        //   "--disable-setuid-sandbox",
        //   "--disable-extensions",
        // ],
      });
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(true);
      // Set screen size
      // await page.setViewport({ width: 1920, height: 1024 });

      // await page.goto(`https://staging.999tee.com${url}`, {
      //   waitUntil: "domcontentloaded"
      // });
      await page.goto(`https://beta.999tee.com${url}`, {
        waitUntil: "networkidle0",
        timeout: 0
      });

      const data = await page.evaluate(() => {
        return document.querySelector("*").outerHTML;
      });
      await browser.close();

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}
