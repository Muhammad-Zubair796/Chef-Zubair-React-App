import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are Chef Zubair. You suggest recipes based on ingredients or dish names. 
STRICT LANGUAGE RULES:
1. Use only Urdu or English.
2. ABSOLUTELY NO Hindi or Arabic.
3. If a specific cooking term or ingredient name is difficult or uncommon in Urdu, use the English word instead.
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