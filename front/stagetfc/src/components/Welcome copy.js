import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection

import axios from "axios";

import StatCard from "./statisticsCard";
function WelcomeTest() {
    const navigate = useNavigate(); // Navigation hook
    const [upcomingPayments, setUpcomingPayments] = useState([]);
    const [countpay, setCountpay] = useState(0);
    const [endingInternships, setEndingInternships] = useState([]);
    const [countinternship, setCountinternship] = useState(0);
    // State for projects without interns
    const [Supstages, setSupstages] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);

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







    const getUpcomingPaymentsWithMembers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/payment-history/");
            const results = response.data.results;
    
            const today = new Date();
    
            // Loop over all records to dynamically PATCH the 'payed' field
            await Promise.all(
                results.map(async (record) => {
                    const nextPaymentDate = new Date(record.Next_Payment_date);
    
                    if (today > nextPaymentDate && record.payed !== false) {
                        // If today is after next payment date, mark as not paid
                        await axios.patch(`http://localhost:8000/api/payment-history/${record.id}/`, {
                            payed: false
                        });
                    } else if (today <= nextPaymentDate && record.payed !== true) {
                        // If today is before or on next payment date, mark as paid
                        await axios.patch(`http://localhost:8000/api/payment-history/${record.id}/`, {
                            payed: true
                        });
                    }
                })
            );
    
            // After updating, filter for upcoming payments
            const filtered = results.filter(record => {
                const nextPaymentDate = new Date(record.Next_Payment_date);
                const diffInTime = nextPaymentDate.getTime() - today.getTime();
                const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
                return diffInDays <= 10 && diffInDays > 0;
            });
    
            // Enrich filtered records with member info
            const enrichedRecords = await Promise.all(
                filtered.map(async (record) => {
                    const memberResponse = await axios.get(`http://localhost:8000/api/Membres/${record.Id_Membre}/`);
                    const nextPaymentDate = new Date(record.Next_Payment_date);
                    const daysLeft = Math.ceil((nextPaymentDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
                    return {
                        daysLeft,
                        id: memberResponse.data.id,
                        first_name: memberResponse.data.first_name,
                        last_name: memberResponse.data.last_name,
                    };
                })
            );
    
            // Save to state
            setUpcomingPayments(enrichedRecords);
            setCountpay(enrichedRecords.length);
    
        } catch (error) {
            console.error("Error fetching data:", error);
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
        fetchProjects();
        fetchUnpaidMembers();
        getUpcomingPaymentsWithMembers();
        getEndingInternships();
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
                <div className="d-flex flex-column p-3 shadow-sm bg-light rounded" style={{ width: '330px', height: '500px' }}>
                    <h6 className="text-center mb-3">Projects</h6>
                    <div className="overflow-auto pe-2">
                        {Supstages.map((i) => (
                            <div
                                key={i}
                                className="mb-2 mx-auto bg-white rounded shadow-sm d-flex align-items-center px-3"
                                style={{ width: '100%', height: '50px', fontWeight: 500 }}
                            >
                                {i.Title}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Payments */}
                <div>
                    


                        <div className="d-flex flex-column p-3 shadow-sm bg-light rounded" style={{ width: '330px', height: '240px' }}>
                            <h6 className="text-center text-danger">Unpaid Members</h6>
                            {members.map((i) => (
                                <div
                                    key={`unpaid-${i.id}`}
                                    className="mb-2 mx-auto bg-warning rounded shadow-sm d-flex align-items-center justify-content-between px-3"
                                    style={{ width: '100%', height: '50px', fontWeight: 500, color: '#333' }}
                                >
                                    <span>{i.first_name} {i.last_name}</span>
                                    <i className="bi bi-exclamation-circle-fill text-primary"></i>
                                </div>
                            ))}
                       
                    </div>
                    <div className="mt-4">
                    <div className="d-flex flex-column p-3 shadow-sm bg-light rounded" style={{ width: '330px', height: '240px' }}>
                        
                    
                        <h6 className="text-center mb-3">Upcoming Payments</h6>
                        <div className="overflow-auto pe-2">
                            {upcomingPayments.map((i) => (
                                <div
                                    key={`up-${i.id}`}
                                    className="mb-2 mx-auto bg-white rounded shadow-sm d-flex align-items-center px-3"
                                    style={{ width: '100%', height: '50px', fontWeight: 500 }}
                                >

                                    <span>{i.first_name} {i.last_name}</span>
                                    <span className=" text-primary" style={{ margin: "50px" }}>{i.daysLeft}d</span>
                                </div>
                            ))}
</div>


                        </div>
                    </div>
                </div>
                {/* Ending Internships */}
                <div className="d-flex flex-column p-3 shadow-sm bg-light rounded" style={{ width: '330px', height: '500px' }}>
                    <h6 className="text-center mb-3">Ending Internships</h6>
                    <div className="overflow-auto pe-2">
                        {endingInternships.map((i, idx) => (
                            <div
                                key={`intern-${idx}`}
                                className="mb-2 mx-auto bg-white rounded shadow-sm d-flex align-items-center px-3"
                                style={{ width: '100%', height: '50px', fontWeight: 500 }}
                            >

                                <span>{i.internFirstName} - {i.projectTitle}</span>
                                <span className="me-2 text-danger" style={{ margin: "50px" }}>{i.daysLeft}d</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >

    )
}

export default WelcomeTest;
