import { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'
const PasswordInput = ({value, onChange}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className='inputBox flex justify-between items-center '>
            <input type={showPassword?"text":"password"} placeholder="Password" className="w-full outline-none " value={value} onChange={onChange}/>
            {
                showPassword 
                    ?
                    <FaRegEye
                        size={22}
                        className='text-primary cursor-pointer'
                        onClick={()=>setShowPassword(false)} />
                    :
                    <FaRegEyeSlash 
                        size={22}
                        className='text-slate-400 cursor-pointer'
                        onClick={()=>setShowPassword(true)} />
            }
            
        </div>
    )
}

export default PasswordInput