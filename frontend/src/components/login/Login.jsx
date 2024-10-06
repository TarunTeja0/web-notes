import { Link, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import PasswordInput from "../PasswordInput";
import { useEffect, useState } from "react";
import {isEmailValid} from "../../utilities/helper"
import axiosInstance from "../../utilities/axiosInstance";

const Login = () => {

    const [email, setEmail] =useState("");
    const [password, setPassword] =useState("");
    const [error, setError] =useState(null);

    const navigate = useNavigate();
    

    const handleLogin = async (e) =>{
        e.preventDefault();

        if(!isEmailValid(email)){
            setError('Enter valid Email ID')
            return;
        }
        if(!password){
            setError('Please enter the password')
            return;
        }
        setError(null)
        
        //make login api call
        try{
            const response = await axiosInstance.post('/login',{
                email,
                password
            });

            if(response.data?.accessToken){
                localStorage.setItem("token", response.data.accessToken);
                navigate('/dashboard');
            }
        } catch(error){
            if(error.response?.data?.message){
                console.log(error);
                setError(error.response?.data?.message)
                return;
            }

            setError("An unexpected error occurred. Please try again later")
        }
    }
    return (
        <div>
            <Navbar />
            
            <div className="flex justify-center items-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-2xl mb-7">Login</h4>
                        <input type="text" placeholder="Email" className="inputBox" value={email} onChange={(e)=>setEmail(e.target.value)} />
                        <PasswordInput value={password} onChange={(e)=>setPassword(e.target.value)}/>

                        {error && <p className="text-red-500 text-xs pb-1 ">{error}</p>}
                        <button type="submit" className="btnPrimary">Login</button>
                        
                        <p className="text-sm text-center mt-4">
                            Not registered yet?{" "}
                            <Link to={"/signup"} className="font-medium text-primary underline">
                                Create an Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            
        </div>
    )
}
export default Login;