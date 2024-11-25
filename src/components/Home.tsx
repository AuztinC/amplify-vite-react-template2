import { useState } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
// import Banner from "./Banner";
// import { Authenticator } from "@aws-amplify/ui-react";
import outputs from '../../amplify_outputs.json'
import { Amplify } from "aws-amplify";
// import { get } from 'aws-amplify/api';
import { format, parseISO} from 'date-fns';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs)

interface Scan {
  barcode
: 
"12769"
contactAssetFacility
: 
null
contactAssetId
: 
null
elementId
: 
"478e7e06-2b66-4e03-a121-e049ec1df6b8"
id
: 
"fd251ce8-64f3-4b52-a534-da69c3124d04"
itemName
: 
"Jingle Bell - Large - Gold"
locationId
: 
"2f49c62c-b139-11df-b8d5-00e08175e43e"
locationName
: 
"SSAV"
modelId
: 
"e6aca368-9d21-4719-8fc7-a0dc248d24c9"
quantity
: 
4
referenceId
: 
null
referenceName
: 
"Lobby Christmas Decor (DMABY)"
scanDate
: 
"2024-11-22T19:10:59"
scanMode
: 
"prep"
scanModeDisplayString
: 
"Prep"
scanSource
: 
"Barcode"
userId
: string
userName
: string
}

const client = generateClient<Schema>();



function Home() {
  const [scanLog, setScanLog] = useState([])

  // useEffect(()=>{
  //   console.log(scanLog)
  // }, [scanLog])

  function formatDateTime(inputString: string): string {
    const date = parseISO(inputString); // Parse the ISO string into a Date object
    return format(date, 'MM/dd/yyyy h:mm a'); // Format the date as "mm/dd/yyyy hh:mm am/pm"
  }
  function getScanLog() {
    const apiString = '/scan-log/scan-history?page=0&size=20&sort=scanDate%2Cdesc'
    client.queries.FlexApiFunction({API_STRING: apiString}).then(res=> {
      
      // const response: string = JSON.stringify(res.data);
      setScanLog(JSON.parse(String(res.data)).content)
      
    }).catch(err=>console.log(err))
    
  }

  return (
      <main>
        <h1>Home</h1>
        
        <button onClick={getScanLog}>Refresh Scanlog</button>

        {scanLog ? 
        <ul>
          {scanLog.map((scan:Scan, index)=>
            <li key={index}>
              <span style={{fontWeight: '800'}}>{scan.itemName}: {scan.quantity!}</span> 
              <br />
              <span style={{fontWeight: '600'}}>{scan.referenceName}</span>
              <br /> 
              <span>{scan.userName}</span>
              <br />
              <span>{formatDateTime(scan.scanDate)}</span>
              
            </li>
          )}
         

        </ul> : <img src="https://ssav.net/wp-content/themes/images/ajax-loader.gif" alt="" /> }
      </main>
        
  );
} 

export default Home
;
