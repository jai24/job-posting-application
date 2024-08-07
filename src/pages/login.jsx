import { useState } from "react"
import { login } from '../services/auth';
import toast from "react-hot-toast";
import '../App.css';
export default function Login() {
    const [userData, setUserData] = useState({
        email: null,
        password: null
    })
    const { loading, setLoading } = useState(false)
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        if (!userData.email || !userData.password) {
            return;
        }
        try {
            const { email, password } = userData;
            const response = await login({ email, password })
            console.log(response);
            if (response.status === 200) {
                const { data } = response;
                localStorage.setItem('token', data.token);
                toast.success("User creater sucessfully");
            }
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            setLoading(false)
        }
    }
    return (<div>
        <div className="header">
            <div>
                <h1 className="loginHead">Already have an account?</h1>
                <p>Your personal job finder is here</p>
                <form onSubmit={handleSubmit}>
                    <input className="inputField" name="email" placeholder="Email" type="email" onChange={handleChange} value={userData.email} /><br />
                    <input className="inputField" name="password" type="Password" placeholder="Enter your password" onChange={handleChange} value={userData.password} /><br/>
                    <button className="button-signin" disabled={loading} type="submit">Submit</button>
                </form>
                <p className="lastLine">Don't have an account? <a href="./register">Sign Up</a></p>
            </div>
            <img className="loginBG" src="./src/assets/loginBG.png" alt="bgimage" />
        </div>
    </div>
    );
}