import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are Chef Zubair. You are an expert at understanding ingredients and dish names in English, Urdu, and Roman Urdu.
STRICT RULES:
1. Respond ONLY in the language requested by the user (English or Urdu).
2. If the user chooses Urdu, you can use English words for difficult cooking terms, but the overall response must be Urdu.
3. ABSOLUTELY NO Hindi script or Arabic script (other than standard Urdu).
4. Format your response in markdown.
`;

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_GROK_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    dangerouslyAllowBrowser: true,
});

export async function getRecipeFromGrok(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt },
            ],
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("Grok Error:", err);
        return "Bhai, the kitchen is closed! Check your connection.";
    }
}