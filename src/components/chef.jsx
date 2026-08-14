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

        const langContext = `The user wants the recipe in ${language}. If the input was in Roman Urdu, translate it and respond strictly in ${language === "Urdu" ? "Urdu Script" : "English"}.`;
        
        const prompt = mode === "dish" 
            ? `Provide a full recipe for the dish: "${dishName}". ${langContext}`
            : `I have these ingredients: ${ingredients.join(", ")}. Suggest a recipe. ${langContext}`;

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

    function handleDishSubmit(e) {
        e.preventDefault();
        if (dishName) getRecipe("dish");
    }

    return (
        <main style={{ paddingBottom: "100px" }}>
            {/* Pro Language Toggle */}
            <div className="pro-toggle-container">
                <div className="toggle-group">
                    <button 
                        className={language === "English" ? "toggle-btn active" : "toggle-btn"} 
                        onClick={() => setLanguage("English")}
                    >English</button>
                    <button 
                        className={language === "Urdu" ? "toggle-btn active" : "toggle-btn"} 
                        onClick={() => setLanguage("Urdu")}
                    >اردو (Urdu)</button>
                </div>
            </div>

            {/* Helper Line */}
            <div className="helper-info">
                <p>📝 <strong>How to use:</strong> Enter a specific dish name below for a full recipe, OR add <strong>at least 4 ingredients</strong> to get a custom suggestion.</p>
            </div>

            <div className="forms-wrapper">
                <form ref={formRef} action={addIngredient} className="add-ingredient-form">
                    <input type="text" placeholder="Add ingredient (e.g. mutton)" name="ingredient" required />
                    <button type="submit">Add Ingredient</button>
                </form>

                <div className="divider"><span>OR</span></div>

                <form onSubmit={handleDishSubmit} className="add-ingredient-form dish-bar">
                    <input 
                        type="text" 
                        placeholder="Type dish name (e.g. Chicken Karahi / بریانی)" 
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        required
                    />
                    <button type="submit" className="dish-btn">Get Full Dish Recipe</button>
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

            {loading && <p className="pulse">Chef Zubair is preparing your recipe in {language}... 🍳</p>}

            {recipe && <ZubairRecipe markdown={recipe} />}
            
            <div ref={recipeEndRef} style={{ height: "20px" }} />
        </main>
    );
}