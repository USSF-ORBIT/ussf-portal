// server.js
const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const JWT = require("jsonwebtoken");

const secret = process.env.JWT_DEV_CERT
const issuer = process.env.ISSUER || "http://localhost:5001/.well-known/issuer.json";

app.use(express.json());
app.use(express.static("public"));

app.get("/login", async (req, res) => {
  // Assuming user is permitted to login / get a token
  // This is for TEST SERVICE ONLY
  const token = JWT.sign(
    {
      CN: req.query.userId,
      iss: issuer,
      aud: "guardian-one",
    },
    secret,
    {
      expiresIn: "1h",
      algorithm: "RS256",
      header: {
        kid: "319e15fcbd7b0d6ed5505db",
      },
    }
  );
  res.send({ token });
});


app.get("/.well-known/openid-configuration", (req, res) => {
  const metadata = {
    issuer: issuer,
    jwks_uri: "http://localhost:5001/.well-known/jwks.json",
    authorization_endpoint: "http://localhost:5001/login",
    token_endpoint: "http://localhost:5001/token",
  };

  res.status(200).json(metadata);
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

