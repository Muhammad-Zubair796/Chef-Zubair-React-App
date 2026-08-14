import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are Chef Zubair. You are an expert in Pakistani and International cuisine.
STRICT SCRIPT RULES:
1. If the user selects "Urdu": You MUST respond ONLY in Urdu Script (Nastaliq/Arabic characters). Example: "ایک کلو چاول". You are FORBIDDEN from using English/Latin letters for the recipe.
2. If the user selects "Roman Urdu": You MUST respond in Urdu language but using ONLY Latin/English characters. Example: "1 kg chawal".
3. If the user selects "English": Respond only in English.
4. ABSOLUTELY NO Hindi (Devanagari) or Arabic script.
5. Use English for technical cooking terms only if the Urdu word is too complex.
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