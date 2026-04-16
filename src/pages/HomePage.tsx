const stages = [
    {
        name: "Breathe",
        description: "A guided breathing exercise to calm and centre yourself.",
    },
    {
        name: "Feel",
        description: "Reflect on how you're feeling right now, without judgement.",
    },
    {
        name: "Gratitude",
        description: "Name something you're grateful for today.",
    },
    {
        name: "Intention",
        description: "Set a positive intention to carry into the day.",
    },
];

export function HomePage() {
    return (
        <div className="homepage">
            <header className="hero">
                <h1>Daily Check-In</h1>
                <p className="hero-subtitle">
                    A short daily practice to help you start your day with intention. Sign
                    up and receive a guided check-in email every day at 10 AM.
                </p>
            </header>

            <section className="stages">
                <h2>How it works</h2>
                <p className="stages-intro">
                    Each morning you'll be walked through four mindfulness stages:
                </p>
                <ol className="stages-list">
                    {stages.map((stage) => (
                        <li key={stage.name} className="stage-card">
                            <h3>{stage.name}</h3>
                            <p>{stage.description}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="cta">
                <a href="/signup" className="cta-button">
                    Sign Up
                </a>
            </section>
        </div>
    );
}
