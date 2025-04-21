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
  
      <Layout>
         <Outlet />
    
        </Layout>
     
    )
}export default AdminDashboard