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
            recipeEndRef.current?.scrollIntoView({ 
                behavior: "smooth", 
                block: "end" 
            });
        }
    }, [recipe, loading, ingredients]);

    async function getRecipe(mode = "ingredients") {
        setRecipe(""); 
        setLoading(true);

        const languageInstruction = `IMPORTANT: Provide the entire response in ${language}. If I wrote in Roman Urdu, respond in ${language === "Urdu" ? "Urdu script" : "English"}. Avoid Hindi/Arabic.`;
        
        const finalPrompt = mode === "dish" 
            ? `I want a full recipe for the dish: "${dishName}". ${languageInstruction}`
            : `I have these ingredients: ${ingredients.join(", ")}. Suggest a recipe. ${languageInstruction}`;

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

    function handleDishSubmit(e) {
        e.preventDefault();
        if (dishName) getRecipe("dish");
    }

    function clearApp() {
        setIngredients([]);
        setRecipe("");
        setDishName("");
    }

    return (
        <main style={{ paddingBottom: "100px" }}>
            <div className="language-selector">
                <p>Select Recipe Language:</p>
                <button 
                    className={language === "English" ? "active-lang" : ""} 
                    onClick={() => setLanguage("English")}
                >English</button>
                <button 
                    className={language === "Urdu" ? "active-lang" : ""} 
                    onClick={() => setLanguage("Urdu")}
                >Urdu (اردو)</button>
            </div>

            <div className="helper-box">
                <p>💡 <strong>Tip:</strong> If you want a specific dish (e.g., Biryani), use the <strong>Dish Bar</strong>. <br />
                If you have random ingredients, add <strong>at least 4</strong> to the list to get a recipe.</p>
            </div>

            <div className="forms-container">
                <form ref={formRef} action={addIngredient} className="add-ingredient-form">
                    <input 
                        type="text" 
                        placeholder="Add ingredient (e.g. mutton)" 
                        name="ingredient"
                        required
                    />
                    <button type="submit">Add Ingredient</button>
                </form>

                <div className="or-divider">OR</div>

                <form onSubmit={handleDishSubmit} className="add-ingredient-form">
                    <input 
                        type="text" 
                        placeholder="Enter specific dish name..." 
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
                    <button className="clear-btn" onClick={clearApp}>
                        ↺ Reset Kitchen
                    </button>
                </div>
            )}

            {loading && <p className="pulse">Chef Zubair is thinking in {language}... 🍳</p>}

            {recipe && <ZubairRecipe markdown={recipe} />}
            
            <div ref={recipeEndRef} style={{ height: "20px" }} />
        </main>
    );
}