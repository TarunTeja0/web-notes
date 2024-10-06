import { getInitials } from "../utilities/helper";

const ProfileInfo = ({userInfo, onLogout}) => {
    return (
        <div className="flex items-center gap-3 w-1/4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
                {getInitials(userInfo?.fullName)}
            </div>
            <div className="flex gap-8">
                <p className="text-sm text-start font-medium ">{userInfo?.fullName}</p>
                <button className="btnPrimary" onClick={onLogout}>Logout</button>
            </div>
        </div>
    )
}

export default ProfileInfo;