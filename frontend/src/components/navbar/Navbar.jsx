import { useNavigate } from "react-router-dom";
import ProfileInfo from "../ProfileInfo";
import SearchBar from "../SearchBar";
import { useEffect, useState } from "react";

const Navbar = ({userInfo, searchQueryHandle, pageName}) => {
    const [page, setPage] = useState(pageName)
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        if(searchQueryHandle){
            searchQueryHandle(searchQuery)
        }
    }, [searchQuery])

    const onLogout = ()=>{
        localStorage.clear();
        navigate('/login');
    }

    const onClearSearch = () => {
        setSearchQuery("")
    }

    
    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
            <h2 className="text-xl font-medium text-black py-2 w-1/4 text-start">WebNotes</h2>
            {page==="dashboard" && 
                <>
                    <SearchBar value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onClearSearch={onClearSearch}/>
                    <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
                </>
            }
        </div>
    )
}
export default Navbar;