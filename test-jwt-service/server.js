// server.js
const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const JWT = require("jsonwebtoken");
const fs = require("fs");

const secret = fs.readFileSync("./certs/dev-private.pem");

app.use(express.json());
app.use(express.static("public"));

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", async (req, res, next) => {
  // Assuming user is permitted to login / get a token
  // This is for TEST SERVICE ONLY

  const token = JWT.sign(
    {
      CN: req.body.userId,
      iss: "http://localhost:5001/.well-known/openid-configuration",
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

// app.get("/.well-known/jwks.json", (req, res) => {
//   res.status(200);
// });

app.get("/.well-known/openid-configuration", (req, res) => {
  const metadata = {
    issuer: "http://localhost:5001/.well-known/openid-configuration",
    jwks_uri: "http://localhost:5001/.well-known/jwks.json",
    authorization_endpoint: "http://localhost:5001/login",
    token_endpoint: "http://localhost:5001/token",
  };

  res.status(200).json(metadata);
});

app.post("/api/token", validateJWT, (req, res, next) => {
  res.status(200).json({ valid: true });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function validateJWT(req, res, next) {
  console.log(req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as a Bearer token
  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided!");
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET_KEY);
    req.user = verified;
    next(); // Proceed to the next middleware/function
  } catch (error) {
    return res.status(400).send({ valid: false });
  }
}
