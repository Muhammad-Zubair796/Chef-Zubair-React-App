import React, { useEffect, useRef } from 'react';
import IngredientsList from './IngredientsList.jsx';
import ZubairRecipe from './ZubairRecipe.jsx';
import { getRecipeFromGrok } from "../ai";

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState(""); 
    const [loading, setLoading] = React.useState(false);
    const [isUrdu, setIsUrdu] = React.useState(false);
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
        const targetLang = isUrdu ? "Urdu" : "English";
        
        const prompt = mode === "dish" 
            ? `Give me a full recipe for "${dishName}" in ${targetLang}. Avoid Hindi/Arabic. Use English for hard words.`
            : `I have: ${ingredients.join(", ")}. Suggest a recipe in ${targetLang}. Avoid Hindi/Arabic. Use English for hard words.`;

        try {
            const recipeMarkdown = await getRecipeFromGrok(prompt);
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
            {/* PRO TOGGLE SWITCH */}
            <div className="language-toggle-container">
                <span>English</span>
                <label className="switch">
                    <input type="checkbox" checked={isUrdu} onChange={() => setIsUrdu(!isUrdu)} />
                    <span className="slider round"></span>
                </label>
                <span>اردو</span>
            </div>

            <div className="helper-text">
                <p>💡 <strong>Tip:</strong> Use the <strong>Dish Bar</strong> for a specific recipe (e.g. Biryani). <br />
                To get a suggestion, add <strong>at least 4 ingredients</strong> you have on hand.</p>
            </div>

            <div className="input-wrapper">
                <form ref={formRef} action={addIngredient} className="add-ingredient-form">
                    <input type="text" placeholder="Add ingredient (e.g. mutton)" name="ingredient" required />
                    <button type="submit">Add Ingredient</button>
                </form>

                <div className="or-divider">OR</div>

                <form onSubmit={(e) => {e.preventDefault(); getRecipe("dish")}} className="add-ingredient-form">
                    <input 
                        type="text" 
                        placeholder="Enter dish name (e.g. Nihari / بریانی)" 
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

            {loading && <p className="pulse">Chef Zubair is thinking in {isUrdu ? "Urdu" : "English"}... 🍳</p>}

            {recipe && <ZubairRecipe markdown={recipe} />}
            
            <div ref={recipeEndRef} style={{ height: "20px" }} />
        </main>
    );
}