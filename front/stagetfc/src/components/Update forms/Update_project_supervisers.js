import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Homecolor from '../Homecolor'
// import axiosInstance from '../Axios_Instance'

function UpdateProjectSupervisers() {
    const menuPortalTarget = document.getElementById('root');
    const navigate = useNavigate();
    const [searchparams] = useSearchParams();
    const title = searchparams.get('stage');
    const sujet_pris=searchparams.get('sujet_pris');
    const [stageid, setstageid] = useState(0);
    let init = [];
    const [initialoptions, setinitialoptions] = useState([]);
    const [singleoptions, setsingleoptions] = useState([]);
    const [multioptions, setmultioptions] = useState([]);
    // const [count, setcount] = useState(0);
    // const [x, setx] = useState(0);
    const [singleselectedoption, setsingleselectedoption] = useState(null);
    const [multiselectedoptions, setmultiselectedoptions] = useState(() => {
        // getting stored value
        const saved = localStorage.getItem('multiselectedoptions');
        const initialValue = JSON.parse(saved);
        return initialValue || [];
      });
    const [formData, setformData] = useState({
        stage: 0,
        superviser: 0,
        //stage_domain:"",
        //stage_title:"",
        //stage_spec:"",
        //stage_pris:false,
        superviser_name: "",
        is_admin: false,
        //stage_pdf:"",
    });
    // const [ids, setids] = useState([]);
    const [adminid, setadminid] = useState(0);
    function handleChangesingle(arr, selectedOption) {
        setsingleselectedoption(selectedOption);
        console.log(selectedOption);
        console.log(selectedOption.value);
        const filtered = arr.filter(abc => (abc.value) !== (selectedOption.value));
        console.log("abcaft:", filtered);
        setmultioptions(filtered);
    }
    function filter(option, arra) {
        const filte = arra.filter(abc => abc !== option);//abc represent every value in the array
        return filte;

    }
    function handleChangemulti(arr, selectedOption) {
        setmultiselectedoptions(selectedOption);
        init = [];
        console.log("multiselectedoptions:", selectedOption);
        // console.log("multiopt:",multioptions);
        // console.log("multivalues:",multioptions[0].value);
        // console.log("singleoptionsbefmulti:",singleoptions);
        // console.log("selectedmulti:",selectedOption);
        setsingleoptions([]);
        if (selectedOption === null) {
            setsingleoptions(arr);
        }
        else {
            for (let i = 0; i < selectedOption.length; i++)
            {
                if (i === 0) 
                {
                    init = filter(selectedOption[i], arr);
                    console.log(`filteredmulti ${i}`, arr);
                    continue;
                }
                init = (filter(selectedOption[i], init));//.filter(abc=>(abc.value)===(selectedOption[i].value));
                console.log(`filteredmulti ${i}`, init);
            }
            setsingleoptions(init);
        }
    }

    function del(arr) {
        console.log("ids submit:", arr);
        for (let i = 0; i < arr.length; i++) {
            axios.delete(`http://localhost:8000/api/supstage/${arr[i]}/`)
                .then((res) => {
                    console.log("id=", arr[i]);
                })
                .catch((error) => console.log("error:", error));
        }
    }

    async function fillSupervisers() {
        let initopts = [];
        let singopt = {};
        let opts = [];
        let initids = [];
        await axios.get('http://localhost:8000/api/Supervisers/get_all/')
            .then(res => {
                opts = res.data.map(s => ({
                    "value": s.id,
                    "label": `${s.Nom} ${s.Prenom}`
                }
                ));
                // console.log("supervisers",res.data);
                // setcount(res.data.length);
                // setx((res.data.length) - 1);
                setinitialoptions(opts);
                setsingleoptions(opts);
                setmultioptions(opts);
            })
            .catch(function (error) {
                console.log(error);
            });
        //fill options
        await axios.get(`http://localhost:8000/api/supstage/get_all/?superviser__Nom__icontains=&stage__Domain__icontains=&stage__Title__icontains=${title}&stage__Speciality__icontains=&stage__Sujet_pris=unknown`)
            .then(res => {
                setstageid(res.data[0].stage);
                for (let i = 0; i < res.data.length; i++) 
                {
                    if (res.data[i].is_admin === true) {
                        setadminid(res.data[i].id);
                        singopt = {
                            value: res.data[i].superviser,
                            label: `${res.data[i].superviser_name}`,
                        };
                        setsingleselectedoption({
                            value: res.data[i].superviser,
                            label: `${res.data[i].superviser_name}`,
                        });
                        console.log("singopt", singopt);
                    }
                    else {
                        if(localStorage.getItem('multiselectedoptions'))
                        initids.push(res.data[i].id);
                        else
                        {
                            initids.push(res.data[i].id);
                            let varia = {
                                value: res.data[i].superviser,
                                label: `${res.data[i].superviser_name}`,
                            };
                            initopts.push(varia);
                            console.log("initopts:", initopts);
                        }
                    }
                }
                // setids(initids);
                if(initopts.length>0)
                {
                    localStorage.setItem('multiselectedoptions', JSON.stringify(initopts));
                    console.log("local storage set:", localStorage.setItem('multiselectedoptions', JSON.stringify(initopts)));
                    setmultiselectedoptions(initopts);
                    handleChangemulti(opts, initopts);
                    handleChangesingle(opts, singopt);
                }
                del(initids);
                if (localStorage.getItem('multiselectedoptions'))
                {
                    console.log("local storage get:",localStorage.getItem('multiselectedoptions'));
                    setmultiselectedoptions(JSON.parse(localStorage.getItem('multiselectedoptions')));
                    handleChangemulti(opts,JSON.parse(localStorage.getItem('multiselectedoptions')));
                    handleChangesingle(opts, singopt);
                }
                console.log("init ids:", initids);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => { fillSupervisers() }, []);//{}:pour fixer l'error destroy is not a function

    function handlesubmit(e) {
        for (let i = 0; i < 3; i++) {
            console.log("i=", i);
        }
        if (singleselectedoption !== null && title !== "") {
            formData.is_admin = true;
            formData.superviser = parseInt(singleselectedoption.value);
            formData.superviser_name = singleselectedoption.label;
            formData.stage = parseInt(stageid);
            e.preventDefault();
            axios.patch(`http://localhost:8000/api/supstage/${adminid}/`, formData)
                .then(res => {
                    console.log("success:", formData);
                    console.log("patch data:", res.config.data);
                    setformData({
                        superviser: 0,
                        superviser_name: "",
                    })
                    if ((multiselectedoptions.length)===0) 
                        {
                            localStorage.clear();
                            sessionStorage.setItem('id',formData.stage);
                            console.log("Sujet:",sujet_pris);
                            if((sujet_pris)!==true)
                             {
                                 navigate("/Stage");
                             }
                             navigate(`/Modify-project-stagiers?stage=${title}&sujet_pris=${sujet_pris}`);
                            
                        } 
                })
                .catch(function (error) {//en cas d'erreur
                    console.log(error);
                });
        }
        axios.get(`http://localhost:8000/api/supstage/get_all/?superviser__Nom__icontains=&stage__Domain__icontains=&stage__Title__icontains=${title}&stage__Speciality__icontains=&stage__Sujet_pris=unknown`)
            .then(res => {
                console.log("response middle submit:", res.data);
            })
            .catch(function (error) {//en cas d'erreur
                console.log(error);
            });
        if (multiselectedoptions !== null && title !== "") {
            for (let i = 0; i <= multiselectedoptions.length - 1; i++) 
            {
                console.log("multiselectedoptionsbefaxios:", multiselectedoptions);
                formData.is_admin = false;
                formData.superviser = parseInt(multiselectedoptions[i].value);
                //formData.superviser_name=multiselectedoptions[i].label;
                formData.stage = parseInt(stageid);
                e.preventDefault();
                axios.post('http://localhost:8000/api/supstage/', formData)
                    .then(res => {
                        console.log("success:", formData);
                        console.log("post data", [i], ":", res.config.data);
                        setformData({
                            superviser: 0,
                            superviser_name: "",
                            is_admin: false,
                        })
                        if(i===((multiselectedoptions.length)-1))
                            {
                                localStorage.clear();
                                sessionStorage.setItem('id',formData.stage);
                                console.log("Sujet:",sujet_pris);
                                if((sujet_pris)!==true)
                                    {
                                        navigate("/Stage");
                                    }
                                    navigate(`/Modify-project-stagiers?stage=${title}&sujet_pris=${sujet_pris}`);                       
                            }
                    })
                    .catch(function (error) {//en cas d'erreur
                        console.log(error);
                    });
            }
        }
    }
    async function backgroundcolor() {
        await Homecolor({ color: "#FDB600" })
    }
    useEffect(() => { backgroundcolor() }, []);
    return (
        <div className="Add-modify" >
            <h1 style={{ color: "transparent" }}>jflsdvnwkvle qrnvkrelkrengrekgtenkl relg rglkjglrg</h1>
            <div className="Add-modify-container">

                <div className="top-add-modify">
                    <h6 style={{ color: "transparent" }}>abc</h6>
                    <h2 className="title-add-modify">Modify Supervisers of the project</h2>
                    <h6 style={{ color: "transparent" }}>def</h6>
                </div>
                <form method="post" className="form-add-modify" enctype="multipart/form-data">
                    <div className="form-group add-modif">
                        <span style={{ color: "white", fontWeight: "400", fontSize: "1.75rem" }}>Select Main Superviser:</span>
                        <Select options={singleoptions} value={singleselectedoption} onChange={(selectedOption) => handleChangesingle(initialoptions, selectedOption)} required maxMenuHeight={220} menuPlacement="auto" menuPortalTarget={menuPortalTarget} />
                    </div>
                    <div className="form-group add-modif">
                        <span style={{ color: "white", fontWeight: "400", fontSize: "1.5rem" }}>Select Other Supervisers:</span>
                        <Select options={multioptions} value={multiselectedoptions} onChange={(selectedOption) => handleChangemulti(initialoptions, selectedOption)} maxMenuHeight={220} menuPlacement="auto" menuPortalTarget={menuPortalTarget} isMulti />
                    </div>

                    <div className='form-group' style={{ padding: "1rem" }}>
                        <label></label>
                        <input type="button" class="form-control add-btn" value="Modify superviser of the project" onClick={handlesubmit} readonly />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateProjectSupervisers
