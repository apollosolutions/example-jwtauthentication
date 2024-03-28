import express from "express";
import { readFile } from "fs/promises";
import * as jose from "jose";
import crypto from "crypto";

/********************************************************************
 * THis file is just a simulation of a Identity Provider.
 * This should not be used as example code to run in production.
 ********************************************************************/

const app = express();

const privateKeyText = await readFile("private_key.pem", {
  encoding: "utf8",
});
const alg = "ES256";
const privateKey = crypto.createPrivateKey(privateKeyText);
const jwks = await readFile("jwks.json", {
  encoding: "utf8",
});

app.get("/login", express.json(), async (req, res) => {
  const jwt = await new jose.SignJWT({
    id: "supercooluser",
    scope: "read:hello",
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(privateKey);

  res.send({ token: jwt });
});

app.get("/.well-known/jwks.json", (req, res) => {
  res.json(JSON.parse(jwks));
});

app.listen(3005, () => {
  console.log("🚀 Server running at http://localhost:3005");
});
