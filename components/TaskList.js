const TaskList = ({ tasks }) => (
    <ul>
        {tasks.map((task, index) => (
            <li key={index}>
                {task.id} - {task.name} ({task.duration} jours)
            </li>
        ))}
    </ul>
);

export default TaskList;
