// Load the existing contacts into the frontend
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/getContacts')
        .then(response => response.json())
        .then(data => loadContantInfo(data['data']))
})

// Listen to the delete and edit buttons
document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        editRowByID(event.target.dataset.id);
    }
})


const updateBtn = document.querySelector('#update-contact-btn')
const form = document.getElementById('form')
var current_page = 1
var records_per_page = 10

// delete contact from db
function deleteRowById(id) {
    fetch('http://localhost:3000/deleteContact/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch('http://localhost:3000/getContacts')
                    .then(response => response.json())
                    .then(data => loadContantInfo(data['data']))
            }
        })
}

// edit the contact info
function editRowByID(id) {
    const updateSection = document.querySelector('#update-row')
    updateSection.hidden = false
    document.querySelector('#update-contact-btn').dataset.id = id
}

// logic to send patch request to update contacts
form.addEventListener('submit', e => {
    e.preventDefault()
    const updateName = document.querySelector('#update-name')
    const updateEmail = document.querySelector('#update-email')
    const updateAddress = document.querySelector('#update-address')
    const updatePhone = document.querySelector('#update-phone')
    if (validateInputs(updateName, updateEmail, updateAddress, updatePhone)) {
        fetch('http://localhost:3000/updateContact', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: updateBtn.dataset.id,
                name: updateName.value,
                email: updateEmail.value,
                address: updateAddress.value,
                phone: updatePhone.value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetch('http://localhost:3000/getContacts/?page=' + current_page)
                        .then(response => response.json())
                        .then(data => {
                            updateName.value = ""
                            updateEmail.value = ""
                            updateAddress.value = ""
                            updatePhone.value = ""
                            loadContantInfo(data['data'])
                        })
                }
            })
        const updateSection = document.querySelector('#update-row')
        updateSection.hidden = true
    }
})

// The logic to load the contacts from the database into the front end
function loadContantInfo(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({ id, name, email, address, phone }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${email}</td>`;
        tableHtml += `<td>${address}</td>`;
        tableHtml += `<td>${phone}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

// form validator
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')

    errorDisplay.innerText = message
    inputControl.classList.add('error')
}

// form validator
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error')

    errorDisplay.innerText = ''
    inputControl.classList.remove('error')
};

// form validator
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

// form validator
const isValidPhone = phone => {
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    return regex.test(String(phone))
}

// form validation, if this returns false a field is not valid
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

function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage() {
    current_page++
    changePage(current_page)
}

function changePage(page) {
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    // Validate page
    if (page < 1) page = 1;
    // if (page > numPages()) page = numPages();

    fetch('http://localhost:3000/getContacts/?page=' + current_page)
        .then(response => response.json())
        .then(data => loadContantInfo(data['data']))

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    // if (page == numPages()) {
    //     btn_next.style.visibility = "visible";
    // } else {
    //     btn_next.style.visibility = "visible";
    // }

}

// async function numPages() {
//     const response = await fetch('http://localhost:3000/getAllContacts')
//     const myJson = await response.json()
//     console.log(Math.ceil(myJson['data'].length / records_per_page))
//     return Math.ceil(myJson['data'].length / records_per_page) + 10
// }