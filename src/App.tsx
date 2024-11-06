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


interface AwaitingPrep {
  id:string;
  displayName: string;
  calcStartDate: string;
}


function App() {
  const [scanLog, setScanLog] = useState([])
  const [awaitingPrep, setAwaitingPrep] = useState<AwaitingPrep[] | null>(null)
  

  useEffect(()=>{
    console.log(awaitingPrep)
  }, [awaitingPrep])
  useEffect(()=>{
    console.log("scanlog", scanLog)
  }, [scanLog])



  function getScanLog() {
    const apiString = '/scan-log/scan-history?page=0&size=20&sort=scanDate%2Cdesc'
    client.queries.scanLogApi({API_STRING: apiString}).then(res=> {
      
      // const response: string = JSON.stringify(res.data);
      setScanLog(JSON.parse(String(res.data)).content)
      
    }).catch(err=>console.log(err))
    
  }

  function getAwaitingPrep() {
    const apiString = '/element-list/row-data?definitionId=a220432c-af33-11df-b8d5-00e08175e43e&headerFieldTypeIds=name&headerFieldTypeIds=documentNumber&headerFieldTypeIds=personResponsibleId&headerFieldTypeIds=statusId&headerFieldTypeIds=calcStartDate&headerFieldTypeIds=calcEndDate&headerFieldTypeIds=locationId&headerFieldTypeIds=pickupLocationId&headerFieldTypeIds=returnLocationId&page=0&size=20&sort=calcStartDate%2Cdesc'
    client.queries.scanLogApi({API_STRING: apiString}).then(res=> {
      
      // const response: string = JSON.stringify(res.data);
      setAwaitingPrep(JSON.parse(String(res.data)).content)
      // console.log(JSON.parse(String(res.data)).content)
    }).catch(err=>console.log(err))
  }


 

  return (
    <Authenticator>
      {({ signOut, user }) => (
      <main>
        <h1>Sign in, {user?.signInDetails?.loginId}</h1>
        <button onClick={signOut}>Sign out</button>

        <h1>Home</h1>
        <button onClick={getScanLog}>Scanlog</button>
        <button onClick={getAwaitingPrep}>awaiting prep</button>
        {/* <button onClick={getSingleCategoryIds}>categories</button> */}
        {/* <ul>
          {scanLog.map((scan) => (
            <li key={scan.id}>{todo.content}</li>
          ))} 
        </ul>  */}
        {
        
        <div className="awaitingPrep-container">
          {awaitingPrep?.map((project, index) => (
            <Banner key={index} client={client.queries.scanLogApi} id={project.id} title={project.displayName} startDate={project.calcStartDate} />
          ))}
        </div>
        

        }
      </main>
        
      )}
      
    </Authenticator>
  );
} 

export default App;
