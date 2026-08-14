import React, { useEffect, useRef } from 'react';
import IngredientsList from './IngredientsList.jsx';
import ZubairRecipe from './ZubairRecipe.jsx';
import { getRecipeFromGrok } from "../ai";

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState(""); 
    const [loading, setLoading] = React.useState(false);
    const [language, setLanguage] = React.useState("English");
    const [dishName, setDishName] = React.useState("");
    const formRef = React.useRef(null);
    const recipeEndRef = useRef(null);

    useEffect(() => {
        if (recipe || loading) {
            recipeEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [recipe, loading, ingredients]);

    async function getRecipe(mode = "ingredients") {
        setRecipe(""); 
        setLoading(true);
        
        // Nuclear instructions for the AI to stop mixing scripts
        const scriptInstruction = language === "Urdu" 
            ? "STRICT: Use ONLY Urdu Script (Nastaliq). Do not use English/Latin letters." 
            : language === "Roman Urdu" 
            ? "STRICT: Use ONLY Latin/English letters (Roman Urdu). Do not use Urdu Script." 
            : "Use English.";

        const finalPrompt = mode === "dish" 
            ? `Give me a full recipe for "${dishName}". Mode: ${language}. ${scriptInstruction} Avoid Hindi/Arabic.`
            : `I have: ${ingredients.join(", ")}. Suggest a recipe. Mode: ${language}. ${scriptInstruction} Avoid Hindi/Arabic.`;

        try {
            const recipeMarkdown = await getRecipeFromGrok(finalPrompt);
            setRecipe(recipeMarkdown);
        } catch (err) {
            setRecipe("Sorry bhai, something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get('ingredient');
        if (newIngredient) {
            setIngredients(prev => [...prev, newIngredient]);
            formRef.current.reset();
        }
    }

    return (
        <main style={{ paddingBottom: "100px" }}>
            <div className="radio-toggle-container">
                <label className="radio-label">
                    <input type="radio" name="lang" value="English" checked={language === "English"} onChange={() => setLanguage("English")} />
                    <span className="custom-radio"></span> English
                </label>
                <label className="radio-label">
                    <input type="radio" name="lang" value="Urdu" checked={language === "Urdu"} onChange={() => setLanguage("Urdu")} />
                    <span className="custom-radio"></span> Urdu
                </label>
                <label className="radio-label">
                    <input type="radio" name="lang" value="Roman Urdu" checked={language === "Roman Urdu"} onChange={() => setLanguage("Roman Urdu")} />
                    <span className="custom-radio"></span> Roman Urdu
                </label>
            </div>

            <div className="helper-info-box">
                <p>💡 <strong>Chef's Guide:</strong> Use the <strong>Dish Bar</strong> to get a specific recipe instantly. To get a suggestion based on what you have, add <strong>at least 4 ingredients</strong>.</p>
            </div>

            <div className="forms-stack">
                <form ref={formRef} action={addIngredient} className="add-ingredient-form">
                    <input type="text" placeholder="Add ingredient (e.g. mutton)" name="ingredient" required />
                    <button type="submit">Add Ingredient</button>
                </form>

                <form onSubmit={(e) => {e.preventDefault(); getRecipe("dish")}} className="add-ingredient-form dish-bar-form">
                    <input 
                        type="text" 
                        placeholder="Enter dish name (e.g. Biryani / نہاری)" 
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        required
                    />
                    <button type="submit" className="dish-btn">Get Whole Dish Recipe</button>
                </form>
            </div>

            {ingredients.length > 0 && (
                <div className="fade-in">
                    <IngredientsList 
                        ingredients={ingredients} 
                        getRecipe={() => getRecipe("ingredients")} 
                    />
                    <button className="clear-btn" onClick={() => {setIngredients([]); setRecipe(""); setDishName("");}}>
                        ↺ Reset Kitchen
                    </button>
                </div>
            )}

            {loading && <p className="pulse">Chef Zubair is writing in {language}... 🍳</p>}

            {recipe && <ZubairRecipe markdown={recipe} />}
            
            <div ref={recipeEndRef} style={{ height: "20px" }} />
        </main>
    );
}