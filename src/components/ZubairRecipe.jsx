import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ZubairRecipe({ markdown }) {
    const [displayedText, setDisplayedText] = React.useState("");
    const [index, setIndex] = React.useState(0);

    // This effect creates the typing animation
    React.useEffect(() => {
        setDisplayedText(""); // Reset when new recipe comes
        setIndex(0);
    }, [markdown]);

    React.useEffect(() => {
        if (index < markdown.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + markdown[index]);
                setIndex((prev) => prev + 1);
            }, 15); // Adjust speed here (lower is faster)
            return () => clearTimeout(timeout);
        }
    }, [index, markdown]);

    return (
        <section className="suggested-recipe-container">
            <h2>Chef Zubair Recommends:</h2>
            <article className="recipe-card">
                <ReactMarkdown>{displayedText}</ReactMarkdown>
            </article>
        </section>
    );
}