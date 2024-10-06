const isEmailValid = (email) => {
    const regex = /^[a-zA-Z0-9]+@[A-Za-z0-9]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
}

const getInitials = (name) =>{
    if(!name) return "";

    const words = name.split(" ")
    let initials = "";
    for(let i=0; i<Math.min(words.length, 2); i++){
        initials+=words[i][0];
    }
    return initials.toUpperCase();
}
export {isEmailValid, getInitials}