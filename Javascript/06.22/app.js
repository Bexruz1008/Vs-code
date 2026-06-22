import { users, products, tasks } from "./data.js";

console.log(products);
// ============================================================
// 1. ARROW FUNCTIONS (O'Q STRELKALI FUNKSIYALAR)
// ============================================================
// Funksiya yozishning qisqaroq usuli.
// Agar funksiya tanasi bitta ifodadan iborat bo'lsa,
// figurali qavslar va `return` kalit so'zini tashlab ketish mumkin
// (yashirin return).
//
// Oddiy funksiya:
//   function double(n) { return n * 2; }
// function double(n) {
//     return n * 2;
// }
// function add(a, b) {
//     return a + b;
// }

// const add = (a, b) => a + b;
//
// Strelkali funksiya:
//   const double = (n) => n * 2;
// const double = (a) => a * 2;
//
// TOPSHIRIQLAR:
//
// 1. `isActive` nomli strelkali funksiya yozing — user obyektini qabul qilib,
//    foydalanuvchi aktiv bo'lsa true qaytarsin.

const isActive = (userr) => {
  // if (user.isActive === true) {
  //     return true
  // } else {
  //     return false
  // }
  return userr.isActive === true ? "online" : "offline";
};

// console.log(isActive(users[0]))
// console.log(isActive(
//     {
//     id: 4,
//     name: "David Kim",
//     email: "david@example.com",
//     age: 40,
//     role: "editor",
//     isActive: true,
//     joinedAt: "2020-11-05",
//     address: { city: "Toronto", country: "Canada" },
//     scores: [60, 72, 68, 77],
//   }
// ))

//
// 2. `getDiscountedPrice` nomli strelkali funksiya yozing — product obyektini qabul qilib, chegirma foizini hisobga olgan holda narxni qaytarsin.
//

const getDiscountedPrice = (product) => {
  return product.price - (product.price * product.discount) / 100;
};
console.log(getDiscountedPrice(products[0]));

// 3. `isHighPriority` nomli strelkali funksiya yozing — task obyektini qabul qilib, vazifaning ustuvorligi "high" bo'lsa true qaytarsin.
const isHighPriority = (task) => {
  return task.priority === "high" ? true : false;
};
console.log(isHighPriority(tasks[1]));
// ============================================================
// 2. DESTRUCTURING (OBYEKT VA MASSIVLARNI YOYISH)
// ============================================================
// Obyekt yoki massivdan qiymatlarni alohida o'zgaruvchilarga chiqarib olish,
// har birini qo'lda yozish o'rniga.
//
// Obyektdan yoyish:
//   const { name, age } = user;
//
// Massivdan yoyish:
//   const [first, second] = scores;
//
// Nom o'zgartirish bilan:
//   const { name: fullName } = user;
//
// Standart qiymat bilan:
//   const { role = "viewer" } = user;
//

// console.log(users[1].name)
// console.log(users[1].email)

// const { name, email } = users[1]

// let foreignCars = ['BMW', 'BYD', 'Ferrari'];
// const [_, car1, car2] = foreignCars;

// console.log(car1, car2)

// TOPSHIRIQLAR:
//
// 1. `users` massividan birinchi foydalanuvchini yoyib, `name`, `email` va
//    ichki address obyektidan `city` ni — hammasi bir qatorda chiqarib oling.
// const { name, email, address } = users[1]
// const { city } = address;
// console.log(name)
// console.log(email)
// console.log(city)
//
// 2. Birinchi foydalanuvchining `scores` massividan birinchi va oxirgi
//    natijani yoyib oling. (Maslahat: o'rtadagi qiymatlarni rest orqali oling)
const [firstScore, ...restScores] = users[0].scores;
const lastScore = restScores.pop();
console.log(firstScore, lastScore);
//
// 3. `getUserInfo` funksiyasini yozing — parametrning o'zida destructuring ishlatib, user dan `name`, `role` va `isActive` ni chiqarib, console ga chiqarsin.
const getUserInfo = ({ name, role, isActive }) => {
  console.log(`Name: ${name}, Role: ${role}, Active: ${isActive}`);
};
getUserInfo(users[0]);
// ============================================================
// 3. SPREAD / REST OPERATORI (`...`)
// ============================================================
// Spread (`...`) massiv yoki obyektni alohida elementlarga yoyadi.
// Rest (`...`) bir nechta elementni massivga yig'adi.

//
// Massivni yoyish:
//   const combined = [...arr1, ...arr2];
//
// Obyektni nusxalash yoki birlashtirish:
//   const updated = { ...user, isActive: false };
//
// Funksiya parametrlarida rest:
//   const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
//

// let foreignCars = ['BMW', 'BYD', 'Ferrari'];
// let uzbCars = ['Damas', 'Nexia 2', 'Matiz'];

// let aralash = [...foreignCars, ...uzbCars]
// console.log(aralash)
// TOPSHIRIQLAR:
//
// 1. products[0] asosida yangi product obyekti yarating, lekin narxini
//    79.99 ga o'zgartiring — asl massivni o'zgartirmagan holda.
//

let userCopy = {
  ...products[0],
  price: 79.99,
};

console.log(userCopy);
// 2. `mergeUsers` funksiyasini yozing — ikki user obyektini qabul qilib,
//    ularni birlashtirgan yangi obyekt qaytarsin (ikkinchi obyekt qiymatlari ustun kelsin).
//
const mergeUsers = (user1, user2) => {
  return { ...user1, ...user2 };
};

const mergedUser = mergeUsers(users[0], users[1]);
console.log(mergedUser);

// 3. `addTask` funksiyasini yozing — `tasks` massivi va yangi task obyektini
//    qabul qilib, vazifani oxiriga qo'shgan yangi massiv qaytarsin —
//    asl massivni o'zgartirmagan holda.
let newTask = {
  id: 15,
  title: "Update documentation",
  assignedTo: 3,
  priority: "low",
  completed: false,
  dueDate: "2024-04-10",
  tags: ["docs"],
};
let addTask = (tasks, newTask) => {
  return [...tasks, newTask];
};
console.log(addTask(tasks, newTask));

// ============================================================
// 4. TEMPLATE LITERALS (SHABLON SATRLAR)
// ============================================================
// Orqa tirnoq (backtick) yordamida ichiga ifodalar joylashtirish mumkin bo'lgan
// satrlar. Ko'p qatorli satrlar va `${}` ichida har qanday JS ifodani qo'llash mumkin.
//
// Misol:
// let user = users[0];
//   const msg = `Salom, ${user.name}! Yoshingiz: ${user.age}.`;
//   console.log(msg)
//
// TOPSHIRIQLAR:
//
// 1. `greetUser` funksiyasini yozing — user ni qabul qilib quyidagi satrni qaytarsin:
//    "Salom, Alice Johnson! Siz 2022-03-15 da qo'shildingiz."
//
// const greetUser = (user) => {
//     console.log(`Salom, ${user.name}! Siz ${user.joinedAt} da qo'shildingiz.`)
// }

// greetUser(users[3])
// 2. `productLabel` funksiyasini yozing — product ni qabul qilib qaytarsin:
let productLabel = (product) => {
  return `${product.name} - $${product.price} (Reyting: ${product.rating}⭐)`;
};
console.log(productLabel(products[0]));
//    "Wireless Headphones - $89.99 (Reyting: 4.5⭐)"
//
// 3. `taskSummary` funksiyasini yozing — task ni qabul qilib qaytarsin:
//    "[HIGH] Fix login bug — Muddat: 2024-03-01 — ✅ Bajarildi"
//    yoki "❌ Bajarilmadi" — vazifaning completed holatiga qarab.
let taskSummary = (task) => {
  const completed = task.completed ? "✅ Bajarildi" : "❌ Bajarilmadi";
  return `[${task.priority}] ${task.title} — Muddat: ${task.dueDate} — ${completed}`;
};
console.log(taskSummary(tasks[0]));
// ============================================================
// 5. OPTIONAL CHAINING (`?.`)
// ============================================================
// Ichma-ich joylashgan xususiyatlarga xavfsiz murojaat qilish usuli.
// Oraliq qiymat null yoki undefined bo'lsa xato chiqarmaydi —
// buning o'rniga `undefined` qaytaradi.
//
// Optional chaining siz (xato chiqarishi mumkin):
//   user.address.city  // address undefined bo'lsa ishlamaydi
// console.log(users[0].address.street)
//
// Optional chaining bilan (xavfsiz):
//   console.log(user?.address?.city ) // address yo'q bo'lsa undefined qaytaradi
//
// Metodlar va massivlar bilan ham ishlaydi:
//   user.getFullName?.()
//   arr?.[0]
//
// TOPSHIRIQLAR:
//
// 1. `getCity` funksiyasini yozing — user ni qabul qilib, shahri mavjud bo'lsa
//    uni qaytarsin, aks holda "Shahar noma'lum" qaytarsin.
//
// 2. Quyidagi obyekt bor:
//    const session = { user: null };
//    optional chaining yordamida session.user.email ga xavfsiz murojaat qiling
//    va natijani console ga chiqaring (xato emas, undefined bo'lishi kerak).
//
// 3. `getFirstTag` funksiyasini yozing — product ni qabul qilib, birinchi
//    tegni xavfsiz qaytarsin, tags massivi yo'q yoki bo'm-bo'sh bo'lsa
//    "teg yo'q" qaytarsin.

// ============================================================
// 6. NULLISH COALESCING (`??`)
// ============================================================
// Chap tarafdagi qiymat faqat `null` yoki `undefined` bo'lganda
// o'ng tarafdagi qiymatni qaytaradi.
// 0 yoki "" kabi boshqa falsy qiymatlar uchun ishlamaydi.
//
// `||` — har qanday falsy qiymatda (0, "", false, null, undefined) ishga tushadi
// `??` — faqat null yoki undefined da ishga tushadi
//
// Misol:
// let product = products[0]
//   const discount = product.discount ?? 'No discount';
//   const discount = product.discount || 'No discount';

//   console.log(discount)
//   // discount 0 bo'lsa, ?? uni saqlab qoladi. || esa o'ng tomonga o'tib ketadi!

// let ism = prompt('Ismingiz') || 'Mehmon';
// console.log(ism)
//
// TOPSHIRIQLAR:
//
// 1. `getDiscount` funksiyasini yozing — product ni qabul qilib chegirmani
//    qaytarsin, null/undefined bo'lsa 0 qaytarsin.
//    discount: 0 bo'lgan product bilan sinab ko'ring — 0 qaytishi kerak, boshqa qiymat emas.
//
// 2. `getRole` funksiyasini yozing — user ni qabul qilib, role mavjud bo'lsa
//    uni qaytarsin, null yoki undefined bo'lsa "mehmon" qaytarsin.

//
// 3. `displayStock` funksiyasini yozing — qaytarsin:
//    `product.stock ?? "Ombor ma'lumoti mavjud emas"`.
//    Bu yerda `??` o'rniga `||` ishlatish nima uchun noto'g'ri bo'lardi?

// ============================================================
// 7. QISQA TUTATISH (SHORT-CIRCUIT) (`&&` / `||`)
// ============================================================
// `&&` — birinchi falsy qiymatni qaytaradi, hammasi truthy bo'lsa oxirgi qiymatni qaytaradi.
// `||` — birinchi truthy qiymatni qaytaradi, hammasi falsy bo'lsa oxirgi qiymatni qaytaradi.
// if-statement yozmay shartli mantiq yozish uchun ishlatiladi.
//
// Misollar:
//   user.isActive && sendEmail(user)  // faqat aktiv bo'lsa bajariladi
//   user.role || "mehmon"

// user.isActive && console.log('Siz online siz.') || console.log('Siz offline')
// if(user.isActive) {
//     console.log('Siz online siz.')
// }
// role falsy bo'lsa "mehmon" qaytaradi
//
// TOPSHIRIQLAR:
//
// 1. `&&` yordamida — foydalanuvchi aktiv bo'lsagina uning emailini
//    console ga chiqaradigan bir qatorli kod yozing.
//    Aktiv bo'lmagan foydalanuvchi bilan ham sinab ko'ring.
//
// 2. `getLabel` funksiyasini yozing — product ni qabul qilib,
//    omborda qolmagan bo'lsa `"TUGAGAN"`, aks holda mahsulot nomini qaytarsin.
//    Faqat short-circuit yoki ternary ishlating — if-statement yo'q.
//
// 3. `taskStatus` funksiyasini yozing — qaytarsin:
//    task.completed && "Bajarildi" || "Bajarilmadi"
//    So'ngra tushuntiring: bu usul nima uchun xavfli bo'lishi mumkin
//    va qachon `??` yoki ternary ishlatish to'g'riroq bo'ladi.

// ============================================================
// 8. MASSIV METODLARI — MAP
// ============================================================
// `map` — massivning har bir elementini o'zgartirib, yangi massiv qaytaradi.
// Asl massivni o'zgartirmaydi.
//
// Misol:
//   const names = users.map((user) => user.name);
//
// TOPSHIRIQLAR:
//
// 1. `users` massividan faqat `name` va `email` larni o'z ichiga olgan
//    yangi obyektlar massivini qaytaring.
//
// 2. `products` massividagi har bir mahsulotning chegirmali narxini
//    hisoblab, { name, originalPrice, finalPrice } ko'rinishida massiv qaytaring.
//
// 3. `tasks` massividagi har bir vazifani quyidagi formatga o'zgartiring:
//    { id, title, status } — status "Bajarildi" yoki "Bajarilmadi" bo'lsin.
let tasksWithStatus = tasks.map((task) => {
  const status = task.completed ? "Bajarildi" : "Bajarilmadi";
  return { id: task.id, title: task.title, status: status };
});
console.log(tasksWithStatus);

// ============================================================
// 9. MASSIV METODLARI — FILTER
// ============================================================
// `filter` — shartga mos keladigan elementlardan yangi massiv qaytaradi.
// Asl massivni o'zgartirmaydi.
//
// Misol:
//   const activeUsers = users.filter((user) => user.isActive);
//
// TOPSHIRIQLAR:
//
// 1. Faqat aktiv foydalanuvchilarni qaytaring.
//
// 2. `products` dan faqat omborda mavjud (stock > 0) va
//    reytingi 4.0 dan yuqori mahsulotlarni qaytaring.
//
// 3. `tasks` dan bajarilmagan va ustuvorligi "high" bo'lgan
//    vazifalarni qaytaring.

// ============================================================
// 10. MASSIV METODLARI — REDUCE
// ============================================================
// `reduce` — massiv elementlarini bitta qiymatga yig'adi (son, satr, obyekt va h.k.).
// Ikki argument oladi: callback funksiya va boshlang'ich qiymat (accumulator).
//
// Misol:
//   const total = products.reduce((sum, product) => sum + product.price, 0);
//
// TOPSHIRIQLAR:
//
// 1. Barcha mahsulotlarning umumiy narxini hisoblang (chegirmasiz).
//
// 2. `tasks` massividan bajarilgan va bajarilmagan vazifalar sonini hisoblang.
//    Natija: { completed: 3, pending: 5 } ko'rinishida bo'lsin.
//
// 3. `users` massividan har bir role (admin, editor, viewer) uchun
//    nechta foydalanuvchi borligini hisoblang.
//    Natija: { admin: 2, editor: 2, viewer: 2 } ko'rinishida bo'lsin.

// ============================================================
// 11. MASSIV METODLARI — FIND / FINDINDEX
// ============================================================
// `find`      — shartga mos birinchi elementni qaytaradi (yoki undefined).
// `findIndex` — shartga mos birinchi elementning indeksini qaytaradi (yoki -1).
//
// Misol:
//   const user = users.find((u) => u.id === 3);
//   const index = users.findIndex((u) => u.id === 3);
//
// TOPSHIRIQLAR:
//
// 1. `products` dan id si 104 bo'lgan mahsulotni toping.
//
// 2. `tasks` dan birinchi bajarilmagan va ustuvorligi "high" bo'lgan
//    vazifani toping.
//
// 3. `users` dan email i "eva@example.com" bo'lgan foydalanuvchini
//    toping va uning massivdagi indeksini aniqlang.

// ============================================================
// 12. MASSIV METODLARI — SOME / EVERY
// ============================================================
// `some`  — massivdagi kamida bitta element shartga mos kelsa true qaytaradi.
// `every` — massivdagi barcha elementlar shartga mos kelsa true qaytaradi.
// Ikkalasi ham boolean qaytaradi.
//
// Misol:
//   const hasAdmin   = users.some((u) => u.role === "admin");
//   const allActive  = users.every((u) => u.isActive);
//
// TOPSHIRIQLAR:
//
// 1. `products` massivida kamida bitta ombori tugagan (stock === 0)
//    mahsulot borligini tekshiring.
//
// 2. `tasks` massividagi barcha yuqori ustuvorlikdagi ("high") vazifalar
//    bajarilganligini tekshiring.
//
// 3. Berilgan foydalanuvchining barcha natijalari (scores) 70 dan yuqori
//    ekanligini tekshiradigan `allPassed` funksiyasini yozing.

// ============================================================
// 13. ASYNC / AWAIT
// ============================================================
// Asinxron kodni sinxron ko'rinishda yozish imkonini beradi.
// `async` funksiya har doim Promise qaytaradi.
// `await` — Promise hal bo'lguncha kutadi va natijani qaytaradi.
//
// Misol:
//   const getUser = async (id) => {
//     const data = await fetchUserFromDB(id);
//     return data;
//   };
//
// TOPSHIRIQLAR:
//
// 1. `getPost` nomli async funksiya yozing — id qabul qilib,
//    https://jsonplaceholder.typicode.com/posts/{id} dan ma'lumot olib qaytarsin.
//    Natijani console ga chiqaring.
//
// 2. `getAllUsers` nomli async funksiya yozing —
//    https://jsonplaceholder.typicode.com/users dan barcha foydalanuvchilarni
//    olib, faqat ularning `name` va `email` larini qaytarsin.
//
// 3. `getPostsAndUsers` nomli async funksiya yozing —
//    postlar va foydalanuvchilarni bir vaqtda (parallel) yuklab,
//    { posts, users } ko'rinishida qaytarsin.
//    (Maslahat: Promise.all dan foydalaning)

// ============================================================
// 14. TRY / CATCH (ASYNC FUNKSIYALARDA)
// ============================================================
// Asinxron kodda xatolarni ushlab olish uchun ishlatiladi.
// `await` ishlatilgan har qanday joy xato chiqarishi mumkin —
// shuning uchun try/catch bilan o'rash kerak.
//
// Misol:
//   const getData = async (url) => {
//     try {
//       const res = await fetch(url);
//       const data = await res.json();
//       return data;
//     } catch (error) {
//       console.error("Xato:", error.message);
//     }
//   };
//
// TOPSHIRIQLAR:
//
// 1. Mavjud bo'lmagan URL ga (`https://jsonplaceholder.typicode.com/invalid`)
//    so'rov yuboring va xatoni try/catch bilan ushlab, console ga chiqaring.
//
// 2. `safeFetch` nomli funksiya yozing — URL qabul qilib, muvaffaqiyatli
//    bo'lsa ma'lumotni, xato chiqsa { error: xato xabari } qaytarsin.
//
// 3. `getUser` nomli async funksiya yozing — id qabul qilib, server dan
//    foydalanuvchi olib kelsin. Agar javob res.ok bo'lmasa (masalan 404),
//    try ichida qo'lda xato chiqaring: throw new Error("Foydalanuvchi topilmadi").

// ============================================================
// 15. FETCH API
// ============================================================
// Brauzerning serverga HTTP so'rov yuborish uchun built-in funksiyasi.
// Doimo Promise qaytaradi. Javobni o'qish uchun `.json()` chaqirish kerak —
// bu ham Promise.
//
// Misol:
//   const res  = await fetch("https://jsonplaceholder.typicode.com/posts/1");
//   const data = await res.json();
//
// TOPSHIRIQLAR:
//
// 1. https://jsonplaceholder.typicode.com/posts dan barcha postlarni olib,
//    faqat birinchi 5 tasini console ga chiqaring.
//
// 2. POST so'rov yuboring — https://jsonplaceholder.typicode.com/posts ga
//    { title: "Salom", body: "Bu test", userId: 1 } ma'lumotlarini yuboring.
//    Server qaytargan yangi obyektni console ga chiqaring.
//    (Maslahat: fetch ning ikkinchi argumentida method, headers va body bering)
//
// 3. `fetchWithStatus` nomli funksiya yozing — URL qabul qilib,
//    so'rov muvaffaqiyatli bo'lsa ma'lumotni qaytarsin,
//    aks holda "Server xatosi: 404" kabi xabar bilan xato chiqarsin.
//    (Maslahat: res.ok va res.status dan foydalaning)

// ============================================================
// 16. LOCALSTORAGE / SESSIONSTORAGE
// ============================================================
// Brauzerda ma'lumot saqlash uchun ishlatiladi.
//
// localStorage   — brauzer yopilganda ham saqlanib qoladi.
// sessionStorage — faqat joriy tab/oyna yopilguncha saqlanadi.
//
// Faqat satr (string) saqlanadi — obyektlar uchun JSON ishlatish kerak.
//
// Misol:
//   localStorage.setItem("user", JSON.stringify({ name: "Alice" }));
//   const user = JSON.parse(localStorage.getItem("user"));
//   localStorage.removeItem("user");
//   localStorage.clear();
//
// TOPSHIRIQLAR:
//
// 1. `users` massividan birinchi foydalanuvchini localStorage ga saqlang,
//    so'ngra uni o'qib console ga chiqaring.
//
// 2. `saveTheme` va `getTheme` funksiyalarini yozing —
//    `saveTheme("dark")` tanlangan mavzuni localStorage ga saqlash,
//    `getTheme()` esa uni qaytarish (mavjud bo'lmasa "light" qaytarsin).
//
// 3. `addToCart` va `getCart` funksiyalarini yozing —
//    `addToCart(product)` mahsulotni localStorage dagi savatchaga qo'shsin,
//    `getCart()` esa savatdagi barcha mahsulotlar massivini qaytarsin.

// ============================================================
// 17. SETTIMEOUT / SETINTERVAL
// ============================================================
// `setTimeout`  — kodni ma'lum vaqt o'tgach bir marta bajaradi.
// `setInterval` — kodni ma'lum vaqt oralig'ida qayta-qayta bajaradi.
// Ikkalasi ham ID qaytaradi — uni clearTimeout / clearInterval ga berib to'xtatish mumkin.
//
// Misol:
//   const timerId = setTimeout(() => console.log("Vaqt tugadi!"), 2000);
//   clearTimeout(timerId); // bekor qilish
//
//   const intervalId = setInterval(() => console.log("Takrorlanmoqda"), 1000);
//   clearInterval(intervalId); // to'xtatish
//
// TOPSHIRIQLAR:
//
// 1. 3 soniyadan keyin "Xush kelibsiz!" xabarini console ga chiqaradigan
//    setTimeout yozing. So'ngra uni ishga tushmasdan oldin bekor qiling.
//
// 2. Har soniyada 10 dan 1 gacha sanab tushadigan va tugagach
//    "Vaqt tugadi!" chiqaradigan taymer yozing.
//    setInterval va clearInterval dan foydalaning.
//
// 3. `debounce` funksiyasini yozing — boshqa funksiya va kechikish vaqtini
//    (ms) qabul qilib, faqat oxirgi chaqiruvdan keyin belgilangan vaqt o'tgach
//    bajaradigan funksiya qaytarsin.
//    (Bu amalda: qidiruv maydonida har tugma bosishda so'rov yubormaslik uchun ishlatiladi)
