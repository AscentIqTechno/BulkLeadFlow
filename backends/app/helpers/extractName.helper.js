const OpenAI = require("openai");

// Optional: DeepSeek client
const deepseekKey = process.env.DEEPSEEK_KEY;
let deepseekClient = null;
if (deepseekKey) {
  deepseekClient = new OpenAI({
    apiKey: deepseekKey,
    baseURL: "https://api.deepseek.com",
  });
}

// OpenAI client (fallback)
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_KEY });

/** Clean & Format Name */
function cleanName(name) {
  if (!name) return "";
  name = name.replace(/[0-9._-]/g, " ").trim();
  name = name.split(" ")[0]; // first name only
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/** DeepSeek Name Extraction */
async function deepseekExtract(email) {
  if (!deepseekClient) return null; // no key → skip

  const prompt = `Extract ONLY a first name from this email: "${email}".
- No middle name
- No numbers
- Capitalize the first letter
- If unclear, guess the most likely first name
Return ONLY the name.`;

  try {
    const resp = await deepseekClient.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
    });

    return cleanName(resp.choices[0].message.content.trim());
  } catch (err) {
    console.error("DeepSeek extraction failed:", err.message);
    return null;
  }
}

/** OpenAI Name Extraction */
async function openaiExtract(email) {
  const prompt = `Extract a human first name from this email: "${email}". 
Rules:
- First name only
- Capitalize properly
- Guess if unclear`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10,
    });

    return cleanName(response.choices[0].message.content.trim());
  } catch (err) {
    console.error("OpenAI extraction failed:", err.message);
    return null;
  }
}

/** MAIN FUNCTION — USE THIS IN YOUR CONTROLLER */
async function extractNameFromEmail(email) {
  let name = null;

  // 1️⃣ Try DeepSeek first (free)
  if (deepseekClient) {
    name = await deepseekExtract(email);
    if (name) return name;
  }

  // 2️⃣ Fallback: OpenAI
  if (process.env.OPENAI_KEY) {
    name = await openaiExtract(email);
    if (name) return name;
  }

  // 3️⃣ Final Fallback: local extraction
  console.log("⚠️ Falling back to basic extraction");
  return cleanName(email.split("@")[0]);
}

module.exports = extractNameFromEmail;
