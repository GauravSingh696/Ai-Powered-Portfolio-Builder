const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const upload = multer({ storage: multer.memoryStorage() });

// Upload & extract resume text
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const text = await pdfParse(req.file.buffer);
    res.json({ text: text.text });
  } catch (error) {
    res.status(500).json({ error: "Failed to extract text from PDF." });
  }
});

// AI-powered Resume Extraction using DeepSeek API
app.post("/extract", async (req, res) => {
  const { resume_text } = req.body;
  if (!resume_text) {
    return res.status(400).json({ error: "No resume text provided." });
  }

  try {
    // ✅ Use your actual DeepSeek API Key
    const DEEPSEEK_API_KEY = "sk-85241685c67c41359ab282b27b994c11";
    const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"; // Correct API URL

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat", // Use correct model name
        messages: [
          {
            role: "system",
            content: "Extract structured resume details (name, email, phone, experience, skills, projects) in JSON format.",
          },
          {
            role: "user",
            content: resume_text,
          },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0].message) {
      const parsedText = response.data.choices[0].message.content.trim();
      res.json({ parsedText });
    } else {
      throw new Error("Unexpected response format from DeepSeek API");
    }
  } catch (error) {
    console.error("❌ Error processing resume with DeepSeek:", error.message);
    res.status(500).json({ error: "Failed to process resume using DeepSeek API." });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
