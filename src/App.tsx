// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// import Banner from "./Banner";
import { Authenticator } from "@aws-amplify/ui-react";
import outputs from '../amplify_outputs.json'
import { Amplify } from "aws-amplify";
// import { get } from 'aws-amplify/api';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

import '@aws-amplify/ui-react/styles.css';
import WarehouseDashboard from "./components/warehouse/WarehouseDashboard";
import Home from "./components/Home";
import CustomerInformation from "./components/customers/CustomerInformation";

Amplify.configure(outputs)
 
// const client = generateClient<Schema>();




function App() {

  const currentLocation = useLocation()

 

  return (
    <Authenticator>
      {({ signOut, user }) => (
      <>
      <div className="user-info">
        <h5>User: {user?.signInDetails?.loginId}</h5> 
        <button onClick={signOut}>Sign out</button>
      </div>
      <main id="app">
        <div className="nav-logo-container"><img className="nav-logo" src="https://ssav.net/wp-content/uploads/2023/09/ssav-logo-lg-768x188.png" alt="logo" /><img className="nav-logo" src="https://mugwumpproductions.com/wp-content/uploads/2023/09/mw-logo-lg-600x137.png" alt="logo" /></div>
        <div className="nav-wrapper">
          <Link className={ currentLocation.pathname == '/' || currentLocation.pathname == '' ? 'current-nav' : ''} to='/'>Home</Link>
          <Link className={ currentLocation.pathname == '/warehouse' ? 'current-nav' : ''} to='/warehouse'>Warehouse</Link>
          <Link className={ currentLocation.pathname == '/customerInfo' ? 'current-nav' : ''} to='/customerInfo'>Customers</Link>
        </div>
          <Routes>
            <Route path="/"  element={<Home />}/>
            <Route path="warehouse"  element={<WarehouseDashboard />}/>
            <Route path="customerInfo"  element={<CustomerInformation />}/>
          </Routes>

      </main>
      </>
        
      )}
      
    </Authenticator>
  );
} 

export default App;
