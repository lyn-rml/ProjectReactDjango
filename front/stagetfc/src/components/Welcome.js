import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { Link } from "react-router-dom";
import axios from "axios";

import StatCard from "./statisticsCard";
function Welcome() {
    const navigate = useNavigate(); // Navigation hook
    const [upcomingPayments, setUpcomingPayments] = useState([]);
    const [countpay, setCountpay] = useState(0);
    const [endingInternships, setEndingInternships] = useState([]);
    const [countinternship, setCountinternship] = useState(0);
    // State for projects without interns
    const [Supstages, setSupstages] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const internsResponse = await axios.get('http://localhost:8000/api/Stagiaires/');
        const stagesResponse = await axios.get('http://localhost:8000/api/stagestagiaire/');

        const internsData = internsResponse.data.results;
        const stagesData = stagesResponse.data.results;

        // Map interns by ID for quick access
        const internMap = new Map();
        internsData.forEach(intern => {
          intern.available = true; // Default to true
          internMap.set(intern.id, intern);
        });

        // Update availability based on internships
        stagesData.forEach(stage => {
          const internId = stage.intern_id;
          const isCertified = stage.Certified;

          if (internMap.has(internId)) {
            const intern = internMap.get(internId);
            if (!isCertified) {
              intern.available = false;
            }
          }
        });

        // Convert map back to array
        setInterns(Array.from(internMap.values()));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
    async function fetchProjects() {
        try {
            const res = await axios.get("http://localhost:8000/api/Stages/without_interns/");

            if (res.data) {
                const projects = Array.isArray(res.data) ? res.data : res.data.results || [];
                setSupstages(projects); // Display all projects
                setTotalProjects(projects.length); // Store total count
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    const [members, setMembers] = useState([]);
    const [totalUnpaidMembers, setTotalUnpaidMembers] = useState(0);

    async function fetchUnpaidMembers() {
        try {
            const res = await axios.get("http://localhost:8000/api/payment-history/unpayed/");
            const unpaidPayments = res.data;

            if (Array.isArray(unpaidPayments)) {
                setTotalUnpaidMembers(unpaidPayments.length);

                // Filter out null members
                const memberIds = unpaidPayments
                    .map((payment) => payment.Id_Membre)
                    .filter((id) => id !== null);

                // Fetch all members in parallel
                const memberResponses = await Promise.all(
                    memberIds.map((id) => axios.get(`http://localhost:8000/api/Membres/${id}/`))
                );

                const memberData = memberResponses.map((res) => res.data);
                setMembers(memberData);
                
            }
        } catch (error) {
            console.error("Error fetching unpaid members:", error);
        }
    }



const updatePayedStatus = async () => {
    try {
        const response = await axios.get("http://localhost:8000/api/payment-history/");
        const results = response.data.results;
        const today = new Date();

        await Promise.all(
            results.map(async (record) => {
                const nextPaymentDate = new Date(record.Next_Payment_date);

                if (today > nextPaymentDate && record.payed !== false) {
                    await axios.patch(`http://localhost:8000/api/payment-history/${record.id}/`, {
                        payed: false
                    });
                } else if (today <= nextPaymentDate && record.payed !== true) {
                    await axios.patch(`http://localhost:8000/api/payment-history/${record.id}/`, {
                        payed: true
                    });
                }
            })
        );

    } catch (error) {
        console.error("Error updating payed status:", error);
    }
};



const getUpcomingPayments = async () => {
    try {
        const response = await axios.get("http://localhost:8000/api/payment-history/upcoming/");
        const today = new Date();
        
        const enrichedRecords = response.data.map(record => {
            const nextPaymentDate = new Date(record.Next_Payment_date);
            const daysLeft = Math.ceil((nextPaymentDate - today) / (1000 * 3600 * 24));

            return {
                daysLeft,
                id: record.Id_Membre,
                first_name: record.first_name,
                last_name: record.last_name,
                Next_Payment_date: record.Next_Payment_date,
                payed: record.payed
            };
        });

        setUpcomingPayments(enrichedRecords);
        setCountpay(enrichedRecords.length);
        console.log(enrichedRecords);

    } catch (error) {
        console.error("Error fetching upcoming payments:", error);
    }
};




    const getEndingInternships = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/stagestagiaire/");
            const results = response.data.results;

            const today = new Date();

            const upcomingEndings = results
                .map(internship => {
                    const endDate = new Date(internship.End_Date);
                    const diffInTime = endDate.getTime() - today.getTime();
                    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

                    return {
                        daysLeft: diffInDays,
                        projectTitle: internship.project_details.Title,
                        internFirstName: internship.Intern_details.first_name,
                        id: internship.id
                    };
                })
                .filter(item => item.daysLeft > 0 && item.daysLeft <= 14);

            setEndingInternships(upcomingEndings);
            setCountinternship(upcomingEndings.length);

        } catch (error) {
            console.error("Error fetching internship data:", error);
        }
    };


useEffect(() => {
  const fetchAndPatchInterns = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/stagestagiaire/');
      const data = response.data.results;

      const processedInterns = await Promise.all(
        data.map(async (item) => {
          const intern = item.Intern_details;
          const certified = item.Certified;

          // Check if intern is assigned to a project and not certified
          if (intern.has_projects && !certified && intern.available === true) {
            try {
              await axios.patch(`http://localhost:8000/api/Stagiaires/${intern.id}/`, {
                available: false,
              });
              return { ...intern, available: false };
            } catch (patchError) {
              console.error(`Failed to patch intern ID ${intern.id}:`, patchError);
              return intern;
            }
          }

          return intern;
        })
      );

      // Optional: set state if you're displaying them in the UI
      setInterns(processedInterns);
    } catch (error) {
      console.error('Error fetching or patching interns:', error);
    }
  };

  fetchAndPatchInterns();
}, []);

    useEffect(() => {
        fetchProjects();
        fetchUnpaidMembers();
        getUpcomingPayments();
        getEndingInternships();
        updatePayedStatus();
    }, []);


    return (
        <div className="flex-grow-1">
            <div className="d-flex justify-content-center mb-3" style={{ gap: '130px', flexWrap: 'wrap' }}>
                <StatCard
                    count={totalProjects}
                    message={"Projects without intern"}
                    href={"/admin-dashboard/Stage?is_taken=false"}
                />
                <StatCard

                    count={totalUnpaidMembers}
                    message={"Members Not Payed"}
                    href={"/admin-dashboard/Member?A_paye=false"}
                    count2={countpay}
                    message2={"Membres should pay"}
                />
                <StatCard
                    count={countinternship}
                    message={"Internships Ending Soon"}
                    href={"/admin-dashboard/Stagiaire?with_condition=true"}
                />
            </div>

            {/* Data Cards */}
            <div className="d-flex justify-content-center" style={{ gap: '60px', flexWrap: 'wrap' }}>
                {/* Projects Without Interns */}
                <div className="d-flex flex-column p-3 shadow-sm bg-light rounded" style={{ width: '330px', height: 'calc(60vh )' }}>
                    <h6 className="text-center mb-3">Projects</h6>
                    <div className="overflow-auto pe-2">
                        {Supstages.map((i) => (
                            <div
                                key={i}
                                className="mb-2 mx-auto bg-white rounded shadow-sm d-flex align-items-center px-3"
                                style={{ width: '100%', height: '50px', fontWeight: 500 }}
                            >
                                <Link to={`/admin-dashboard/DetailsStage?stage=${i.id}`} className="me-2 project-link">
                                    {i.Title}
                                </Link>

                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Payments */}
                <div>


                    <div className="d-flex flex-column p-3 shadow-sm bg-light rounded" style={{ width: '330px', height: 'calc(29vh )' }}>
                        <h6 className="text-center text-danger">Unpaid Members</h6>
                        {members.map((i) => (
                            <div
                                key={`unpaid-${i.id}`}
                                className="mb-2 mx-auto bg-warning rounded shadow-sm d-flex align-items-center justify-content-between px-3"
                                style={{ width: '100%', height: '50px', fontWeight: 500, color: '#333' }}
                            >
                                <Link to={`http://localhost:3000/admin-dashboard/DetailsMember/?member=${i.id}`} className="me-2 project-link">
                                    <span>{i.first_name} {i.last_name}</span>
                                </Link>

                                <i className="bi bi-exclamation-circle-fill text-primary"></i>
                            </div>
                        ))}

                    </div>
                    <div className="mt-4">
                        <div className="d-flex flex-column p-3 shadow-sm bg-light rounded" style={{ width: '330px', height: 'calc(29vh )' }}>


                            <h6 className="text-center mb-3">Upcoming Payments</h6>
                            <div className="overflow-auto pe-2">
                                {upcomingPayments.map((i,index) => (
                                    <div
                                        key={`up-${index}`}
                                        className="mb-2 mx-auto bg-white rounded shadow-sm d-flex align-items-center px-3"
                                        style={{ width: '100%', height: '50px', fontWeight: 500 }}
                                    >

                                     <Link to={`http://localhost:3000/admin-dashboard/DetailsMember/?member=${i.id}`} className="me-2 project-link">
                                    <span>{i.first_name} {i.last_name}</span></Link> 
                                
                                     <span className="text-primary" style={{ marginLeft: "auto" }}>{i.daysLeft} days left</span>

                                    </div>
                                ))}
                            </div>


                        </div>
                    </div>
                </div>
                {/* Ending Internships */}
                <div className="d-flex flex-column p-3 shadow-sm bg-light rounded" style={{ width: '330px', height: 'calc(60vh )' }}>
                    <h6 className="text-center mb-3">Ending Internships</h6>
                    <div className="overflow-auto pe-2">
                        {endingInternships.map((i, idx) => (
                            <div
                                key={`intern-${idx}`}
                                className="mb-2 mx-auto bg-white rounded shadow-sm d-flex align-items-center px-3"
                                style={{ width: '100%', height: '50px', fontWeight: 500 }}
                            >

                                <Link to={`/admin-dashboard/Detailsintern?id=${i.id}`} className="me-2 project-link">
                                    <span>{i.internFirstName} - {i.projectTitle}</span>
                                </Link>

                                <span className="me-2 text-danger" style={{ margin: "50px" }}>{i.daysLeft}d</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Welcome;
