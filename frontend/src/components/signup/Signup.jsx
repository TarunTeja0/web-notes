import { useState } from "react";
import {isEmailValid} from '../../utilities/helper'
import PasswordInput from "../PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import axiosInstance from "../../utilities/axiosInstance";

const Signup = () => {
    const [name, setName] = useState("")
    const [email, setEmail] =useState("");
    const [password, setPassword] =useState("");
    const [error, setError] =useState(null);

    const navigate = useNavigate();

    const handleSignup = async (e) =>{
        e.preventDefault();

        if(!name){
            setError('Please enter your name')
            return;
        }
        if(!isEmailValid(email)){
            setError('Enter valid Email ID')
            return;
        }
        if(!password){
            setError('Please enter the password')
            return;
        }
        setError(null)

        try{
            const response = await axiosInstance.post('/create-account', {
                fullName: name,
                email,
                password
            });

            if(response.data?.accessToken){
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }

        } catch(error){
            if(error.response?.data?.message){
                setError(error.response.data.message);
            }else{
                setError("An unexpected error occured. Please try again later.")
            }
        }

    }
    return (
        <div>
            <Navbar />
            
            <div className="flex justify-center items-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignup}>
                        <h4 className="text-2xl mb-7">Signup</h4>
                        <input type="text" placeholder="Name" className="inputBox" value={name} onChange={(e)=>setName(e.target.value)} />
                        <input type="text" placeholder="Email" className="inputBox" value={email} onChange={(e)=>setEmail(e.target.value)} />
                        <PasswordInput value={password} onChange={(e)=>setPassword(e.target.value)}/>

                        {error && <p className="text-red-500 text-xs pb-1 ">{error}</p>}
                        <button type="submit" className="btnPrimary">Create Account</button>
                        
                        <p className="text-sm text-center mt-4">
                            Already have an account?{" "}
                            <Link to={"/login"} className="font-medium text-primary underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            
        </div>
    )
}
export default Signup;