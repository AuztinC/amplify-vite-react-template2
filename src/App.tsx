import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
 
const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  // const [scanLog, setScanLog] = useState()
  

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  function getScanLog() {
    client.queries.scanLogApi().then(res=> {
      console.log(res)
    }).catch(err=>console.log(err))
    
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={getScanLog}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </main>
  );
} 

export default App;
