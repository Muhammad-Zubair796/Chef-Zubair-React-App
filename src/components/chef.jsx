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

    async function getRecipe(type = "ingredients") {
        setRecipe(""); 
        setLoading(true);
        
        // Constructing the strict language and content prompt
        const languageInstruction = `Provide the recipe in ${language}. 
            CRITICAL: Avoid using Hindi or Arabic. Use Urdu translation only. 
            If a specific cooking word is difficult or uncommon in Urdu, use the English word instead.`;
        
        const searchTarget = type === "dish" ? `Dish Name: ${dishName}` : `Ingredients: ${ingredients.join(", ")}`;
        const finalPrompt = `${searchTarget}. ${languageInstruction}`;

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
            <div className="input-sections">
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

                <form onSubmit={handleDishSubmit} className="add-ingredient-form dish-form">
                    <input 
                        type="text" 
                        placeholder="Enter dish name (e.g. Biryani)" 
                        value={dishName}
                        onChange={(e) => setDishName(e.target.value)}
                        required
                    />
                    <button type="submit" className="dish-btn">Get Dish Recipe</button>
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