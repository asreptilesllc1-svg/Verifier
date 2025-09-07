const crypto = require("crypto");
const fs = require("fs");
const QRCode = require("qrcode");

const privateKey = fs.readFileSync("private.pem");   // must exist already
const productId = process.argv[2] || "DEMO-PRODUCT-001"; 

// sign productId
const sign = crypto.createSign("SHA256");
sign.update(productId);
sign.end();
const signature = sign.sign(privateKey);

// payload -> base64url
const payload = { id: productId, sig: signature.toString("base64url") };
const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");

// your live verifier URL
const link = `https://asreptilesllc1-svg.github.io/Verifier/verify.html?p=${encoded}`;
console.log("Verifier Link:", link);

// also make a QR image
QRCode.toFile(`qr_${productId}.png`, link, (err) => {
  if (err) throw err;
  console.log(`QR saved: qr_${productId}.png`);
});
