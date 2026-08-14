import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are Chef Zubair. You are an expert in Pakistani and International cuisine.
STRICT LANGUAGE RULES:
1. If mode is "English": Respond only in English.
2. If mode is "Urdu": Respond only in Urdu Script (اردو).
3. If mode is "Roman Urdu": Respond in Urdu language but using the English/Latin alphabet (e.g., "Piyaz ko halka brown karein").
4. ABSOLUTELY NO Hindi (Devanagari) or Arabic script.
5. Use English for technical cooking terms if the Urdu word is too complex.
6. Format in clean Markdown.
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