import { useEffect, useRef, useState } from 'react'
import './App.css'
import './styles.css'

interface Task {
	text: string;
	completed: boolean;
}

function App() {
  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>();

  const handleAddTask = (): void => {
	  if (task.trim() === '') return;

	  setTasks(previousTasks =>
		  [...previousTasks, { text: task.trim(), completed: false }]
	  );

	  setTask('');
  }

  const handleCompleteTask = (index: number): void => {
	  setTasks(previousTasks =>
		  previousTasks.map((task, taskIndex) =>
			  taskIndex === index
				  ? {...task, completed: true}
				  : task
		  )
	  );
  }

  const handleDelete = (index: number): void => {
	  if (confirm('Do you really want to delete this?')) {
		  setTasks(previousTasks =>
			  previousTasks.filter((_, taskIndex) => taskIndex !== index)
		  );
	  }
  }

  return (
    <>
	  <h1>Task Manager</h1>
	  <div>
		  <h2>Filters</h2>
		  <button>All</button>
		  <button>Active</button>
		  <button>Completed</button>
	  </div>
	  <div className='task-input'>
	    <label>Task Name: 
			<input type='text' placeholder='Task Name' id='task' value={task} onChange={(e) => setTask(e.target.value)} />
		</label> 
	    <button onClick={handleAddTask}>Add Task</button>
	  </div>
	  <div className='tasks-display'>
	    {tasks.map((task, taskIndex) => <Task handleDelete={handleDelete} index={taskIndex} key={taskIndex + task} text={task} />)}
	  </div>
    </>
  )
}

interface TaskProps {
	index: string;
	text: string;
	handleDelete: Function;
}

function Task ({ handleDelete, index, text }: TaskProps) {
	const [checked, setChecked] = useState<boolean>(false);
	const checkRef = useRef(null);

	useEffect(() => {
		if (checkRef.current) {
			const listener = () => {
				if (checkRef?.current.checked) {
					setChecked(true);
				} else {
					setChecked(false);
				}
			}
			checkRef.current.addEventListener('change', listener);
			return () => removeEventListener('change', listener);
		}
	}, [])

	return (
		<div className={checked ? 'strikethrough' : 'task'}>
			{text}
		    <label> Mark Complete:
				<input ref={checkRef} type="checkbox" id={index} name={index} value={text} />
			</label>
			<button onClick={() => handleDelete(index)}>Delete</button>
		</div>
	)
}

export default App
