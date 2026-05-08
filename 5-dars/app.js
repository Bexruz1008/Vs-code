let contacts = [
    {
        id: "alisher@gmail.com",
        fName: "Alisher",
        lName: "Eshonqulov",
        phone: "998975771777",
        email: "alisher@gmail.com",
        isFavorite: false,
        note: "Gamer friend"
    },
    {
        id: "hojiakbar@gmail.com",
        fName: "Hojiakbar",
        lName: "Hamroqulov",
        phone: "998991991999",
        email: "hojiakbar@gmail.com",
        isFavorite: true,
        note: "A9 gruhdagi eng yoqtirmagan do'stim."
    },
    {
        id: "zohid@gmail.com",
        fName: "Zohidjon",
        lName: "To'raqulov",
        phone: "998885181888",
        email: "zohid@gmail.com",
        isFavorite: false,
        note: "A9 gruhdagi maqtonchoq do'stim."
    }
];

const contactsBox = document.querySelector(".contacts");
const fName = document.getElementById("fName");
const lName = document.getElementById("lName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const note = document.getElementById("note");
const addBtn = document.querySelector(".add-btn");
const searchInput = document.getElementById("searchInput");
const showAllButton = document.getElementById("showAllButton");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const body = document.body;

function showContacts(arr) {
    contactsBox.innerHTML = "";


    arr.forEach((contact) => {
        contactsBox.innerHTML += `
            <div class="contact-item" title="${contact.note}">
                <img src="rasmlar/Frame 13.png" alt="" class="avatar-mini">
                <div class="info">
                    <p class="name">${contact.fName} ${contact.lName}</p>
                    <p class="phone">+${contact.phone} | ${contact.email}</p>
                </div>
                <div class="actions">
                    <img src="${contact.isFavorite ? "rasmlar/star full.png" : "rasmlar/star empty.png"}" alt="" class="${contact.isFavorite ? "star" : "star-outline"}">
                    <img src="rasmlar/dotted.png" alt="" class="dots">
                </div>
            </div>
        `;
    });
}

addBtn.onclick = function () {
    let firstName = fName.value.trim();
    let lastName = lName.value.trim();
    let phoneNumber = phone.value.trim();
    let emailValue = email.value.trim();
    let noteValue = note.value.trim();

    if (firstName === "" || lastName === "" || phoneNumber === "" || emailValue === "") {
        alert("Inputlarni to'ldiring");
        return;
    }


    let newContact = {
        id: emailValue,
        fName: firstName,
        lName: lastName,
        phone: phoneNumber,
        email: emailValue,
        isFavorite: false,
        note: noteValue
    };

    contacts.unshift(newContact);
    showContacts(contacts);

    fName.value = "";
    lName.value = "";
    phone.value = "";
    email.value = "";
    note.value = "";
};

searchInput.oninput = function () {
    let searchValue = searchInput.value.toLowerCase().trim();

    let filteredContacts = contacts.filter((contact) => {
        return (
            contact.fName.toLowerCase().includes(searchValue),
            contact.lName.toLowerCase().includes(searchValue) ,
            contact.email.toLowerCase().includes(searchValue)
        );
    });

    showContacts(filteredContacts);
};

showAllButton.onclick = function () {
    searchInput.value = "";
    showContacts(contacts);
};

themeToggle.onclick = function () {
    if (body.dataset.theme === "dark") {
        body.dataset.theme = "light";
        themeLabel.textContent = "Tun rejimi";
    } else {
        body.dataset.theme = "dark";
        themeLabel.textContent = "Kun rejimi";
    }
};

showContacts(contacts);
