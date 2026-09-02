import crypto from "node:crypto";

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(
  "aes-256-cbc",
  key,
  iv
);

let encrypted = cipher.update("hello world", "utf8", "hex");
encrypted += cipher.final("hex");

console.log(encrypted);
