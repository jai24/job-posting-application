import { useEffect, useState } from "react"
import { CreateJob, getJobs } from "../services/job"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast";
export const Skills = [
    {
        value: 'React',
        label: 'React'
    },
    {
        value: 'Node',
        label: 'Node'
    }, {
        value: 'Express',
        label: 'Express'
    }, {
        value: 'MongoDB',
        label: 'MongoDB'
    }, {
        value: 'Python',
        label: 'Python'
    }, {
        value: 'DSA',
        label: 'DSA'
    }, {
        value: 'Java',
        label: 'Java'
    }, {
        value: 'FullStack',
        label: 'FullStack'
    }, {
        value: 'Mern',
        label: 'Mern'
    }
]
export default function Create() {
    const {id} = useParams();
    const{loading,setLoading} =useState(flase)
    const [formData, setFormData] = useState({
        companyName: null,
        logoUrl: null,
        jobPosition: null,
        monthlySalary: null,
        jobType: null,
        remote: null,
        location: null,
        descripion: null,
        about: null,
        skills: [],
        information: null
    })

    const handleChange=(e)=>{
        if(e.target.name==='skills'){
            return setFormData({
                ...formData,
                skills: formData.skills.includes(e.target.value)?formData.skills.filter
                (skill=>skill!==e.target.value):[...formData.skills,e.target.value]
            })
        }
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true)
        const data={...formData};
        data.skills = data.skills.join(',');
        try{
            const jobid = id? id:null;
            const response = await CreateJob({data,id:jobid});
            console.log(response);
            if(response.status === 201){
                jobid ? toast.success('Job updated sucessfully'): toast.success("Job created sucessfully");
                setFormData(response.data);
            }
        }
        catch(error){
            console.log(error.message)
        }
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        const fetchJob = async()=>{
            const response = await getJobs({id});
            if(response.status===200){
                setFormData(response.data)
            }
        }
        if(id){
            fetchJob();
        }
    },[])
    return (<>
        <div>
            <h1>Create</h1>
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'15px', width:'50vw'}}>
                <input onChange={handleChange} value={formData.companyName} name="companyName" type="text" placeholder="Company Name" />
                <input onChange={handleChange} value={formData.logoUrl} name="logoUrl" type="text" placeholder="Logo URL" />
                <input onChange={handleChange} name="jobPosition" value={formData.jobPosition} type="text" placeholder="Job Position" />
                <input onChange={handleChange} name="monthlySalary" value={formData.monthlySalary} type="text" placeholder="Monthly Salary" />
                <select onChange={handleChange} name="jobType" value={formData.jobType} id="" placeholder="Job Type">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                </select>
                <select onChange={handleChange} value={formData.remote} name="remote" id="" placeholder="Remote">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
                <input onChange={handleChange} name="location" value={formData.location} type="text" placeholder="Location" />
                <textarea onChange={handleChange} name="description" value={formData.description} id="" placeholder="Description"></textarea>
                <textarea onChange={handleChange} name="about" id="" value={formData.about} placeholder="About"></textarea>
                <select
                    onChange={handleChange}
                    name="skills"
                    value={formData.skills}
                    multiple
                >
                    {Skills.map((skill, idx) => (
                        <option selected={formData.skills.includes(skill.value)} key={idx} value={skill.value}>
                            {skill.label}
                        </option>
                    ))}
                </select>
                <input onChange={handleChange} type="text" value={formData.information} name="information" placeholder="Information" />
                    {id ? <button disabled={loading} type="submit">Update</button>:<button disabled={loading} type="submit">Submit</button>}
            </form>
        </div>

    </>)
}