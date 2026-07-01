import { restaurants } from "./data.js";

const employees = [
  { name: "Kamol", salary: 3200000, department: "IT" },
  { name: "Shahlo", salary: 1800000, department: "HR" },
  { name: "Ravshan", salary: 2500000, department: "IT" },
  { name: "Dilnoza", salary: 1200000, department: "Moliya" },
  { name: "Otabek", salary: 4100000, department: "IT" },
  { name: "Feruza", salary: 1500000, department: "HR" },
  { name: "Jasur", salary: 2900000, department: "Moliya" },
  { name: "Munira", salary: 980000, department: "HR" },
];
let checkSalary = employees.forEach((employee) => {
  if (employee.salary > 2000000) {
    console.log(employee.name, "- Yuqori");
  } else {
    console.log(employee.name, "- Past");
  }
});
let inItEmployee = [];
let inIt = employees.map((employee) => {
  if (employee.department === "IT") {
    inItEmployee.push(employee.name);
  }
});
console.log(inItEmployee);

const books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert Martin",
    price: 45,
    genre: "Dasturlash",
    inStock: true,
  },
  {
    id: 2,
    title: "The Pragmatic Programmer",
    author: "Hunt & Thomas",
    price: 55,
    genre: "Dasturlash",
    inStock: true,
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    price: 20,
    genre: "Biznes",
    inStock: false,
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Y.N. Harari",
    price: 18,
    genre: "Tarix",
    inStock: true,
  },
  {
    id: 5,
    title: "Deep Work",
    author: "Cal Newport",
    price: 22,
    genre: "Biznes",
    inStock: true,
  },
  {
    id: 6,
    title: "The Lean Startup",
    author: "Eric Ries",
    price: 30,
    genre: "Biznes",
    inStock: false,
  },
  {
    id: 7,
    title: "Refactoring",
    author: "M. Fowler",
    price: 60,
    genre: "Dasturlash",
    inStock: true,
  },
  {
    id: 8,
    title: "Zero to One",
    author: "Peter Thiel",
    price: 25,
    genre: "Biznes",
    inStock: true,
  },
  {
    id: 9,
    title: "JavaScript: The Good Parts",
    author: "D. Crockford",
    price: 35,
    genre: "Dasturlash",
    inStock: true,
  },
  {
    id: 10,
    title: "Homo Deus",
    author: "Y.N. Harari",
    price: 19,
    genre: "Tarix",
    inStock: false,
  },
];

let higherPrice = books.filter((book) => book.price > 30);
console.log(higherPrice);
let upperCased = books.map((book) => {
  return book.title.toLocaleUpperCase();
});
console.log(upperCased);
let umumiyNarx = books.reduce((umumiy, book) => {
  return umumiy + book.price;
}, 0);
console.log(umumiyNarx);
let inStock = books.filter((book) => book.inStock === true);
console.log(inStock);
let inDasturlash = books.filter((book) => {
  return book.genre === "Dasturlash";
});
console.log(inDasturlash.length);
let wrapper = document.getElementById("wrapper");
restaurants.forEach((restaurant) => {
  let card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML += `
            <span>Yopiq</span>
            <img src="${restaurant.image}" alt="">
            <h1 class="location">${restaurant.name} - ${restaurant.city}</h1>
            <h2 class="narx">Narx: ${restaurant.price} - Rating:${restaurant.rating} ⭐</h2>
            <p class="description"><strong>Tavsif</strong>: ${restaurant.description}</p>

    `;
  wrapper.appendChild(card);
  let span = card.querySelector("span");
  if (restaurant.isOpen === true) {
    span.style.display = "none";
  }
  if (restaurant.price < 40000) {
    card.classList.add("green");
  }
  if (restaurant.rating > 4.7) {
    card.classList.add("ramka");
  }
});
let usersWrapper = document.getElementById("usersWrapper")
fetch("https://dummyjson.com/users")
  .then((response) => response.json())
  .then((data) => {
    let users = data.users.slice(0,10);
    console.log(data.users);
    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.classList.add("userCard");
      userCard.innerHTML = `
        <h1>${user.firstName} ${user.lastName}</h1>
        <h4>${user.email} ${user.phone}</h4>
        <h5>${user.age} ${user.address.city}</h5>
        <span class="span">Senior</span>
        `;
        let span = document.querySelector(".span")
        usersWrapper.appendChild(userCard)
        if (user.age>30) {
            span.style.display = "block"
        }
    });
  });
