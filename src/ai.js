import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are Chef Zubair. You are an expert in Pakistani and International cuisine.
STRICT RULES:
1. If the user wants Urdu, respond ONLY in Urdu script.
2. If the user wants English, respond ONLY in English.
3. ABSOLUTELY NO Hindi (Devanagari) or Arabic script.
4. If an Urdu word is too difficult, use the English word in brackets or instead of the difficult Urdu word.
5. Format the response in clean Markdown.
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