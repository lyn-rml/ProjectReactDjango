import React from 'react';
import Welcome from './components/Welcome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router,
  Routes,
  Route,
 } from 'react-router-dom'
import Stage from './components/Tables/Stage';
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
import WelcomUpdate from './components/Welcome';
import WelcomeTest from './components/WelcomTest';

function App() {

  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeTest />}>
            </Route>
            <Route path="/Stage" element={<Stage/>}>
              </Route>
               <Route path="/Stagiaire" element={<Stagiaire/>}>
              </Route>
               <Route path="/Superviser" element={<Superviser/>}> 
              </Route>
              <Route path="/Member" element={<MembreComponent/>}>
              </Route>
              <Route path="/DetailsStage" element={<DetailsProject/>}>
              </Route>
              <Route path="/Add-project" element={<AddProject/>}>
              </Route>
              <Route path="/Add-project/Add_supervisers_project" element={<AddSupstage/>}>
              </Route>
              <Route path="/Modifier-stage" element={<UpdateProject/>}>
              </Route>
              <Route path="/Modify-project-supervisers" element={<UpdateProjectSupervisers/>}>
              </Route>
              <Route path="/Modify-project-stagiers" element={<UpdateProjectStagiers/>}>
              </Route>
              <Route path="/Add-intern-project" element={<AddStagestagiaire/>}>
              </Route>
              <Route path="/Modify-intern-project" element={<ModifyStagestagiaire/>}>
              </Route>
              <Route path="/Delete-intern-project" element={<DeleteStagestagiaire/>}>
              </Route>
              <Route path="/Add-superviser" element={<AddSuperviser/>}>
              </Route>
              <Route path="Add-intern" element={<AddStagier/>}></Route>
              <Route path="Add-member" element={<AddMember/>}></Route>
              <Route path="Modifier-superviser" element={<UpdateSuperviser/>}></Route>
              <Route path="Modifier-Membre" element={<UpdateMember/>}></Route>
              <Route path="Modifier-intern" element={<UpdateStagier/>}></Route>
              <Route path="test" element={<WelcomeTest/>}></Route>
      </Routes>
    </Router>

      {/* <Welcome/> */}
    </div>
  );
}

export default App;