import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Dashboards
import AdminDashboard from './admin';
import MemberDashboard from './auth_components/member';

// Admin Components
import WelcomeTest from './components/Welcome copy';
import StageTest from './components/Tables/Stage copy';
import Stagiaire from './components/Tables/Stagiaire';
import Superviser from './components/Tables/Superviser';
import MembreComponentTest from './components/Tables/MembreComponent copy';

import AddProject from './components/Add forms/Add_project';
import AddSupstage from './components/Add forms/Add_supstage';
import AddStagier from './components/Add forms/Add_stagier';
import AddMember from './components/Add forms/Add_member';
import AddSuperviser from './components/Add forms/Add_superviser';
import AddSuperviserFromAddProject from './components/Add forms/Add-superviser-fromAddProject';
import AddStagestagiaire from './components/Add forms/Add_stagestagiaire';
import AddStageToInternForm from './components/Add forms/AddstagiaireStage';

import UpdateProject from './components/Update forms/Update_project';
import UpdateProjectSupervisers from './components/Update forms/Update_project_supervisers';
import UpdateProjectStagiers from './components/Update forms/Update_project_stagiers';
import UpdateSuperviser from './components/Update forms/Update_superviser';
import UpdateMember from './components/Update forms/Update_member';
import UpdateStagier from './components/Update forms/Update_stagier';

import ModifyStagestagiaire from './components/Update forms/Modify_stagestagiaire';
import DeleteStagestagiaire from './components/Update forms/Delete_stagestagiaire';

import DetailsProject from './components/Details/DetailsProjet';
import DetailsSuperviser from './components/Details/DetailsSuperviser';
import MembreDetails from './components/Details/DetailsMember';
import DetailsIntern from './components/Details/DetailsIntern';



const AppRouter = () => {
  return (
    <Routes>
    


      <Route path="/admin-dashboard/" element={<AdminDashboard />}>
        <Route index element={<WelcomeTest />} />
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

      <Route path="/member-dashboard/*" element={<MemberDashboard />} />

     
    </Routes>
  );
};

export default AppRouter;
