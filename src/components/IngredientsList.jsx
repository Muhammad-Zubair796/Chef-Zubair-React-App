import React from 'react';

export default function IngredientsList(props) {
    const { ingredients, getRecipe } = props;

    const ingredientsListItems = ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li> 
    ))

    return (
        <section>
            <h2>Ingredients on Hand</h2>
            <ul className='ingredients-list' aria-live='polite'>
                {ingredientsListItems}
            </ul>
            
            {ingredients.length < 4 && (
                <p className="warning-text">Add {4 - ingredients.length} more ingredient(s) to unlock the recipe generator!</p>
            )}

            {ingredients.length >= 4 && (
                <div className='get-recipe-container'>
                    <div className="get-recipe-text">
                        <h3>Ready for a recipe?</h3>
                        <p>You have enough ingredients! Chef Zubair can now suggest a dish.</p>
                    </div>
                    <button onClick={getRecipe}>Get a recipe</button>
                </div>
            )}
        </section>
    )
}