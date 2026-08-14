import React from 'react';

export default function IngredientsList(props) {
    const { ingredients, getRecipe, language, setLanguage } = props;

    const ingredientsListItems = ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li> 
    ))

    return (
        <section>
            <div className="ingredients-header">
                <h2>Ingredients on Hand</h2>
                <button 
                    className="lang-toggle" 
                    onClick={() => setLanguage(prev => prev === "English" ? "Urdu" : "English")}
                >
                    🌐 Mode: {language}
                </button>
            </div>
            
            <ul className='ingredients-list' aria-live='polite'>
                {ingredientsListItems}
            </ul>
            
            {ingredients.length > 3 && (
                <div className='get-recipe-container'>
                    <div className="get-recipe-text">
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe in <strong>{language}</strong> based on your ingredients.</p>
                    </div>
                    <button onClick={getRecipe}>Get a recipe</button>
                </div>
            )}
        </section>
    )
}