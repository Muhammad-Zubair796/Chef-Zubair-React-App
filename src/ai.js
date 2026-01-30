//ai.js
import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. Format your response in markdown.
`;

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_GROK_API_KEY, // For Vite
    
    baseURL: "https://api.groq.com/openai/v1",
    dangerouslyAllowBrowser: true,
});

export async function getRecipeFromGrok(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");

    try {
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe!` },
            ],
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("Grok Error:", err);
        return "Bhai, the kitchen is closed! Check your connection.";
    }
}