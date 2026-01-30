import React, { useEffect, useRef } from 'react';
import IngredientsList from './IngredientsList.jsx';
import ZubairRecipe from './ZubairRecipe.jsx';
import { getRecipeFromGrok } from "../ai";

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState(""); 
    const [loading, setLoading] = React.useState(false);
    const formRef = React.useRef(null);
    const recipeEndRef = useRef(null);

    // FIX: This effect will now trigger every single time 'recipe' is updated
    // during the AI typing process, forcing the page to keep up.
    useEffect(() => {
        if (recipe || loading) {
            recipeEndRef.current?.scrollIntoView({ 
                behavior: "smooth", 
                block: "end" // Changed from "start" to "end" to follow the bottom
            });
        }
    }, [recipe, loading, ingredients]); // Added ingredients as a dependency too

    async function getRecipe() {
        setRecipe(""); 
        setLoading(true);
        try {
            const recipeMarkdown = await getRecipeFromGrok(ingredients);
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

    function clearApp() {
        setIngredients([]);
        setRecipe("");
    }

    return (
        <main style={{ paddingBottom: "100px" }}> {/* Added extra space at bottom */}
            <form ref={formRef} action={addIngredient} className="add-ingredient-form">
                <input 
                    type="text" 
                    placeholder="e.g. mutton" 
                    name="ingredient"
                    required
                />
                <button type="submit">Add Ingredient</button>
            </form>

            {ingredients.length > 0 && (
                <div className="fade-in">
                    <IngredientsList ingredients={ingredients} getRecipe={getRecipe} />
                    <button className="clear-btn" onClick={clearApp}>
                        ↺ Reset Kitchen
                    </button>
                </div>
            )}

            {loading && <p className="pulse">Chef Zubair is thinking... 🍳</p>}

            {recipe && <ZubairRecipe markdown={recipe} />}
            
            {/* The Invisible Anchor */}
            <div ref={recipeEndRef} style={{ height: "20px" }} />
        </main>
    );
}