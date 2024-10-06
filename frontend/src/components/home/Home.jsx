import { MdAdd } from "react-icons/md"
import Navbar from "../navbar/Navbar"
import NoteCard from "./NoteCard"
import AddEditNotes from "./AddEditNotes"
import Modal from 'react-modal'
import { useEffect, useState } from "react"
import axiosInstance from "../../utilities/axiosInstance";
import { useNavigate } from "react-router-dom"
import Toast from "../ToastMessage/Toast"
import EmptyCard from "./EmptyCard";
import AddNotesImg from "../../assets/images/add-notes.svg"
import NoNote from "../../assets/images/no-note.svg"
const Home = () => {
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            navigate('/login');
        }
    }, [])
    
    const [openAddEditModal, setOpenAddEditModal] =useState({
        isOpen: false,
        type: "add",
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add"
    });
    
    useEffect(()=>{
        getUserInfo();
        getAllNotes();
    }, [])


    const [userInfo, setUserInfo] = useState(null);
    const [allNotes, setAllNotes] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    console.log('allNote', allNotes)

    const getUserInfo = async()=>{
        console.log("getuserInfo")
        try{
            const response =await axiosInstance.get('/get-user');
            
            if(response.data?.userInfo){
                setUserInfo(response.data.userInfo);
            }
        } catch(error){
            if(error.response?.data?.message){
                localStorage.clear();
                navigate('/login');
            }
        }
    }

    const getAllNotes = async() => {
        console.log("getAllNotes");

        try{
            const response = await axiosInstance.get('/get-all-notes');

            console.log(response);
            if(response.data?.notes){
                setAllNotes(response.data.notes);
            }
        }catch(error){
            console.log('An unexpected error occured. Please try again later.')
        }
    }

    const onEditHandle = (noteData) => {
        return setOpenAddEditModal({
            isOpen: true,
            type: "edit",
            data: noteData,
        });
    }



    const showToastMsgFunc = (message, type) => {
        setShowToastMsg({
            isShown:true,
            message,
            type
        })
    }
    const handleCloseToast = () => {
        setShowToastMsg({
            isShown:false,
            message: ""
        })
    }

    const onDeleteHandle = async (note) => {
        try{
            const response = await axiosInstance.delete("/delete-note/" + note._id);

            if(!response.data?.error){
                showToastMsgFunc("Note Deleted Successfully", "delete");
                getAllNotes();
            }
        } catch(error){
            if(error.response?.data?.message){
                console.log("An expected error occured. Please try again");
            }
        }
    }

    const onPinNoteHandle = async (noteId) => {
        try{
            const response = await axiosInstance.put("/toggle-pin/"+noteId);

            if(response.data?.note){
                showToastMsgFunc(`Note ${response.data.note.isPinned ? "Pinned" : "Unpinned"} Successfully`, "update")
                getAllNotes();
            }
        } catch(error){
            console.log(error);
        }
    }
    
    const searchQueryHandle = async (searchData) => {
        if(searchData===""){
            setIsSearch(false);
            return getAllNotes();
        }
            setIsSearch(true);
        try{
            const response = await axiosInstance.get("/search-notes?search="+searchData)

            if(response.data?.notes){
                setAllNotes(response.data.notes);
            }
        } catch(error){
            console.log(error);
        }
    }
      




    return (
        <div>
            <Navbar userInfo={userInfo} searchQueryHandle={searchQueryHandle} pageName={"dashboard"}/>
            
            <div className="container mx-auto">
                {(allNotes?.length > 0 ) ? 
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {
                        allNotes?.map((note,index)=>{
                            return <NoteCard key={note._id} 
                                title={note.title}
                                date={note.createdOn}
                                content={note.title}
                                tags={note.tags}
                                isPinned={note.isPinned}
                                onEdit={()=>onEditHandle(note)}
                                onDelete={()=>{onDeleteHandle(note)}}
                                onPinNote={()=>{onPinNoteHandle(note._id)}}
                            />
                        })
                    }
                
                </div>
                :
                <EmptyCard imgSrc={!isSearch ? AddNotesImg : NoNote} message={!isSearch ? "Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas and reminders. Let's get started" : "Oops! No matching note found."}/>
                }
            </div>


            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
             onClick={()=>{
                setOpenAddEditModal({isOpen: true, type:"add", data:null});
             }}>
                <MdAdd className="text-[32px] text-white" />
            </button>
            
            <Modal
            isOpen={openAddEditModal.isOpen}
            onRequestClose={()=>{}}
            ariaHideApp={false}
            style={{
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.2)",
                }
            }}
            contentLabel=""
            className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5  ">
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose = {()=>setOpenAddEditModal({isOpen:false, type: "add", data: null})}
                    getAllNotes= {()=>getAllNotes()} 
                    showToastMsgFunc = {showToastMsgFunc}/>
            </Modal>
            
            {
                showToastMsg.isShown && <Toast 
                    isShown={showToastMsg.isShown}
                    message={showToastMsg.message}
                    type={showToastMsg.type}
                    onClose={handleCloseToast}/>
            }
        </div>
    )
}

export default Home;