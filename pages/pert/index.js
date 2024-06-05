import { useState } from 'react';
import axios from 'axios';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import Result from '../../components/Result';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [result, setResult] = useState(null);

    const addTask = (task) => {
        setTasks([...tasks, task]);
    };

    const handleSubmitPost = async () => {
        const formData = new URLSearchParams();
        tasks.forEach((task, index) => {
            formData.append(`id${index + 1}`, task.id);
            formData.append(`name${index + 1}`, task.name);
            formData.append(`duration${index + 1}`, task.duration);
            formData.append(`dependencies${index + 1}`, task.dependencies.join(','));
        });

        try {
            const response = await axios.post('http://localhost/cgi-bin/pert.cgi', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('Réponse du serveur:', response.data);

            if (response.data && response.data.totalDuration !== undefined && response.data.criticalPath !== undefined) {
                setResult(response.data);
            } else {
                console.error('Structure de réponse inattendue', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des résultats', error);
        }
    };

    const handleSubmitGet = async () => {
        const params = new URLSearchParams();
        tasks.forEach((task, index) => {
            params.append(`id${index + 1}`, task.id);
            params.append(`name${index + 1}`, task.name);
            params.append(`duration${index + 1}`, task.duration);
            params.append(`dependencies${index + 1}`, task.dependencies.join(','));
        });

        try {
            const response = await axios.get('http://localhost/cgi-bin/pert.cgi', { params });

            console.log('Réponse du serveur:', response.data);

            if (response.data && response.data.message) {
                console.log(response.data.message);
            } else {
                console.error('Structure de réponse inattendue', response.data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des résultats', error);
        }
    };

    return (
        <div>
            <h1>Application PERT</h1>
            <TaskForm addTask={addTask} />
            <TaskList tasks={tasks} />
            <button onClick={handleSubmitPost}>Calculer PERT (POST)</button>
            <button onClick={handleSubmitGet}>Envoyer (GET)</button>
            {result && <Result result={result} />}
        </div>
    );
}
