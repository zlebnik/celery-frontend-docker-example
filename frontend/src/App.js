import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useCallback} from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(function() {
    fetch('/api/tasks/').then((data) => {
      return data.json();
    }).then((tasks) => {
      setTasks(tasks);
    })
  }, [])

  const [email, setEmail] = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const emailHandler = useCallback((e) => {
    setEmail(e.target.value);
  });

  const submit = useCallback((e) => {
    fetch('/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email})
    })
        .then((response) => response.json())
        .then((task) => {
          setCurrentTask(task.task_id);
          setInterval(() => {
            fetch(`/api/tasks/${task.task_id}/`)
                .then((response) => response.json())
                .then((task) => {
                    if (task.task_state === 'SUCCESS') {
                        document.location.reload();
                    }
                })
          }, 500);
        });
    e.preventDefault();
  }, [setCurrentTask, email])

  return (
    <div className="App">
      <header className="App-header">
        Список задач
      </header>
      <ul>
      {tasks.map((task) => (
          <li>
              id: {task.task_id}<br/>
            Результат: {JSON.parse(task.result)}<br/>
            Состояние: {task.task_state}<br/>
          </li>
      ))}
      {currentTask ? (
          <li>
            id: {currentTask}<br/>
              Состояние: выполняется
          </li>
      ) : null}
      </ul>
        {!currentTask ? (
            <form onSubmit={submit}>
                <input type="email" placeholder="Введите email" onInput={emailHandler} value={email}/>
                <button type="submit">Отправить данные</button>
            </form>
        ) : null}
    </div>
  );
};

export default App;
