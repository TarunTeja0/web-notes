import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md"

const NoteCard = ({title, date, content, tags, isPinned, onEdit, onDelete, onPinNote}) => {

    function formatDateToISTString(date) {
        // Convert MongoDB date to IST using toLocaleString with 'Asia/Kolkata' timezone
        const options = { 
          timeZone: 'Asia/Kolkata', 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        };
      
        const formattedDate = new Date(date).toLocaleString('en-IN', options);
        
        return formattedDate;
      }

    return (
        <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-sm font-medium">{title}</h6>
                    <span className="text-xs text-slate-500">{formatDateToISTString(date)}</span>
                </div>

                <MdOutlinePushPin className={`iconBtn ${isPinned? "text-primary" : "text-slate-300" }`} onClick={onPinNote}/>
            </div>
            <p className="text-xs text-sltae-600 mt-2">{content?.slice(0,60)}</p>

            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500">{tags.map(tag=> `#${tag} `)}</div>

                <div className="flex items-center gap-2">
                    <MdCreate 
                        className="iconBtn text-slate-300 hover:text-green-600"
                        onClick={onEdit}
                        />

                    <MdDelete 
                    className="iconBtn text-slate-300 hover:text-red-500"
                    onClick={onDelete}/>
                </div>
            </div>
        </div>
    )
}
export default NoteCard