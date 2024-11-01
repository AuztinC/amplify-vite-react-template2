import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Banner from "./Banner";
import { Authenticator } from "@aws-amplify/ui-react";
import outputs from '../amplify_outputs.json'
import { Amplify } from "aws-amplify";

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs)
 
const client = generateClient<Schema>();
function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [scanLog, setScanLog] = useState([])
  
  const projects = [
    { title: 'Project 1', info: 'Details about Project 1' },
    { title: 'Project 2', info: 'Details about Project 2' },
    { title: 'Project 3', info: 'Details about Project 3' },
  ];

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  useEffect(()=>{
    console.log(scanLog)
  }, [scanLog])

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  function getScanLog() {
    const apiString = '/scan-log/scan-history?page=0&size=20&sort=scanDate%2Cdesc'
    client.queries.scanLogApi({API_STRING: apiString}).then(res=> {
      
      // const response: string = JSON.stringify(res.data);
      setScanLog(JSON.parse(String(res.data)))
      
    }).catch(err=>console.log(err))
    
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
      <main>
        <h1>Hello {user?.username}</h1>
        <button onClick={signOut}>Sign out</button>

        {/* <h1>My todos</h1>
        <button onClick={getScanLog}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul> */}
        <div className="app">
          {projects.map((project, index) => (
            <Banner key={index} title={project.title} info={project.info} />
          ))}
        </div>
      </main>
        
      )}
      
    </Authenticator>
  );
} 

export default App;
