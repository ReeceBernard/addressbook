const addBtn = document.querySelector('#add-contact-btn')

const form = document.getElementById('form')
const contact_name = document.getElementById('name')
const email = document.getElementById('email')
const address = document.getElementById('address')
const phone = document.getElementById('phone')

form.addEventListener('submit', e => {
    e.preventDefault()

    if (validateInputs(contact_name, email, address, phone)) {
        fetch('http://localhost:3000/addContact', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name: contact_name.value, email: email.value, address: address.value, phone: phone.value })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                contact_name.value = ""
                email.value = ""
                address.value = ""
                phone.value = ""
                window.location.href = 'file:///Users/reecebernard/Desktop/address_book/client/index.html'
            })
    }
})

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')

    errorDisplay.innerText = message
    inputControl.classList.add('error')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')

    errorDisplay.innerText = ''
    inputControl.classList.remove('error')
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

const isValidPhone = phone => {
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    return regex.test(String(phone))
}

function validateInputs(contact_name, email, address, phone) {
    const nameValue = contact_name.value.trim()
    const emailValue = email.value.trim()
    const addressValue = address.value.trim()
    const phoneValue = phone.value.trim()
    let valid_form = true

    if (nameValue === '') {
        setError(contact_name, 'Username is required')
        valid_form = false
    } else {
        setSuccess(contact_name)
    }

    if (emailValue === '') {
        setError(email, 'Email is required')
        valid_form = false
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address')
        valid_form = false
    } else {
        setSuccess(email);
    }

    if (addressValue === '') {
        setError(address, 'Address is required')
        valid_form = false
    } else if (addressValue.length < 10) {
        setError(address, 'Most likily not an address') // feeling lazy here...
        valid_form = false
    } else {
        setSuccess(address);
    }

    if (phoneValue === '') {
        setSuccess(phone)
    } else if (!isValidPhone(phoneValue)) {
        setError(phone, "Please enter a valid phone number")
        valid_form = false
    } else {
        setSuccess(phone)
    }
    return valid_form
};