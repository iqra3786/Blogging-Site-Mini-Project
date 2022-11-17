const isValidEmail = (value) => {
    if (typeof value === "undefined" || value === null) return false
    const re= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(value)
}

const isValidPassword = (value) =>{
    if (typeof value === "undefined" || value === null) return false
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    return re.test(value)
}

const isValidName= (value) =>{
    if (typeof value === "undefined" || value === null) return false
    const re = /^[a-z ,.'-]+$/i
    return re.test(value)
}


module.exports.isValidEmail = isValidEmail
module.exports.isValidPassword= isValidPassword
module.exports.isValidName= isValidName

