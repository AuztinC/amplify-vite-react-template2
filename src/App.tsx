// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// import Banner from "./Banner";
import { Authenticator } from "@aws-amplify/ui-react";
import outputs from '../amplify_outputs.json'
import { Amplify } from "aws-amplify";
// import { get } from 'aws-amplify/api';
import { Routes, Route} from 'react-router-dom';

import '@aws-amplify/ui-react/styles.css';
import WarehouseDashboard from "./WarehouseDashboard";
import Home from "./Home";

Amplify.configure(outputs)
 
// const client = generateClient<Schema>();




function App() {


 

  return (
    <Authenticator>
      {({ signOut, user }) => (
      <main id="app">
        <h5>User: {user?.signInDetails?.loginId}</h5>
        <button onClick={signOut}>Sign out</button>
        <div className="nav-logo-container"><img className="nav-logo" src="src\assets\ssav-logo-lg-600x147.png" alt="logo" /></div>
        
          <Routes>
            <Route path="/"  element={<Home />}/>
            <Route path="warehouse"  element={<WarehouseDashboard />}/>
          </Routes>

      </main>
        
      )}
      
    </Authenticator>
  );
} 

export default App;
