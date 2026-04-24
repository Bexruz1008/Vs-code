// function changeText() {
//     const paragraph = document.getElementById("matn1");
//     paragraph.textContent = "Yangi matn";
// }
// function changeColor() {
//     const sarlavha = document.getElementById("sarlavha1");
//     sarlavha.style.color = "red";
// }
// function showName() {
//     const input = document.getElementById("input1");
//     const result = document.getElementById("ism");
//     result.textContent = input.value;
// }

// function addItem() {
//     const newItem = document.createElement("li");
//     newItem.textContent = "Yangi element";
//     document.getElementById("itemList").appendChild(newItem);
// }


// function hideText() {
//     document.getElementById("Text").style.display = "none";
// }

// function showText() {
//     document.getElementById("Text").style.display = "block";
// }


// let numbers = [2, 5, 6, 7, 2, 3, 8];
// numbers.forEach((kvadrat) => {
//     console.log(kvadrat * kvadrat);
// }
// )
// const students = [
//     { name: "Ali", age: 19, score: 82, active: true },
//     { name: "Sara", age: 20, score: 95, active: false },
//     { name: "Tesha", age: 18, score: 76, active: true },
//     { name: "Bolta", age: 17, score: 88, active: true },
//     { name: "Saidsox", age: 17, score: 98, active: true },
// ];

// let yangiIsmlar = students.map((ism) => {
//     return ism.name += "xon"
// })
// console.log(yangiIsmlar);


// let yangiYosh = students.map((ism) => {
//     return ism.age += 1
// })
// console.log(yangiYosh);
// console.log(students);


// Assignment
// const products = [
//     { name: "Phone", price: 500, inStock: true },
//     { name: "Laptop", price: 1200, inStock: false },
//     { name: "Mouse", price: 25, inStock: true }
// ];


// // Barcha mahsulotlar nomini chiqar
// let mahsulotNomi = products.map(mahsulot => mahsulot.name)
// console.log(mahsulotNomi);


// // Narxlar massivini yarat
// let narxlarArr = products.map(mahsulot => mahsulot.price)
// console.log(narxlarArr);


// // Faqat mavjud mahsulotlarni olish
// let sotuvdaBor = products.filter(sotuvda => {
//     return sotuvda.inStock === true
// })
// console.log(sotuvdaBor);


// // Yangi mahsulot qo'sh
// products.push({ name: "Display", price: 1000, inStock: true });
// console.log(products);


// // Sichqoncha narxini 30 ga o'zgartir.
// let sichqoncha =  products[2].price += 5;
// console.log(products);




const names1 = ["Ali", "Vali", "Sardor", "Malika"];

names1.forEach((name) => {
    console.log(name);
});



const numbers = [1, 2, 3, 4, 5];

numbers.forEach((number) => {
    console.log(number * 2);
});

const products = [
    { name: "Non", price: 3000 },
    { name: "Sut", price: 12000 },
    { name: "Olma", price: 8000 }
];

products.forEach((product) => {
    console.log(product.name + " - " + product.price + " so'm");
});


const students2 = [
    { name: "Ali", passed: true },
    { name: "Madina", passed: false },
    { name: "Jasur", passed: true }
];

students2.forEach((student) => {
    if (student.passed) {
        console.log(student.name + " imtihondan o'tdi");
    } else {
        console.log(student.name + " imtihondan yiqildi");
    }
});


const colors = ["red", "blue", "green", "black"];

colors.forEach((color, index) => {
    console.log(index + " - " + color);
});




const numbers2 = [2, 4, 6, 8];
const doubleNumbers = numbers2.map((number) => {
    return number * 2;
});
console.log(doubleNumbers);


const names = ["ali", "vali", "sami"];
const upperNames = names.map((name) => {
    return name.toUpperCase();
});
console.log(upperNames);



const students = [
    { name: "Ali", age: 20 },
    { name: "Malika", age: 21 },
    { name: "Sardor", age: 19 }
];

const studentNames = students.map((student) => {
    return student.name;
});

console.log(studentNames);



const prices = [10000, 25000, 50000];
const pricesTax = prices.map((price) => {
    return price + price * 0.12;
});

console.log(pricesTax);



const users = [
    { name: "Ali", age: 20 },
    { name: "Madina", age: 22 },
    { name: "Javohir", age: 19 }
];

const userInfo = users.map((user) => {
    return user.name + " (" + user.age + " yosh)";
});
  

console.log(userInfo);



const numbers3 = [1, 2, 3, 4, 5, 6, 7, 8];
const evenNumbers = numbers3.filter((number) => {
    return number % 2 === 0;
});

console.log(evenNumbers);



const names2 = ["Ali", "Madina", "Zafar", "Bohron", "Lola"];
const longNames = names2.filter((name) => {
    return name.length > 4;
});

console.log(longNames);



const products2 = [
    { name: "Non", price: 3000 },
    { name: "Sut", price: 12000 },
    { name: "Go'sht", price: 90000 }
];

const expensiveProducts = products2.filter((product) => {
    return product.price > 10000;
});

console.log(expensiveProducts);



const users2 = [
    { name: "Ali", active: true },
    { name: "Madina", active: false },
    { name: "Sardor", active: true }
];

const activeUsers = users2.filter((user) => {
    return user.active === true;
});

console.log(activeUsers);



const students3 = [
    { name: "Ali", score: 75 },
    { name: "Malika", score: 92 },
    { name: "Jasur", score: 84 }
];

const goodStudents = students3.filter((student) => {
    return student.score > 80;
});

console.log(goodStudents);

