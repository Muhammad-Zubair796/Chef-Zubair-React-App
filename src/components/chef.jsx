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

        const languagePrompt = `Please provide the recipe in ${language}. Remember: No Hindi, No Arabic. Use Urdu, but use English words for any difficult cooking terms.`;
        
        const finalPrompt = mode === "dish" 
            ? `Give me a full recipe for ${dishName}. ${languagePrompt}`
            : `I have these ingredients: ${ingredients.join(", ")}. Suggest a recipe. ${languagePrompt}`;

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
        if (dishName) {
            getRecipe("dish");
        }
    }

    function clearApp() {
        setIngredients([]);
        setRecipe("");
        setDishName("");
    }

    return (
        <main style={{ paddingBottom: "100px" }}>
            <div className="forms-container">
                <form ref={formRef} action={addIngredient} className="add-ingredient-form">
                    <input 
                        type="text" 
                        placeholder="e.g. mutton" 
                        name="ingredient"
                        required
                    />
                    <button type="submit">Add Ingredient</button>
                </form>

                <div className="or-divider">OR</div>

                <form onSubmit={handleDishSubmit} className="add-ingredient-form">
                    <input 
                        type="text" 
                        placeholder="Enter dish name (e.g. Biryani)" 
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        required
                    />
                    <button type="submit">Get Dish Recipe</button>
                </form>
            </div>

            {ingredients.length > 0 && (
                <div className="fade-in">
                    <IngredientsList 
                        ingredients={ingredients} 
                        getRecipe={() => getRecipe("ingredients")} 
                        language={language}
                        setLanguage={setLanguage}
                    />
                    <button className="clear-btn" onClick={clearApp}>
                        ↺ Reset Kitchen
                    </button>
                </div>
            )}

            {loading && <p className="pulse">Chef Zubair is thinking... 🍳</p>}

            {recipe && <ZubairRecipe markdown={recipe} />}
            
            <div ref={recipeEndRef} style={{ height: "20px" }} />
        </main>
    );
}