import * as cryptoJs from "crypto-js";
import * as moment from "moment";

export const genAuthsign = (url: string) => {
  const domain = "setu.cx";
  const n = moment()
    .unix()
    .toString();
  const t = encodeURI(url);
  const a = cryptoJs
    .SHA256(
      ""
        .concat(n.toString())
        .concat(t)
        .concat(domain)
    )
    .toString();
  const data3 = ""
    .concat(a, ".")
    .concat(cryptoJs.AES.encrypt(n.toString(), domain).toString());
  return data3;
};
