const contacts = [
    {
        id: 'hojiakbar@gmail.com',
        fName: 'Hojiakbar',
        lName: 'Hamroqulov',
        phone: 998991991999,
        email: 'hojiakbar@gmail.com',
        isFavorite: true,
        note: "A9 gruhdagi eng yoqtirmagan do'stim."
    },
    {
        id: 'zohid@gmail.com',
        fName: 'Zohidjon',
        lName: "To'raqulov",
        phone: 998885181888,
        email: 'zohid@gmail.com',
        isFavorite: false,
        note: "A9 gruhdagi maqtonchoq do'stim."
    },
];



const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const body = document.body;

themeToggle.addEventListener('click', () => {
    if (body.dataset.theme === 'dark') {
        body.dataset.theme = 'light';
        themeLabel.textContent = 'Tun rejimi';
    } else {
        body.dataset.theme = 'dark';
        themeLabel.textContent = 'Kun rejimi';
    }

});


const form = document.getElementById('form');
const contactList = document.getElementById('contactList');


form.addEventListener('submit',  (e) => {
    e.preventDefault();

    const fName = document.getElementById('fName').value.trim();
    const lName = document.getElementById('lName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const note = document.getElementById('note').value.trim();

    if (!fName || !email) {
        alert("Ism va email majburiy!");
        return;
    }
    if (email.includes("@") === false || email.includes(".") === false) {
        alert("Iltimos, to'g'ri email manzilini kiriting!");
        return;
    }
    if (phone.length <= 8) {
        alert("Raqamni to'liq kiriting")
        return
    }
    if (window.width < 768) {
        themeLabel.textContent = '';
    }

    const newContact = {
        id: email,
        fName,
        lName,
        phone,
        email,
        isFavorite: false,
        note
    };

    contacts.unshift(newContact);
    contactList.innerHTML += (`
            <div class="contact-item">
                <img src="rasmlar/Frame 13.png" alt="" class="avatar-mini">
                <div class="info">
                    <div class="name">${newContact.fName} ${newContact.lName}</div>
                    <div class="phone">${newContact.phone}</div>
                </div>
                <div class="actions">
                    <img src="rasmlar/star empty.png" alt="" class="star-outline" id="star">
                    <img src="rasmlar/dotted.png" alt="" class="icon dots">
                </div>
            </div>
        `);

    form.reset();

});
console.log(contacts);

