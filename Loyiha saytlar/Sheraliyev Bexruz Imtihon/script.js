import { trips } from "./data.js";
const students = [
  { name: "Ali", score: 85 },
  { name: "Laylo", score: 55 },
  { name: "Javohir", score: 72 },
  { name: "Madina", score: 40 },
  { name: "Bobur", score: 91 },
  { name: "Zarina", score: 45 },
  { name: "Sardor", score: 78 },
  { name: "Nilufar", score: 62 },
];
let passedStudents = [];
let checkResult = students.forEach((student) => {
  if (student.score > 60) {
    console.log(`${student.name} - o'tdi`);
    passedStudents.push(student);
  } else {
    console.log(`${student.name} - yiqildi`);
  }
});
console.log(passedStudents);

const orders = [
  {
    id: 1,
    product: "MacBook Pro",
    price: 2500,
    category: "Laptop",
    brand: "Apple",
    inStock: true,
  },
  {
    id: 2,
    product: "iPhone 15 Pro",
    price: 1200,
    category: "Telefon",
    brand: "Apple",
    inStock: true,
  },
  {
    id: 3,
    product: "Samsung Galaxy S24",
    price: 900,
    category: "Telefon",
    brand: "Samsung",
    inStock: false,
  },
  {
    id: 4,
    product: "Sony WH-1000XM5",
    price: 400,
    category: "Quloqchin",
    brand: "Sony",
    inStock: true,
  },
  {
    id: 5,
    product: "Dell XPS 15",
    price: 1800,
    category: "Laptop",
    brand: "Dell",
    inStock: true,
  },
  {
    id: 6,
    product: "AirPods Pro",
    price: 250,
    category: "Quloqchin",
    brand: "Apple",
    inStock: true,
  },
  {
    id: 7,
    product: "Playstation 5",
    price: 500,
    category: "Gaming",
    brand: "Sony",
    inStock: false,
  },
  {
    id: 8,
    product: "iPad Air",
    price: 650,
    category: "Planshet",
    brand: "Apple",
    inStock: true,
  },
  {
    id: 9,
    product: "Nintendo Switch",
    price: 300,
    category: "Gaming",
    brand: "Nintendo",
    inStock: true,
  },
  {
    id: 10,
    product: "Samsung Monitor",
    price: 450,
    category: "Monitor",
    brand: "Samsung",
    inStock: true,
  },
];
let higherPrice = orders.filter((product) => {
  return product.price > 500;
});
console.log(higherPrice);
let upperCasedProducts = orders.map((products) => {
  return products.product.toUpperCase();
});
console.log(upperCasedProducts);

let inStock = orders.filter((product) => {
  return product.inStock === true;
});
console.log(inStock);

let apple = orders.filter((product) => {
  return product.brand === "Apple";
});
console.log(apple);

let umumiyNarx = orders.reduce((umumiy, product) => {
  return umumiy + product.price;
}, 0);
console.log(umumiyNarx);
let wrapper = document.querySelector(".trips_wrapper");
trips.forEach((trip) => {
  let card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML += `
            <img src="${trip.image}" alt="">
            <h1 id="location">${trip.city} - ${trip.country}</h1>
            <h2 id="duration">Narx:${trip.price} - Muddat:${trip.duration}</h2>
            <p id="rating"">Reyting: ${trip.rating}⭐</p>
            <p id="description"><strong>Tavsif</strong>: ${trip.description}</p>
    `;
  wrapper.appendChild(card);
  if (trip.price > 1000) {
    card.style.backgroundColor = "green";
  } else {
    card.style.backgroundColor = "";
  }
  if (trip.rating > 4.7) {
    card.style.border = "5px solid gold";
  } else {
    card.style.border = "";
  }
});
// 1. Ma'lumotni fetch bilan olib keling va console.log qiling.
// 2. HTMLda har bir mahsulot uchun kartochka yarating:
//    - Mahsulot rasmi (`thumbnail`)
//    - Nomi va tavsifi (`title`, `description`)
//    - Narxi va chegirma (`price`, `discountPercentage`)
//    - Rating va brend (`rating`, `brand`)
// 3. Faqat birinchi 12 ta mahsulotni ko'rsating.
// 4. "Ko'proq yuklash" tugmasi bilan qolgan mahsulotlarni ham chiqarish imkonini yarating.
// 5. Narxi 50$ dan yuqori bo'lgan mahsulotlar uchun "Premium" belgisini qo'shing.
fetch("https://dummyjson.com/products")
  .then((response) => response.json())
  .then((data) => {
    console.log(data.products);
    const products = data.products.slice(0, 12);
    const wrapper = document.querySelector("#apiResponse");
    products.forEach((product) => {
      const item = document.createElement("div");
      item.classList.add("card");
      item.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h1>${product.title}</h1>
        <p>${product.description}</p>
        <p>Narx: $${product.price} - Chegirma: ${product.discountPercentage}%</p>
        <p>Reyting: ${product.rating}⭐ - Brend: ${product.brand}</p>
      `;
      wrapper.appendChild(item);
    });
  });
