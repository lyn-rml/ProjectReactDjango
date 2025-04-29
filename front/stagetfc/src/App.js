import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './auth_components/login';
import AdminDashboard from './admin';
import MemberDashboard from './auth_components/member';

import Stagiaire from './components/Tables/Stagiaire';
import Superviser from './components/Tables/Superviser';
import MembreComponent from './components/Tables/MembreComponent';
import AddProject from './components/Add forms/Add_project';
import AddSupstage from './components/Add forms/Add_supstage';
import UpdateProject from './components/Update forms/Update_project';
import UpdateProjectSupervisers from './components/Update forms/Update_project_supervisers';
import UpdateProjectStagiers from './components/Update forms/Update_project_stagiers';
import AddStagestagiaire from './components/Add forms/Add_stagestagiaire';
import ModifyStagestagiaire from './components/Update forms/Modify_stagestagiaire';
import DeleteStagestagiaire from './components/Update forms/Delete_stagestagiaire';
import AddSuperviser from './components/Add forms/Add_superviser';
import AddStagier from './components/Add forms/Add_stagier';
import AddMember from './components/Add forms/Add_member';
import UpdateSuperviser from './components/Update forms/Update_superviser';
import UpdateMember from './components/Update forms/Update_member';
import UpdateStagier from './components/Update forms/Update_stagier';
import DetailsProject from './components/Details/DetailsProjet';
import Welcome from './components/Welcome';
import Stage from './components/Tables/Stage';
import AddSuperviserFromAddProject from './components/Add forms/Add-superviser-fromAddProject';
import DetailsSuperviser from './components/Details/DetailsSuperviser';
import MembreDetails from './components/Details/DetailsMember';
import DetailsIntern from './components/Details/DetailsIntern';
import AddStageToInternForm from './components/Add forms/AddstagiaireStage';
import WelcomeTest from './components/Welcome copy';
import StageTest from './components/Tables/Stage copy';
import MembreComponentTest from './components/Tables/MembreComponent copy';
const AppRouter = () => {
  const token = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  if (!token) {
    // Not logged in
    return (
  
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/admin-dashboard/" element={<AdminDashboard />}>
          <Route path="/admin-dashboard/" element={<WelcomeTest />} />
          <Route path="Stage" element={<StageTest />} />
          <Route path="Stagiaire" element={<Stagiaire />} />
          <Route path="Superviser" element={<Superviser />} />
          <Route path="Member" element={<MembreComponentTest />} />
          <Route path="DetailsStage" element={<DetailsProject />} />
          <Route path="DetailsSupervisor" element={<DetailsSuperviser />} />
          <Route path="DetailsMember" element={<MembreDetails />} />
          <Route path="Detailsintern" element={<DetailsIntern />} />
          <Route path="Add-project" element={<AddProject />} />
          <Route path="Add-project/Add_supervisers_project" element={<AddSupstage />} />
          <Route path="Modifier-stage" element={<UpdateProject />} />
          <Route path="Modify-project-supervisers" element={<UpdateProjectSupervisers />} />
          <Route path="Modify-project-stagiers" element={<UpdateProjectStagiers />} />
          <Route path="Add-intern-project" element={<AddStagestagiaire />} />
          <Route path="Modify-intern-project" element={<ModifyStagestagiaire />} />
          <Route path="Delete-intern-project" element={<DeleteStagestagiaire />} />
          <Route path="Add-superviser" element={<AddSuperviser />} />
          <Route path="Add-superviser-fromAddProject" element={<AddSuperviserFromAddProject />} />
          <Route path="Add_Project_to_intern" element={<AddStageToInternForm />} />
          <Route path="Add-intern" element={<AddStagier />} />
          <Route path="Add-member" element={<AddMember />} />
          <Route path="Modifier-superviser" element={<UpdateSuperviser />} />
          <Route path="Modifier-Membre" element={<UpdateMember />} />
          <Route path="Modifier-intern" element={<UpdateStagier />} />
        </Route>

          <Route path="/member-dashboard" element={<MemberDashboard />} />


        </Routes>
      
    );
  }

  // Authenticated, redirect based on user type
  if (userType === 'admin') {
    return <AdminDashboard />;
  } else if (userType === 'member') {
    return <MemberDashboard />;
  } else {
    return <Navigate to="/" />;
  }
}
export default AppRouter;
