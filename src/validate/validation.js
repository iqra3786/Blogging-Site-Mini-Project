
//----------------------------  email validation  ----------------------------------------------------


const isValidEmail = (value) => {
    if (typeof value === "undefined" || value === null) return false
    const regex= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(value)
}


//----------------------------  password validation  ----------------------------------------------------


const isValidPassword = (value) =>{
    if (typeof value === "undefined" || value === null) return false
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    return regex.test(value)
}

//----------------------------  name validation  ----------------------------------------------------


const isValidName= (value) =>{
    if (typeof value === "undefined" || value === null) return false
    const regex = /^[a-z ,.'-]+$/i
    return regex.test(value)
}


module.exports.isValidEmail = isValidEmail
module.exports.isValidPassword= isValidPassword
module.exports.isValidName= isValidName

