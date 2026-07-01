# 📝 JavaScript Qayta Topshirish Imtihoni (2 soat)

---

## 1️⃣ Challenge: Shart operatorlari (if/else), Array, Function, Object

**Vazifa:**
Quyidagi xodimlar ma'lumotlar bazasi beriladi:

```js
const employees = [
  { name: "Kamol",   salary: 3200000, department: "IT"     },
  { name: "Shahlo",  salary: 1800000, department: "HR"     },
  { name: "Ravshan", salary: 2500000, department: "IT"     },
  { name: "Dilnoza", salary: 1200000, department: "Moliya" },
  { name: "Otabek",  salary: 4100000, department: "IT"     },
  { name: "Feruza",  salary: 1500000, department: "HR"     },
  { name: "Jasur",   salary: 2900000, department: "Moliya" },
  { name: "Munira",  salary: 980000,  department: "HR"     }
];
```

**Topshiriq:**

1. `checkSalary` nomli funksiya yarating. U xodimning `salary` qiymatiga qarab:
   * 2 000 000 va undan yuqori → `"Yuqori"`
   * 2 000 000 dan past → `"Past"`  
   deb qaytarsin.
2. Har bir xodim uchun natijani konsolda ko'rsating: `"Kamol – Yuqori"`
3. Faqat **IT bo'limidagi** xodimlarni saqlagan yangi massiv yarating va konsolga chiqaring.

⏱️ Vaqt: ~20 daqiqa

---

## 2️⃣ Challenge: Array Methods (map, filter, reduce) bilan ishlash

**Vazifa:**
Quyidagi kitob do'koni ro'yxati berilgan:

```js
const books = [
  { id: 1,  title: "Clean Code",              author: "Robert Martin", price: 45, genre: "Dasturlash", inStock: true  },
  { id: 2,  title: "The Pragmatic Programmer", author: "Hunt & Thomas", price: 55, genre: "Dasturlash", inStock: true  },
  { id: 3,  title: "Atomic Habits",            author: "James Clear",   price: 20, genre: "Biznes",     inStock: false },
  { id: 4,  title: "Sapiens",                  author: "Y.N. Harari",   price: 18, genre: "Tarix",      inStock: true  },
  { id: 5,  title: "Deep Work",                author: "Cal Newport",   price: 22, genre: "Biznes",     inStock: true  },
  { id: 6,  title: "The Lean Startup",         author: "Eric Ries",     price: 30, genre: "Biznes",     inStock: false },
  { id: 7,  title: "Refactoring",              author: "M. Fowler",     price: 60, genre: "Dasturlash", inStock: true  },
  { id: 8,  title: "Zero to One",              author: "Peter Thiel",   price: 25, genre: "Biznes",     inStock: true  },
  { id: 9,  title: "JavaScript: The Good Parts", author: "D. Crockford", price: 35, genre: "Dasturlash", inStock: true  },
  { id: 10, title: "Homo Deus",                author: "Y.N. Harari",   price: 19, genre: "Tarix",      inStock: false }
];
```

**Topshiriq:**

1. `filter` yordamida narxi **30$ dan qimmat** kitoblarni toping.
2. `map` bilan barcha kitob nomlarini **katta harflarda** qaytaring.
3. `reduce` yordamida barcha kitoblarning **umumiy narxini** hisoblang.
4. `filter` bilan faqat stokda bor (`inStock: true`) kitoblarni ajrating.
5. **"Dasturlash"** janridagi kitoblar sonini toping.
6. Natijalarni konsolda ko'rsating.

📌 **Bonus:** Eng qimmat va eng arzon kitobni `console.log` qiling.

⏱️ Vaqt: ~20 daqiqa

---

## 3️⃣ DOM Challenge: Restoran kartochkalari (import/export)

*(mini loyihacha – import/export mavzusini ham qamrab oladi)*

**Vazifa:**
Quyidagi restoran ma'lumotlari alohida `data.js` faylida beriladi:

```js
export const restaurants = [
  {
    id: 1, name: "Palov Markazi", city: "Toshkent", cuisine: "O'zbek",
    price: 35000, rating: 4.9, isOpen: true,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    description: "Toshkentning eng mashhur palov uyi"
  },
  {
    id: 2, name: "Sushi Garden", city: "Toshkent", cuisine: "Yapon",
    price: 95000, rating: 4.6, isOpen: true,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    description: "Yangi va sifatli sushi tanlovlari"
  },
  {
    id: 3, name: "Pizza Roma", city: "Samarqand", cuisine: "Italyan",
    price: 55000, rating: 4.4, isOpen: false,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    description: "Haqiqiy italyan pizza va pasta"
  },
  {
    id: 4, name: "Beshbarmak", city: "Toshkent", cuisine: "Qozoq",
    price: 42000, rating: 4.7, isOpen: true,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    description: "An'anaviy qozoq milliy taomlari"
  },
  {
    id: 5, name: "Burger House", city: "Namangan", cuisine: "Amerika",
    price: 28000, rating: 4.3, isOpen: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    description: "Yangi va mazali burgerlar"
  },
  {
    id: 6, name: "Lagman House", city: "Farg'ona", cuisine: "O'zbek",
    price: 22000, rating: 4.8, isOpen: false,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    description: "Uy lagmani va qo'l yo'g'ocha"
  },
  {
    id: 7, name: "Thai Garden", city: "Toshkent", cuisine: "Tailand",
    price: 78000, rating: 4.5, isOpen: true,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop",
    description: "Asl tailand ta'mi va ziravorlari"
  },
  {
    id: 8, name: "Cafe National", city: "Buxoro", cuisine: "O'zbek",
    price: 30000, rating: 4.9, isOpen: true,
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop",
    description: "Tarixiy Buxoro manzarasida milliy taomlar"
  }
];
```

**Topshiriq:**

1. `main.js` faylida ushbu ma'lumotlarni import qiling.
2. HTML va CSS yordamida har bir restoran uchun kartochka yarating:
   - Rasm (`image`)
   - Nom va shahar (`name`, `city`)
   - Narx va reyting (`price`, `rating`)
   - Tavsif (`description`)
3. Narxi **40 000 so'mdan past** bo'lgan kartochkalarga yashil fon bering.
4. Reytingi **4.7 dan yuqori** restoranlarga oltin rang ramka qo'shing (`border: 2px solid gold`).
5. `isOpen: false` bo'lgan restoranlarda **"Yopiq"** yozuvi ko'rsatilsin.
6. Natijani dinamik ravishda DOMga qo'\shing.

📌 **Bonus:**
- "Arzon restoranlar" tugmasi → 40 000 so'mdan past restoranlarni filtrlash
- "Eng mashhur" tugmasi → eng yuqori reyting bo'yicha saralash

⏱️ Vaqt: ~35 daqiqa

---

## 4️⃣ Fetch API Challenge: Real foydalanuvchilar ma'lumotbasidan ma'lumot olish

**Vazifa:**
`https://dummyjson.com/users` API manzilidan real foydalanuvchilar ma'lumotini oling.

**API haqida:** DummyJSON — bu 208 ta real foydalanuvchi ma'lumotini o'z ichiga olgan API. Har bir foydalanuvchida to'liq ismi, email, telefon, yoshi, manzil va kompaniya ma'lumotlari bor.

**Topshiriq:**

1. Ma'lumotni `fetch` bilan olib keling va `console.log` qiling.
2. HTMLda har bir foydalanuvchi uchun kartochka yarating:
   - To'liq ismi (`firstName`, `lastName`)
   - Email va telefon (`email`, `phone`)
   - Yoshi va shahri (`age`, 5  `address.city`)
3. Faqat **birinchi 10 ta** foydalanuvchini ko'rsating.
4. **"Ko'proq yuklash"** tugmasi bilan keyingi 10 ta foydalanuvchini ham chiqarish imkonini yarating.
5. Yoshi **30 dan katta** foydalanuvchilar uchun **"Senior"** belgisini qo'shing.

📌 **Bonus:**
- Foydalanuvchi kartochkasiga bosilganda modal oyna ochib, to'liq ma'lumotlarni ko'rsatish
- Ism bo'yicha qidiruv input yaratish

⏱️ Vaqt: ~35 daqiqa

---

## 📊 Baholash mezoni

**Jami: 100 ball**

### 1️⃣ Birinchi Challenge (20 ball)
- `checkSalary` funksiyasi to'g'ri ishlash — **8 ball**
- Har bir xodim uchun konsolda natija — **7 ball**
- IT bo'limi massivi yaratish — **5 ball**

### 2️⃣ Ikkinchi Challenge (25 ball)
- `filter` metodini to'g'ri ishlatish — **6 ball**
- `map` metodini to'g'ri ishlatish — **6 ball**
- `reduce` metodini to'g'ri ishlatish — **8 ball**
- Qo'shimcha filter va janr topish — **5 ball**

### 3️⃣ Uchinchi Challenge (25 ball)
- Ma'lumotlarni to'g'ri import qilish — **5 ball**
- DOMda kartochkalar yaratish — **10 ball**
- CSS styling va shartli dizayn — **7 ball**
- Bonus tugmalar (filtrlash, saralash) — **3 ball**

### 4️⃣ To'rtinchi Challenge (25 ball)
- Fetch API dan to'g'ri foydalanish — **8 ball**
- Ma'lumotlarni DOMda ko'rsatish — **10 ball**
- Pagination ("Ko'proq yuklash") — **5 ball**
- Senior belgi va bonus funktsiyalar — **2 ball**

### Qo'shimcha bonus (5 ball)
- Kod toza va tushunarliligi
- Creative yondoshuvlar
- Error handling qo'shish

---

## 🎯 Talabalar uchun qo'shimcha ko'rsatmalar

1. **Kod tuzilishi:** Har bir challenge uchun alohida fayl yarating
2. **Console.log:** Har bir qadamda natijani console ga chiqaring
3. **Kommentlar:** Kodingizga izohlar qo'shing (o'zbek tilida)
4. **Test qilish:** Har bir funksiyani alohida sinab ko'ring

---

## ⚠️ Imtihon qoidalari

- ✅ Console da xatoliklarni tekshirish majburiy
- ✅ Har bir qadamda comment yozish tavsiya etiladi
- ❌ Boshqa talabalar bilan kod almashish man etilgan
- ❌ ChatGPT, AI yordamchilari man etilgan
- ⏰ Vaqt: aniq 2 soat (120 daqiqa)
