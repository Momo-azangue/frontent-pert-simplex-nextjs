import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SimplexForm() {
    const [numConstraints, setNumConstraints] = useState(3);
    const [numVariables, setNumVariables] = useState(5); // Réglez ceci à 5 pour qu'il soit cohérent avec le backend
    const [constraints, setConstraints] = useState([
        ['1', '0.5', '1', '0', '0', '100'],
        ['0.2', '0.15', '0', '1', '0', '25'],
        ['0', '1', '0', '0', '1', '160']
    ]);
    const [objective, setObjective] = useState(['1.5', '0.9', '0', '0', '0', '0']);
    const [result, setResult] = useState(null);

    const handleNumConstraintsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
            setNumConstraints(value);
            setConstraints(Array(value).fill('').map(() => Array(numVariables + 1).fill('')));
        }
    };

    const handleNumVariablesChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
            setNumVariables(value);
            setObjective(Array(value + 1).fill(''));
            setConstraints(constraints.map(row => Array(value + 1).fill('')));
        }
    };

    const handleChange = (i, j, value, type) => {
        if (type === 'constraint') {
            const newConstraints = [...constraints];
            newConstraints[i][j] = value;
            setConstraints(newConstraints);
        } else {
            const newObjective = [...objective];
            newObjective[j] = value;
            setObjective(newObjective);
        }
    };

    const handleSubmit = async () => {
        const formattedConstraints = constraints.map(row => row.map(cell => parseFloat(cell) || 0));
        const formattedObjective = objective.map(cell => parseFloat(cell) || 0);

        const response = await fetch('http://localhost:3001/solve-simplex', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ constraints: formattedConstraints, objective: formattedObjective }),
        });
        const data = await response.text();
        setResult(data);
    };

    return (
        <div className="container mt-5">
            <h1>Simplex Solver</h1>
            <div className="mb-3">
                <label htmlFor="numConstraints" className="form-label">Nombre de contraintes</label>
                <input
                    type="number"
                    id="numConstraints"
                    className="form-control"
                    value={numConstraints}
                    min="1"
                    onChange={handleNumConstraintsChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="numVariables" className="form-label">Nombre de variables</label>
                <input
                    type="number"
                    id="numVariables"
                    className="form-control"
                    value={numVariables}
                    min="1"
                    onChange={handleNumVariablesChange}
                />
            </div>
            <h2>Contraintes</h2>
            {constraints.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-3">
                    {row.map((cell, cellIndex) => (
                        <input
                            key={cellIndex}
                            type="text"
                            className="form-control d-inline-block w-auto"
                            placeholder="0"
                            value={cell}
                            onChange={(e) => handleChange(rowIndex, cellIndex, e.target.value, 'constraint')}
                        />
                    ))}
                </div>
            ))}
            <h2>Fonction Objectif</h2>
            <div className="mb-3">
                {objective.map((cell, cellIndex) => (
                    <input
                        key={cellIndex}
                        type="text"
                        className="form-control d-inline-block w-auto"
                        placeholder="0"
                        value={cell}
                        onChange={(e) => handleChange(null, cellIndex, e.target.value, 'objective')}
                    />
                ))}
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>Solve</button>
            {result && (
                <div className="mt-5">
                    <h2>Result</h2>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
}
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [relations, setRelations] = useState([]);
    const [task, setTask] = useState({ nom: '', duree: '' });
    const [relation, setRelation] = useState({ id: '', predecesseurs: '' });
    const [result, setResult] = useState('');

    const handleAddTask = async () => {
        if (!task.nom || !task.duree) {
            alert("Veuillez remplir tous les champs pour la tâche.");
            return;
        }
        const response = await fetch('http://localhost:3001/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTask({ nom: '', duree: '' });
    };

    const handleAddRelation = async () => {
        if (!relation.id || !relation.predecesseurs) {
            alert("Veuillez remplir tous les champs pour la relation.");
            return;
        }
        const predecesseursArray = relation.predecesseurs.split(',').map(pred => pred.trim());
        const response = await fetch('http://localhost:3001/add-relation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: relation.id, predecesseurs: predecesseursArray }),
        });
        if (response.ok) {
            setRelations([...relations, { id: relation.id, predecesseurs: predecesseursArray }]);
            setRelation({ id: '', predecesseurs: '' });
        } else {
            const errorMessage = await response.text();
            alert(`Erreur : ${errorMessage}`);
        }
    };

    const handleCalculate = async () => {
        const response = await fetch('http://localhost:3001/calculate-dates');
        const data = await response.text();
        setResult(data);
    };

    return (
        <div className="container">
            <h1>PERT Calculator</h1>

            <div className="mb-3">
                <h2>Ajouter une tâche</h2>
                <div className="form-group">
                    <label htmlFor="taskName">Nom de la tâche</label>
                    <input
                        type="text"
                        className="form-control"
                        id="taskName"
                        placeholder="Nom"
                        value={task.nom}
                        onChange={(e) => setTask({ ...task, nom: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="taskDuration">Durée de la tâche (en jours)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="taskDuration"
                        placeholder="Durée"
                        value={task.duree}
                        onChange={(e) => setTask({ ...task, duree: e.target.value })}
                    />
                </div>
                <button className="btn btn-primary mt-2" onClick={handleAddTask}>Ajouter la tâche</button>
            </div>

            {tasks.length > 0 && (
                <div className="mb-3">
                    <h3>Tâches ajoutées</h3>
                    <ul className="list-group">
                        {tasks.map(task => (
                            <li key={task.id} className="list-group-item">
                                <strong>{task.label}</strong> - {task.nom} (Durée: {task.duree} jours)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-3">
                <h2>Ajouter une relation</h2>
                <div className="form-group">
                    <label htmlFor="dependentTask">Tâche dépendante</label>
                    <input
                        type="text"
                        className="form-control"
                        id="dependentTask"
                        placeholder="Tâche dépendante (lettre)"
                        value={relation.id}
                        onChange={(e) => setRelation({ ...relation, id: e.target.value.toUpperCase() })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="precedingTasks">Tâches précédentes</label>
                    <input
                        type="text"
                        className="form-control"
                        id="precedingTasks"
                        placeholder="Tâches précédentes (lettres séparées par des virgules)"
                        value={relation.predecesseurs}
                        onChange={(e) => setRelation({ ...relation, predecesseurs: e.target.value.toUpperCase() })}
                    />
                </div>
                <button className="btn btn-primary mt-2" onClick={handleAddRelation}>Ajouter la relation</button>
            </div>

            <div className="mb-3">
                <button className="btn btn-success" onClick={handleCalculate}>Calculer les dates</button>
            </div>

            {result && (
                <div className="mt-5">
                    <h2>Résultat</h2>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
}
