import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SimplexForm() {
    const [numConstraints, setNumConstraints] = useState(1);
    const [numVariables, setNumVariables] = useState(1);
    const [constraints, setConstraints] = useState([['']]);
    const [objective, setObjective] = useState(['']);
    const [result, setResult] = useState(null);

    const handleNumConstraintsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
            setNumConstraints(value);
            setConstraints(Array(value).fill('').map(() => Array(numVariables).fill('')));
        }
    };

    const handleNumVariablesChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
            setNumVariables(value);
            setObjective(Array(value).fill(''));
            setConstraints(constraints.map(row => Array(value).fill('')));
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
