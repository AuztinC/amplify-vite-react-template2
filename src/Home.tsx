import { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
// import Banner from "./Banner";
// import { Authenticator } from "@aws-amplify/ui-react";
import outputs from '../amplify_outputs.json'
import { Amplify } from "aws-amplify";
// import { get } from 'aws-amplify/api';
// import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs)
 
const client = generateClient<Schema>();



function Home() {
  const [scanLog, setScanLog] = useState([])

  console.log(scanLog)

 
  function getScanLog() {
    const apiString = '/scan-log/scan-history?page=0&size=20&sort=scanDate%2Cdesc'
    client.queries.scanLogApi({API_STRING: apiString}).then(res=> {
      
      // const response: string = JSON.stringify(res.data);
      setScanLog(JSON.parse(String(res.data)).content)
      
    }).catch(err=>console.log(err))
    
  }

  return (
      <main>
        <h1>Home</h1>
        
        <button onClick={getScanLog}>Scanlog</button>
      </main>
        
  );
} 

export default Home
;
