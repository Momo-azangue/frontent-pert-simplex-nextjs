import { useState } from 'react';

export default function Simplex() {
    const [constraints, setConstraints] = useState([[0, 0, 0]]);
    const [objective, setObjective] = useState([0, 0, 0]);
    const [result, setResult] = useState(null);

    const handleChange = (i, j, value, type) => {
        if (type === 'constraint') {
            const newConstraints = [...constraints];
            newConstraints[i][j] = parseFloat(value);
            setConstraints(newConstraints);
        } else {
            const newObjective = [...objective];
            newObjective[j] = parseFloat(value);
            setObjective(newObjective);
        }
    };

    const addConstraint = () => {
        setConstraints([...constraints, new Array(objective.length).fill(0)]);
    };

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:3001/solve-simplex', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ constraints, objective }),
        });
        const data = await response.text();
        setResult(data);
    };

    return (
        <div>
            <h1>Simplex Solver</h1>
            {constraints.map((row, rowIndex) => (
                <div key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <input
                            key={cellIndex}
                            type="number"
                            value={cell}
                            onChange={(e) => handleChange(rowIndex, cellIndex, e.target.value, 'constraint')}
                        />
                    ))}
                </div>
            ))}
            <button onClick={addConstraint}>Add Constraint</button>
            <div>
                <h2>Objective Function</h2>
                {objective.map((cell, cellIndex) => (
                    <input
                        key={cellIndex}
                        type="number"
                        value={cell}
                        onChange={(e) => handleChange(null, cellIndex, e.target.value, 'objective')}
                    />
                ))}
            </div>
            <button onClick={handleSubmit}>Solve</button>
            {result && (
                <div>
                    <h2>Result</h2>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
}
