import React from 'react';

export default function IngredientsList(props) {
    const { ingredients, getRecipe } = props;

    const ingredientsListItems = ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li> 
    ))

    return (
        <section className="ingredients-section">
            <h2>Ingredients on Hand</h2>
            <ul className='ingredients-list' aria-live='polite'>
                {ingredientsListItems}
            </ul>
            
            {ingredients.length < 4 ? (
                <div className="requirement-notice">
                    <p>Add <strong>{4 - ingredients.length}</strong> more ingredient{ingredients.length === 3 ? "" : "s"} to generate a recipe suggestion.</p>
                </div>
            ) : (
                <div className='get-recipe-container'>
                    <div className="get-recipe-text">
                        <h3>Ready for a recipe?</h3>
                        <p>You've added enough ingredients! Let's see what Chef Zubair suggests.</p>
                    </div>
                    <button className="generate-btn" onClick={getRecipe}>Get a recipe</button>
                </div>
            )}
        </section>
    )
}