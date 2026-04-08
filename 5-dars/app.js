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



contacts.unshift(
    {
        id: 'alisher@gmail.com',
        fName: 'Alisher',
        lName: 'Eshonqulov',
        phone: 998975771777,
        email: 'alisher@gmail.com',
        isFavorite: false,
        note: 'Gamer friend'
    }
)

console.log(contacts)
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
