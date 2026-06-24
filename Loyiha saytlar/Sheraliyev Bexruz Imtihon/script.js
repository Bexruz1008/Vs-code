import {tips} from 
// ---

// ## 📝 JavaScript Imtihon (2 soat)

// ---

// ### 1️⃣ Challenge: Shart operatorlari (if/else), Array, Function, Object

// Vazifa:
// Talabalarga quyidagi ma’lumotlar bazasi beriladi:

// const students = [
//   { name: "Ali", score: 85 },
//   { name: "Laylo", score: 55 },
//   { name: "Javohir", score: 72 },
//   { name: "Madina", score: 40 },
//   { name: "Bobur", score: 91 },
//   { name: "Zarina", score: 45 },
//   { name: "Sardor", score: 78 },
//   { name: "Nilufar", score: 62 }
// ];

// Topshiriq:

// 1. checkResult nomli funksiya yarating. U o‘quvchining score qiymatiga qarab:

//    * 60 va undan yuqori → "O‘tdi"
//    * 60 dan past → "Yiqildi"
//      deb qaytarsin.
// 2. Har bir o‘quvchi uchun natijani konsolda ko‘rsating: "Ali – O‘tdi"
// 3. Yangi massiv yarating va faqat o‘tgan o‘quvchilarni saqlang.

// ⏱️ Vaqt: \~20 daqiqa

// ---

// ### 2️⃣ Challenge: Array Methods (map, filter, reduce) bilan ishlash

// Vazifa:
// Quyidagi buyurtmalar ro‘yxati berilgan:

// const orders = [
//   { id: 1, product: "MacBook Pro", price: 2500, category: "Laptop", brand: "Apple", inStock: true },
//   { id: 2, product: "iPhone 15 Pro", price: 1200, category: "Telefon", brand: "Apple", inStock: true },
//   { id: 3, product: "Samsung Galaxy S24", price: 900, category: "Telefon", brand: "Samsung", inStock: false },
//   { id: 4, product: "Sony WH-1000XM5", price: 400, category: "Quloqchin", brand: "Sony", inStock: true },
//   { id: 5, product: "Dell XPS 15", price: 1800, category: "Laptop", brand: "Dell", inStock: true },
//   { id: 6, product: "AirPods Pro", price: 250, category: "Quloqchin", brand: "Apple", inStock: true },
//   { id: 7, product: "Playstation 5", price: 500, category: "Gaming", brand: "Sony", inStock: false },
//   { id: 8, product: "iPad Air", price: 650, category: "Planshet", brand: "Apple", inStock: true },
//   { id: 9, product: "Nintendo Switch", price: 300, category: "Gaming", brand: "Nintendo", inStock: true },
//   { id: 10, product: "Samsung Monitor", price: 450, category: "Monitor", brand: "Samsung", inStock: true }
// ];

// Topshiriq:

// 1. filter yordamida 500 dan qimmat mahsulotlarni toping.
// 2. map bilan barcha mahsulot nomlarini katta harflarda qaytaring.
// 3. reduce yordamida umumiy narxni hisoblang.
// 4. filter bilan faqat stokda bor (`inStock: true`) mahsulotlarni ajrating.
// 5. Apple brendidagi mahsulotlar sonini toping.
// 6. Natijalarni konsolda ko'rsating.

// 📌 Bonus: Eng qimmat va eng arzon mahsulotni console.log qiling.

// ⏱️ Vaqt: \~20 daqiqa

// ---

// ### 3️⃣ DOM Challenge: Array of Objects bilan ma’lumotni ekranga chiqarish

// *(mini loyihacha – import/export mavzusini ham qamrab oladi)*

// Vazifa:
// Quyidagi sayohat kartalari ma’lumotlari beriladi (alohida data.js faylida):
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

let umumiyNarx = orders.reduce(function (yigindi, qiymat) {
  return yigindi + qiymat;
});
console.log(umumiyNarx);
