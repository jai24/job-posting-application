import { useEffect, useState } from "react";
import { getJobs } from "../services/job";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../utils/auth";
import { deleteJob } from "../services/job";
import toast from "react-hot-toast";
import { Skills } from "./create";

function Home() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState(null);
    const [search, setSearch] = useState('');
    const handleSearch = (e) =>{
        setSearch(e.target.value);
        setFilteredJobs((jobs.filter((job)=>{
            return job.jobPosition.includes(e.target.value) || 
            job.companyName.includes(e.target.value) ||
            job.description.includes(e.target.value);
        })))
    }
    const handleDelete = async (id) => {
        const response = await deleteJob(id)
        try {
            if (response.status === 200) {
                toast.success('Job deleted successfully')
                fetchJobs();
            }
            else {
                toast.error(response.message)
            }

        }
        catch (error) {
            toast.error(red)
        }
    }

    useEffect(() => {
        const fetchJobs = async ({skills}) => {
            setLoading(true)
            const response = await getJobs({ id: null, skills });
            if (response.status === 200) {
                setJobs(response.data);
                setFilteredJobs(response.data);
            }
            setLoading(false)
        }
        const fetchUser = async () => {
            const response = await verifyToken();
            if (response.status === 200) {
                setUser(response.data)
            }
            setAuthLoading(false)
        }
        fetchUser();
        fetchJobs();
    }, [])

    const handleSkillChange = (skill) => {
        setSkills((prev) => {
            if (!prev) {
                return skill;
            }
            return prev.includes(skill) ? prev.filter((s) => s!==skill) : [...prev, skill];
        });
    }
    return (
        <div>
            <h1>Home</h1>
            <input type="text" placeholder="Search" value={search} onChange={handleSearch} />
            <select name="" id="">
                {Skills.map((skill) => {
                    return <option onClick={() => handleSkillChange(skill.value)} key={skill} value={skill.value}>{skill.label}</option>
                })}
            </select>
            {skills && skills.map((skill)=>{
                return <span style={{marginRight: '10px'}} key={skill}>{skill}</span>
            })}
            <button disabled={skills === null} onClick={()=> fetchJobs({skills})}>Apply filters</button>
            {loading ? <h1>Loading...</h1> : filteredJobs.map((job) => {
                return (
                    <div key={job._id}>
                        <h1>{job.jobPosition}</h1>
                        <p>{job.companyName}</p>
                        <p>{job.monthlySalary}</p>
                        <p>{job.description}</p>
                        {job.skills.map((skill) => {
                            return <span style={{ marginRight: '10px' }} key={skill}>{skill}</span>
                        })}
                        <button onClick={() => navigate(`/jobs/${job._id}`)}>Apply</button>
                        {authLoading || user === null ? <button disabled>Edit</button> : <button onClick={() => navigate(`/edit/${job._id}`)}>Edit</button>}
                        {authLoading || user === null ? <button disabled>Delete</button> : <button onClick={() => handleDelete(job._id)}>d</button>}
                    </div>
                )
            })}
        </div>
    )
}

export default Home;