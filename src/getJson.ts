import * as got from "got";
import * as fs from "fs";
import { OutgoingHttpHeaders } from "http";
import { genAuthsign } from "./script";
const fileName = new Date().getTime();
const writerStream = fs.createWriteStream(`imgs/${fileName}.json`);
const headers: OutgoingHttpHeaders = {
  DNT: "1",
  "Sec-Fetch-Site": "same-site",
  Accept: "application/json, text/plain, */*",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
  "Sec-Fetch-Mode": "cors",
  Origin: "https://setu.cx",
  Authsign: ""
};

(async () => {
  try {
    interface ResponseData {
      pic_nums: number;
      tags: string[];
      type: string;
      _id: string;
      author: string;
      thumb: string;
      title: string;
      ts: number;
    }

    interface ResponseBody {
      data: ResponseData[];
    }

    headers["Authsign"] = genAuthsign(`/album`);
    const response = await got("https://api.setu.cx/album?page=3", {
      headers: headers,
      json: true
    });
    const responseData: ResponseBody = response.body;
    writerStream.write(JSON.stringify(responseData), "UTF8");
    writerStream.end();
    console.log(fileName);
  } catch (error) {
    console.log(error.response.body);
    //=> 'Internal server error ...'
  }
})();
