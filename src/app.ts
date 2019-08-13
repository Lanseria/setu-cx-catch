import * as got from "got";
import * as stream from "stream";
import { promisify } from "util";
import * as fs from "fs";
import { OutgoingHttpHeaders } from "http";
import { genAuthsign } from "./script";
const pipeline = promisify(stream.pipeline);
const writerStream = fs.createWriteStream(`imgs/${new Date().getTime()}.json`);
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

let wstream: fs.WriteStream = null;

const gotDownload = async (url: string, idx: number, dirTitle: string) => {
  try {
    await pipeline(
      got.stream(url),
      (wstream = fs.createWriteStream(`imgs/${dirTitle}/${idx}.webp`))
    );
  } catch (error) {
    console.log(error);
  }
};

const gotPageImgs = async (_id: string) => {
  interface ResponseData {
    tags: string[];
    files: string[];
    _id: string;
    root_url: string;
    source_url: string;
    author: string;
    thumb: string;
    title: string;
    ts: number;
  }

  interface ResponseBody {
    data: ResponseData;
  }
  try {
    headers["Authsign"] = genAuthsign(`/album/${_id}`);
    const response = await got(`https://api.setu.cx/album/${_id}`, {
      headers: headers,
      json: true
    });
    const responseData: ResponseBody = response.body;
    fs.mkdirSync(`imgs/${responseData.data.title}/`);
    const { files } = responseData.data;
    for (const [i, file] of files.entries()) {
      gotDownload(file, i, responseData.data.title);
    }
    wstream.end();
    // responseData.data.files.forEach(async (m, i) => {
    //   gotDownload(m, i, responseData.data.title);
    // });
  } catch (error) {
    console.log(error.response.body);
  }
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

    // headers["Authsign"] = genAuthsign(`/album`);
    // const response = await got("https://api.setu.cx/album?page=1", {
    //   headers: headers,
    //   json: true
    // });
    // const responseData: ResponseBody = response.body;
    // writerStream.write(JSON.stringify(responseData), "UTF8");
    // writerStream.end();

    const path = "imgs/";
    const pa = fs.readdirSync(path);
    const existDirs: string[] = [];
    pa.forEach(function(ele) {
      var info = fs.statSync(path + "/" + ele);
      if (info.isDirectory()) {
        console.log(`dir: ${ele} is Exist!`);
        existDirs.push(ele);
      }
    });

    const data = fs.readFileSync("imgs/1565703207988.json", "utf8");
    const responseData: ResponseBody = JSON.parse(data);
    responseData.data.forEach(async m => {
      if (!existDirs.includes(m.title)) {
        await gotPageImgs(m._id);
      }
    });
  } catch (error) {
    console.log(error.response.body);
    //=> 'Internal server error ...'
  }
})();
