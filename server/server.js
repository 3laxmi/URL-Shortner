


const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { nanoid } = require("nanoid");

const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = "./urls.json";

// Read URLs
const readUrls = () => {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

// Write URLs
const writeUrls = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// POST API
app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      message: "URL is required",
    });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({
      message: "Invalid URL",
    });
  }

  const shortCode = nanoid(6);

  const urls = readUrls();

  urls[shortCode] = url;

  writeUrls(urls);

  res.json({
    shortUrl: `http://localhost:5000/${shortCode}`,
  });
});

const PORT = 5000;


app.get("/:code", (req, res) => {
  const { code } = req.params;

  const urls = readUrls();

  const originalUrl = urls[code];

  if (!originalUrl) {
    return res.status(404).json({
      message: "Short URL not found",
    });
  }

  res.redirect(originalUrl);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

