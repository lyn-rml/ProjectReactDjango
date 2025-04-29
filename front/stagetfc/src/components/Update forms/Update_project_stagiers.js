import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

function UpdateProjectStagiers() {
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const id = searchparams.get('stage');
  const sujet_pris = searchparams.get('sujet_pris') === 'true'; // convert string to boolean

  const handleClick = (e) => {
    const action = e.target.value;
    if (action === "Modify interns informations about the project") {
      navigate(`/admin-dashboard/Modify-intern-project/?stage=${id}&sujet_pris=${sujet_pris}`);
    } else if (action === "Delete interns from the project") {
      navigate(`/admin-dashboard/Delete-intern-project/?stage=${id}&sujet_pris=${sujet_pris}`);
    } else if (action === "Finish") {
      navigate("/admin-dashboard/Stage");
    }
  };

  return (
    <div className="Add-modify">
      <div className="Add-modify-container">
        <div className="top-add-modify">
          <h2 className="title-add-modify">Select an action</h2>
        </div>

        <form className="form-add-modify">
          <div className="form-group" style={{ padding: "1rem" }}>
            <Link to={`/admin-dashboard/Add-intern-project?stage=${id}&sujet_pris=${sujet_pris}`}>
              <input
                type="button"
                className="btn btn-warning" style={{width:"450px"}}
                value="Add interns to the project"
                readOnly
              />
            </Link>
           
          </div>

          {sujet_pris && (
            <>
              <div className="form-group" style={{ padding: "1rem" }}>
                <input
                  type="button"
                  className="btn btn-warning" style={{width:"450px"}}
                  value="Modify interns informations about the project"
                  onClick={handleClick}
                  readOnly
                />
              </div>

              <div className="form-group" style={{ padding: "1rem" }}>
                <input
                  type="button"
                  className="btn btn-warning" style={{width:"450px"}}
                  value="Delete interns from the project"
                  onClick={handleClick}
                  readOnly
                />
              </div>

             
            </>
          )}
           <div className="form-group" style={{ padding: "1rem" }}>
                <input
                  type="button"
                  className="btn btn-warning" style={{width:"150px"}}
                  value="Finish"
                  onClick={handleClick}
                  readOnly
                />
              </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProjectStagiers;
