import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navigate , Outlet} from 'react-router-dom';
import Layout from './mycomponent/layout';

function AdminDashboard (){
  const userType = localStorage.getItem('user_type');

  if (userType !== 'admin') {
    return <Navigate to="/" />;
  }
    return(
  <div
  style={{
    backgroundColor: "#76ABDD", // soft background
    padding: "2rem",
    borderRadius: "12px",
    minHeight: "100vh", // makes sure it takes up full height
  }}
  >
      <Layout>
         <Outlet />
    
        </Layout>
        </div>
    )
}export default AdminDashboard