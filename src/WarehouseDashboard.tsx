import { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Banner from "./Banner";
// import { Authenticator } from "@aws-amplify/ui-react";
import outputs from '../amplify_outputs.json'
import { Amplify } from "aws-amplify";
// import { get } from 'aws-amplify/api';
// import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs)
 
const client = generateClient<Schema>();


interface AwaitingPrep {
  id:string;
  displayName: string;
  calcStartDate: string;
  
}


function WarehouseDashboard() {
  const [awaitingPrep, setAwaitingPrep] = useState<AwaitingPrep[] | null>(null)
  

  // useEffect(()=>{
  //   console.log(awaitingPrep)
  // }, [awaitingPrep])



  function getAwaitingPrep() {
    const apiString = '/element-list/row-data?definitionId=a220432c-af33-11df-b8d5-00e08175e43e&headerFieldTypeIds=name&headerFieldTypeIds=documentNumber&headerFieldTypeIds=personResponsibleId&headerFieldTypeIds=statusId&headerFieldTypeIds=calcStartDate&headerFieldTypeIds=calcEndDate&headerFieldTypeIds=locationId&headerFieldTypeIds=pickupLocationId&headerFieldTypeIds=returnLocationId&page=0&size=20&sort=calcStartDate%2Cdesc'
    client.queries.scanLogApi({API_STRING: apiString}).then(res=> {
      
      // const response: string = JSON.stringify(res.data);
      setAwaitingPrep(JSON.parse(String(res.data)).content)
      // console.log(JSON.parse(String(res.data)).content)
    }).catch(err=>console.log(err))
  }


 

  return (
      <main id="warehouse-body">
        <h3>Warehouse</h3>
        <button onClick={getAwaitingPrep}>Refresh Pullsheets</button>
        
        <div className="awaitingPrep-container">
          {awaitingPrep?.map((project, index) => (
            <Banner key={index} client={client.queries.scanLogApi} project={project} />
          ))}
        </div>
        
      </main>
        
  );
} 

export default WarehouseDashboard;
