const Result = ({ result }) => {
    if (!result || !result.criticalPath || result.criticalPath.length === 0) {
        return <div>Aucun résultat disponible.</div>;
    }

    return (
        <div>
            <h2>Durée Totale:
                {result.totalDuration} jours</h2>
            <h3>Chemin Critique:</h3>
            <ul>
                {result.criticalPath.map((task, index) => (
                    <li key={index}>
                        Tâche {task.id} ({task.name}) commence à jour {task.start} et finit à jour {task.end}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Result;
