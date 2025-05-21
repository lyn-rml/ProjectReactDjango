import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navigate , Outlet} from 'react-router-dom';
import Layout from './mycomponent/layout';

function AdminDashboard (){
  const userType = localStorage.getItem('type_of_user');

  if (userType !== 'admin') {
    return <Navigate to="/" />;
  }
    return(
  <div
  >
      <Layout>
         <Outlet />
    
        </Layout>
        </div>
    )
}export default AdminDashboard