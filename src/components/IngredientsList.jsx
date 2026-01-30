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
            {ingredients.length > 3 && (
                <div className='get-recipe-container'>
                    <div className="get-recipe-text">
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe based on the ingredients you have added.</p>
                    </div>
                    <button onClick={getRecipe}>Get a recipe</button>
                </div>
            )}
        </section>
    )
}