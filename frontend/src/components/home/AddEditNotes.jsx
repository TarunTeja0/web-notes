import { useState } from "react"
import TagInput from "./TagInput"
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utilities/axiosInstance";

const AddEditNotes = ({noteData, type, onClose, getAllNotes, showToastMsgFunc}) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null);

    

    const addNewNote = async () => {
        try{

            const response = await axiosInstance.post('/add-note', {
                title,
                content,
                tags
            })

            if(response.data?.note){
                showToastMsgFunc("Note Added Successfully")
                getAllNotes()
                onClose()
            }
        } catch(error){
            if(error.response?.data?.message){
                setError(error.response.data.message);
            }
        }
    }

    const editNote = async () => {
        try{
            const response = await axiosInstance.put(`edit-note/${noteData._id}`,{
                title,
                content,
                tags
            })

            if(response.data?.note){
                onClose();
                showToastMsgFunc("Note Updated Successfully");
                getAllNotes();
            }

        }catch(error){
            if(error.response?.data?.message){
                setError(error.response.data.message)
            }
        }
    }

    const handleAddNote = () => {
        if(!title){
            setError("Please enter the title");
            return;
        }
        if(!content){
            setError("Please enter the content");
            return;
        }

        setError(null);

        if(type==='edit'){
            editNote();
        } else {
            addNewNote();
        }
    }

    

    return (
        <div className="relative">

            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
                onClick={onClose}>
                <MdClose className="text-xl text-slate-400 "/>
            </button>

            <div className="flex flex-col gap-2">
                <label className="inputLabel">TITLE</label>
                <input 
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go To Gym At 5AM"
                    value={title}
                    onChange={(e=>setTitle(e.target.value))}
                    />
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <label className="inputLabel">CONTENT</label>
                <textarea 
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={e=>setContent(e.target.value)}
                    />
            </div>

            <div className="mt-3">
                <label className="inputLabel">TAGS</label>
                <TagInput tags={tags} setTags={setTags}/>
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            <button className="btnPrimary font-medium mt-5 p-3 " onClick={handleAddNote}>
                {type==='add' ? "ADD" : "UPDATE"}
            </button>
        </div>
    )
}

export default AddEditNotes