import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are Chef Zubair, a professional culinary expert. 
The user may provide ingredients or dish names in English, Urdu, or Roman Urdu.
STRICT OUTPUT RULES:
1. If the user selects Urdu, respond in Urdu Script.
2. If the user selects English, respond in English.
3. Use English words for technical cooking terms (e.g., "Whisk", "Sauté", "Marinate") if the Urdu term is too complex.
4. ABSOLUTELY NO Hindi (Devanagari) or Arabic script.
5. Format the recipe with clear headings, prep time, and instructions in Markdown.
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