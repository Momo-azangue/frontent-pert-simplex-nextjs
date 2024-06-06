import { useState } from 'react';

const TaskForm = ({ addTask }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [dependencies, setDependencies] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask({ id, name, duration, dependencies: dependencies.split(',').map(dep => dep.trim()) });
        setId('');
        setName('');
        setDuration('');
        setDependencies('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Identifiant:</label>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} required />
            </div>
            <div>
                <label>Nom:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Durée (jours):</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>
            <div>
                <label>Dépendances (séparées par des virgules):</label>
                <input type="text" value={dependencies} onChange={(e) => setDependencies(e.target.value)} />
            </div>
            <button type="submit">Ajouter Tâche</button>
        </form>
    );
};

export default TaskForm;
