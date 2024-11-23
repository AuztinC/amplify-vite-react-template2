import {  useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Banner from "./Banner";
import { format, parseISO} from 'date-fns';
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
  const [awaitingPrep, setAwaitingPrep] = useState<AwaitingPrep[]>([])
  

  // useEffect(()=>{
  //   getAwaitingPrep()
  // }, [])

  function formatDateTime(inputString: string): string {
    const date = parseISO(inputString); // Parse the ISO string into a Date object
    return format(date, 'MM/dd/yyyy'); // Format the date as "mm/dd/yyyy hh:mm am/pm"
  }

  function getAwaitingPrep() {
    const apiString = '/element-list/row-data?definitionId=a220432c-af33-11df-b8d5-00e08175e43e&headerFieldTypeIds=name&headerFieldTypeIds=documentNumber&headerFieldTypeIds=personResponsibleId&headerFieldTypeIds=statusId&headerFieldTypeIds=calcStartDate&headerFieldTypeIds=calcEndDate&headerFieldTypeIds=locationId&headerFieldTypeIds=pickupLocationId&headerFieldTypeIds=returnLocationId&page=0&size=20&sort=calcStartDate%2Cdesc'
    client.queries.scanLogApi({API_STRING: apiString}).then(res=> {
      
      const response = JSON.parse(String(res.data)).content

      // Sort by `calcStartDate` in ascending order
      response.sort((a:AwaitingPrep, b:AwaitingPrep) => {
        const dateA = new Date(a.calcStartDate).getTime();
        const dateB = new Date(b.calcStartDate).getTime();
        return dateA - dateB;
      });
      setAwaitingPrep(response)
      // console.log(JSON.parse(String(res.data)).content)
    }).catch(err=>console.log(err))
  }
  function groupByStartDate(events: AwaitingPrep[]): Record<string, AwaitingPrep[]> {
    return events.reduce((acc, event) => {
      const startDate = event.calcStartDate.slice(0, 10);
      if (!acc[startDate]) {
        acc[startDate] = [];
      }
      acc[startDate].push(event);
      return acc;
    }, {} as Record<string, AwaitingPrep[]>);
  }

  const groupedEvents = groupByStartDate(awaitingPrep);

  return (
      <main className="warehouse-dashboard">
        <button className="button refresh-pullsheets" onClick={getAwaitingPrep}>Refresh Pullsheets</button>
        
        <div className="awaitingPrep-container">
          {
            Object.keys(groupedEvents).map((startDate, index) => {
              return <div key={index}>
                {/* Display calcStartDate */}
                <h4>{formatDateTime(startDate)}</h4>
                {groupedEvents[startDate]?.map((project, index) => (
                  <Banner key={index} client={client.queries.scanLogApi} project={project} />
                ))}
              </div>
            })
          }
          
        </div>
        
      </main>
        
  );
} 

export default WarehouseDashboard;
