
const isValidate = async (username, email, password, retypePassword) => { 
    
    const regexName = /^[a-z][A-Z]+$/;
    const regexEmail = /^[a-zA-Z0-9.-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const regexPassword = /^(?=.*\d)(?=.*[!@#$%^&*()_=])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!username || !email || !password) {
        return window.alert("Please Fill all Required Fields")
    }
    else if (regexName.test(username)) {
        window.alert("Username must contain only alphabets");
    }

    else if (!regexEmail.test(email)) {
        window.alert("Invalid Email Address");
    }
    
    else if (!regexPassword.test(password)) {
        return window.alert(`Password Must be at least 8 characters long,\nContain at least one digit,\na special character`);
    }
}

module.exports = isValidate;