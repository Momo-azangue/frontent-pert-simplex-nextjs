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
