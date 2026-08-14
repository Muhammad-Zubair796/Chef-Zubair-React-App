import React from 'react';

export default function IngredientsList(props) {
    const { ingredients, getRecipe } = props;

    return (
        <section>
            <h2>Ingredients on Hand</h2>
            <ul className='ingredients-list' aria-live='polite'>
                {ingredients.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            
            {ingredients.length < 4 ? (
                <div className="lock-message">
                    <p>🔒 Add <strong>{4 - ingredients.length}</strong> more ingredients to get a recipe suggestion.</p>
                </div>
            ) : (
                <div className='get-recipe-container'>
                    <div className="get-recipe-text">
                        <h3>Ready for a recipe?</h3>
                        <p>You have enough ingredients! Click below to generate a recipe.</p>
                    </div>
                    <button onClick={getRecipe}>Get a recipe</button>
                </div>
            )}
        </section>
    )
}//src\components\IngredientsList.jsx