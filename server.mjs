import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/summary", async (req, res) => {
    const { name, skills, experience } = req.body;

    try {
        const prompt = `
Create a short, professional resume summary for ${name || "a candidate"} 
with skills in ${skills} and experience in ${experience}.
Keep it 3–4 sentences and formal.
`;

        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        res.json({ summary: response.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
