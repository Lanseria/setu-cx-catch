import * as cryptoJs from "crypto-js";
import * as moment from "moment";

export const genAuthsign = (url: string) => {
  const domain = "setu.cx";
  const t = moment()
    .utc()
    .toString();
  const n = encodeURI(url);
  // Ve.a.SHA256("".concat(t).concat(path).concat(document.domain));
  const a = cryptoJs
    .SHA256(
      ""
        .concat(t)
        .concat(n)
        .concat(domain)
    )
    .toString();
  // "".concat(r, ".").concat(Ve.a.AES.encrypt(t, document.domain).toString())
  const data3 = ""
    .concat(a, ".")
    .concat(cryptoJs.AES.encrypt(t, domain).toString());
  return data3;
};
