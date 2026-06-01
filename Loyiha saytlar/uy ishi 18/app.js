/*
================================================================================
  AMALIYOT TO‘PLAMI — Funksiyalar | Massiv | Ob'ekt | push, pop, shift, unshift,
  forEach, map, filter, reduce
  Til: O'zbek (lotin) | Yechimlar berilmagan — faqat topshiriq va maslahat
================================================================================
  index.html da har topshiriq uchun kerakli id/class larni qo‘shing.
  Bir vaqtda bitta topshiriq ustida ishlang; eski kodni comment qilib qoldiring.
================================================================================
*/


/* =============================================================================
   BOSQICH 1 — ISSIQLASH (DOMsiz yoki minimal DOM)
============================================================================= */


/* -----------------------------------------------------------------------------
   TOPSHIRIQ 1 — Kutubxona navbatlari (push, pop, shift, unshift)
   -----------------------------------------------------------------------------

   MUAMMO:
   Kutubxonada kitoblar navbatda turadi. Har bir kitob — ob'ekt:
   { id: 1, nom: "JavaScript asoslari", muallif: "Karimov" }

   Yangi kitob kelganda navbat oxiriga qo‘shiladi.
   O‘qish uchun navbat boshidan kitob olinadi.
   Ba’zan "tezkor" kitob navbat boshiga qo‘yiladi (shift/unshift emas — unshift!).

   QADAMLAR:
   1. `kitoblar` nomli bo‘sh massiv yarating.
   2. `kitobQosh(kitob)` — push bilan oxiriga qo‘shsin.
   3. `kitobOlish()` — shift bilan boshidan olib, qaytarsin (navbat bo‘sh bo‘lsa null).
   4. `tezkorKitobQosh(kitob)` — unshift bilan boshiga qo‘shsin.
   5. `oxirgiKitobniOlibTashla()` — pop bilan oxiridagi ob'ektni olib tashlasin (qaytarmasin yoki qaytarsin — o‘zingiz qaror qiling, izohda yozing).
   6. Konsolga har amaldan keyin navbat holatini chiqaring.

   MASLAHATLAR:
   - push/pop — oxir; shift/unshift — bosh. Navbat (queue) odatda shift + push.
   - Ob'ekt ichidagi maydonlarga nuqta bilan murojaat qiling: kitob.nom
   - Massiv uzunligi: kitoblar.length

   NAMUNA CHIQISH (konsol):
   Navbat: []
   Qo'shildi: { id: 1, nom: "...", ... }
   Navbat: [ { id: 1, ... } ]
   Olindi: { id: 1, ... }
   Navbat: []
   Tezkor qo'shildi → navbat boshida yangi kitob
*/



/* -----------------------------------------------------------------------------
   TOPSHIRIQ 2 — Talabalar ro‘yxati (ob'ekt + funksiya)
   -----------------------------------------------------------------------------

   MUAMMO:
   O‘quv markazida har bir talaba ob'ekt:
   { ism: "Dilnoza", yosh: 16, kurs: "Frontend", ball: 85 }

   Bir nechta talaba massivida saqlanadi. Funksiyalar orqali ma’lumot qayta ishlanadi.

   QADAMLAR:
   1. Kamida 5 ta talaba ob'ektini massivga yozing (qo‘lda).
   2. `talabaInfo(talaba)` — string qaytarsin: "Dilnoza, 16 yosh, Frontend, ball: 85"
   3. `kursBo'yichaFiltr(talabalar, kursNomi)` — filter ishlatmasdan ham bo‘ladi, lekin keyingi topshiriqlarda filter o‘rganasiz; bu yerda oddiy tsikl yoki filter — ikkalasi ham mumkin (filter bo‘lsa yaxshi).
   4. `o'rtachaBall(talabalar)` — barcha ballarning o‘rtachasini hisoblang (reduce hali shart emas — tsikl bilan ham bo‘ladi).
   5. Natijalarni console.log qiling.

   MASLAHATLAR:
   - Funksiya ichida ob'ekt parametr sifatida keladi — talaba.ism
   - O‘rtacha = yig‘indi / soni; bo‘sh massiv bo‘lsa 0 qaytaring.

   NAMUNA CHIQISH:
   Dilnoza, 16 yosh, Frontend, ball: 85
   Frontend talabalari: 3 ta
   O'rtacha ball: 78.4
*/


/* -----------------------------------------------------------------------------
   TOPSHIRIQ 3 — forEach bilan ro‘yxat (birinchi DOM)
   -----------------------------------------------------------------------------

   MUAMMO:
   HTML da `<ul id="meva-ro'yxati"></ul>` bor. JavaScript da mevalar massivi:
   ["olma", "banan", "uzum", "anor"]

   Har bir meva `<li>` sifatida ro‘yxatga chiqsin.

   QADAMLAR:
   1. index.html ga ul#meva-ro'yxati qo‘shing.
   2. Massivni forEach bilan aylantiring.
   3. Har iteratsiyada yangi li yaratib, textContent = meva, ul ga append qiling.
   4. document.querySelector yoki getElementById ishlating.

   MASLAHATLAR:
   - document.createElement("li")
   - forEach ichida return kerak emas (map dan farqi).
   - Agar ro‘yxat yangilansa, avval ul.innerHTML = "" qilib tozalash mumkin.

   NAMUNA CHIQISH (sahifada):
   • olma
   • banan
   • uzum
   • anor
*/


/* =============================================================================
   BOSQICH 2 — ASOSIY METODLAR + DOM (haqiqiy vaziyatlar)
============================================================================= */


/* -----------------------------------------------------------------------------
   TOPSHIRIQ 4 — Onlayn do‘kon katalogi (map + filter)
   -----------------------------------------------------------------------------

   MUAMMO:
   Do‘konda mahsulotlar ob'ekt ko‘rinishida:

   const mahsulotlar = [
     { nom: "Telefon", narx: 2500000, kategoriya: "elektronika", mavjud: true },
     { nom: "Ko'ylak", narx: 120000, kategoriya: "kiyim", mavjud: false },
     ...
   ];

   Foydalanuvchi kategoriya tanlaydi; faqat mavjud mahsulotlar va tanlangan
   kategoriya ekranda ko‘rinsin. Narxlar minglik ajratgich bilan chiqsin (masalan: 2 500 000).

   QADAMLAR:
   1. index.html: <select id="kategoriya">, <section id="katalog"></section> (yoki div)
   2. select ga option lar: barcha, elektronika, kiyim, oziq-ovqat
   3. `mahsulotlarniKo'rsat(kategoriya)` funksiyasi:
      - filter: mavjud === true va (kategoriya === "barcha" yoki kategoriya mos)
      - map: har mahsulotdan HTML uchun qisqa matn yoki ob'ekt { sarlavha, narxMatn }
      - forEach yoki map natijasini DOM ga yozing (har biri div.card)
   4. select "change" hodisasida funksiyani chaqiring.

   MASLAHATLAR:
   - map asl massivni o‘zgartirmaydi — yangi massiv qaytaradi.
   - filter ham yangi massiv.
   - Narxni chiroyli qilish uchun alohida funksiya: formatNarx(n) — ixtiyoriy.

   NAMUNA CHIQISH (kategoriya: elektronika):
   ┌─────────────────────┐
   │ Telefon             │
   │ 2 500 000 so'm      │
   └─────────────────────┘
   (faqat mavjud va elektronika)
*/


/* -----------------------------------------------------------------------------
   TOPSHIRIQ 5 — Savat va jami summa (reduce + push/pop)
   -----------------------------------------------------------------------------

   MUAMMO:
   Savat — mahsulot ob'ektlari massivi. Foydalanuvchi "Savatga qo‘shish" bosadi,
   oxirgi tanlangan mahsulot push bilan qo‘shiladi. "Oxirgisini olib tashlash" — pop.
   Ekranda savat ro‘yxati va JAMI summa (reduce) ko‘rinsin.

   QADAMLAR:
   1. HTML: mahsulotlar ro‘yxati (button data-id yoki nom bilan), savat ul#savat, p#jami
   2. `savatgaQosh(mahsulot)` — push
   3. `savatdanOxirgisiniOlibTashla()` — pop, keyin ekranni yangilang
   4. `jamiNarx(savat)` — reduce: (yigindi, item) => yigindi + item.narx, 0
   5. `savatniChizish()` — forEach bilan li lar, jami ni reduce natijasi bilan yozing

   MASLAHATLAR:
   - reduce boshlang‘ich qiymat: 0 (raqam yig‘indisi uchun).
   - Bir xil mahsulot ikki marta qo‘shilishi mumkin — bu topshiriqda normal.

   NAMUNA CHIQISH:
   Savat:
   - Telefon — 2 500 000
   - Quloqchin — 150 000
   Jami: 2 650 000 so'm
*/


/* -----------------------------------------------------------------------------
   TOPSHIRIQ 6 — Vazifalar paneli (shift, unshift, filter, DOM)
   -----------------------------------------------------------------------------

   MUAMMO:
   Oddiy "bugun qilish kerak" ilovasi. Har vazifa:
   { matn: "Darslik o'qish", bajarildi: false, muhim: true }

   Yangi vazifa — form orqali, unshift bilan boshiga qo‘shiladi (eng yangi yuqorida).
   "Birinchi vazifani bajarildi" — shift emas! bajarildi=true qilish; yoki alohida:
   eng eski bajarilmagan vazifani shift bilan olib, "arxiv" massiviga push qiling (murakkabroq variant).

   Oddiy variant: "Bajarildi" checkbox — filter bilan faqat bajarilmaganlarni ko‘rsatish tugmasi.

   QADAMLAR:
   1. input#vazifa-matn, button#qoshish, ul#vazifalar, button#faqat-faol (yoki checkbox)
   2. qoshish: ob'ekt yarating, unshift(vazifalar)
   3. Har vazifa uchun li + checkbox; checkbox o‘zgarganda ob'ekt.bajarildi yangilansin
   4. "Faqat faol" bosilganda: filter(!bajarildi) natijasini chizing (asl massivni saqlang!)

   MASLAHATLAR:
   - filter asl vazifalar massivini buzmasin — faqat ko‘rsatish uchun filtrlangan nusxa.
   - Ob'ekt reference: massivdagi ob'ektni o‘zgartirsangiz, asl ma’lumot ham o‘zgaradi.

   NAMUNA CHIQISH:
   [ ] Darslik o'qish  ★
   [x] Uy vazifasi
   (Faqat faol: 1 ta vazifa ko'rinadi)
*/


/* -----------------------------------------------------------------------------
   TOPSHIRIQ 7 — Reyting jadvali (map, sort ixtiyoriy, forEach + DOM)
   -----------------------------------------------------------------------------

   MUAMMO:
   O‘yin ballari massivi:
   { ism: "Sardor", ball: 920 },
   { ism: "Nilufar", ball: 1050 },
   ...

   map bilan har bir o‘yinchidan `{ o'rin: ?, ism, ball, daraja }` qiling.
   daraja: ball >= 1000 → "Oltin", >= 700 → "Kumush", aks holda "Bronza"
   (o‘rinni map ichida emas, map dan keyin indeks + 1 bilan ham berish mumkin).

   QADAMLAR:
   1. map → yangi massiv
   2. Ball bo‘yicha kamayish tartibida saralash (sort — ixtiyoriy, lekin tavsiya etiladi)
   3. table yoki ul ga forEach bilan qatorlar
   4. style.css da oddiy jadval stillari (ixtiyoriy)

   MASLAHATLAR:
   - map ichida return {} yoki qisqa strelka (sizda qanday o‘rgatilgan bo‘lsa).
   - sort: (a, b) => b.ball - a.ball

   NAMUNA CHIQISH (jadval):
   | O'rin | Ism     | Ball | Daraja |
   |   1   | Nilufar | 1050 | Oltin  |
   |   2   | Sardor  |  920 | Kumush |
*/


/* =============================================================================
   BOSQICH 3 — CHALLENGE (bir nechta metod + DOM + mantiq)
============================================================================= */


/* -----------------------------------------------------------------------------
   CHALLENGE 8 — Kutubxona qidiruvi (filter + map + funksiyalar)
   -----------------------------------------------------------------------------

   MUAMMO:
   20 ta kitob ob'ekti massivida (nom, muallif, yil, janr).
   Qidiruv maydoni: nom yoki muallif bo‘yicha (katta-kichik harf farqi qaramasdan — ixtiyoriy qiyinlik).
   Janr bo‘yicha filter (select).
   Natija: kartochkalar — map bilan qisqa sarlavha + yil.

   QADAMLAR:
   1. input#qidiruv, select#janr, div#natijalar
   2. `kitoblarniFiltrla(so'z, janr)` → filter zanjiri yoki bitta filter ichida shartlar
   3. `kartochkaYarat(kitob)` — bitta kitob uchun DOM element qaytaradigan funksiya
   4. input "input" hodisasida, select "change" da yangilang

   MASLAHATLAR:
   - includes() string metodi: kitob.nom.toLowerCase().includes(so'z.toLowerCase())
   - Hech narsa topilmasa: "Kitob topilmadi" xabari

   NAMUNA CHIQISH:
   Qidiruv: "push"
   Janr: dasturlash
   → 2 ta kitob kartochkasi
*/


/* -----------------------------------------------------------------------------
   CHALLENGE 9 — Oylik xarajatlar hisoboti (reduce + object + DOM)
   -----------------------------------------------------------------------------

   MUAMMO:
   Xarajatlar massivi:
   { sana: "2025-05-01", kategoriya: "oziq", summa: 45000 },
   { sana: "2025-05-03", kategoriya: "transport", summa: 12000 },
   ...

   reduce bilan:
   - umumiy jami
   - har kategoriya bo‘yicha yig‘indi (ob'ekt qaytaring: { oziq: 45000, transport: 12000 })

   DOM: umumiy jami, kategoriyalar ro‘yxati (forEach Object.entries yoki for...in).

   QADAMLAR:
   1. Kamida 10 ta xarajat yozing.
   2. `kategoriyaBo'yichaYigindi(xarajatlar)` — reduce
   3. `umumiyJami(xarajatlar)` — reduce yoki Object.values yig‘indisi
   4. `#hisobot` ichida chiqaring

   MASLAHATLAR:
   - reduce da akkumulyator ob'ekt bo‘lishi mumkin: (hisob, x) => { ... hisob[x.kategoriya] ... }
   - Boshlang‘ich qiymat: {}

   NAMUNA CHIQISH:
   Umumiy: 387 000 so'm
   oziq: 120 000
   transport: 45 000
   ko'ngilochar: 222 000
*/


/* -----------------------------------------------------------------------------
   CHALLENGE 10 — Navbat simulyatori (push, shift, pop, DOM + interval ixtiyoriy)
   -----------------------------------------------------------------------------

   MUAMMO:
   Banka yoki kassa navbati. Har mijoz: { id: 101, ism: "Aziz", xizmat: "to'lov" }
   "Navbatga qo'shish" — push.
   "Xizmat ko'rsatish" (keyingi mijoz) — shift, xizmat ko'rsatilganlar massiviga push.
   "Oxirgi bekor qilish" — pop (navbatdan ketdi, qaytmadi).

   Ekranda: navbatdagi lar (forEach), xizmat ko'rsatilganlar soni (length), keyingi kim (navbat[0]).

   QADAMLAR:
   1. Ikki massiv: navbat, xizmatKo'rsatilganlar
   2. Uchta tugma + ol#navbat, p#keyingi, p#navbat-statistika
   3. Har amaldan keyin `ekranniYangilash()` — bitta funksiya, ichida forEach/map

   MASLAHATLAR:
   - shift bo‘sh massivda undefined qaytaradi — oldin length tekshiring.
   - ID ni avtomatik oshirish: let keyingiId = 100;

   NAMUNA CHIQISH:
   Navbatda: 3 kishi
   Keyingi: Aziz (to'lov)
   Xizmat ko'rsatilgan: 5 ta
*/


/* -----------------------------------------------------------------------------
   CHALLENGE 11 — Mini CRM: mijozlar (object array, map, filter, reduce, DOM)
   -----------------------------------------------------------------------------

   MUAMMO:
   Mijozlar:
   { id: 1, kompaniya: "Tech Uz", buyurtmalar: 12, summa: 5400000, faol: true }

   - Faqat faol mijozlarni ko‘rsatish (filter)
   - Har birining o‘rtacha buyurtma summasi: summa / buyurtmalar (map — yangi maydon)
   - Barcha faol mijozlarning umumiy aylanmasi (reduce)
   - Eng yuqori aylanmali kompaniya nomi (reduce yoki sort + [0])

   QADAMLAR:
   1. 6+ mijoz ma’lumoti
   2. `#mijozlar` jadval, `#crm-statistika` blok
   3. Tugma: "Faqat faollar" / "Hammasi"
   4. map → o'rtachaBuyurtma; filter → faol; reduce → jamiAylanma

   MASLAHATLAR:
   - buyurtmalar 0 bo‘lmasin — bo‘linish xatosidan saqlaning.
   - map natijasini alohida o‘zgaruvchida saqlang, keyin DOM ga yuboring.

   NAMUNA CHIQISH:
   Tech Uz | 12 buyurtma | o'rtacha: 450 000 | jami: 5 400 000
   ---
   Faol mijozlar aylanmasi: 12 300 000 so'm
   Eng yirik: Tech Uz
*/


/* -----------------------------------------------------------------------------
   CHALLENGE 12 — Yakuniy loyiha: "O'quv markazi paneli" (hammasi birga)
   -----------------------------------------------------------------------------

   MUAMMO:
   Bir sahifada quyidagilar birlashsin (alohida bo‘limlar):

   A) Guruhlar massivi — ob'ekt: { nom: "A-10", talabalar: [...] }
      Yangi talaba qo‘shish (push talabalar ichiga), guruhdan chiqarish (pop yoki filter).

   B) Guruh bo‘yicha o‘rtacha ball (reduce ichida yana reduce yoki ichki funksiya).

   C) Barcha guruhlardan balli >= 80 bo‘lgan talabalarni yig‘ish (filter + flat ixtiyoriy;
      flat o‘rganmagan bo‘lsangiz — ikki bosqichli tsikl yoki map+concat).

   D) DOM: guruh tanlash (select), talabalar ro‘yxati, "A'lo o'quvchilar" ro‘yxati,
      umumiy statistika (jami talaba soni — reduce yoki map+reduce).

   QADAMLAR:
   1. index.html da 3–4 bo‘lim (section) reja qiling.
   2. Ma’lumotlarni boshida bitta `markaz` ob'ekti yoki massivda saqlang.
   3. Kamida 4 ta funksiya: qo‘shish, chiqarish, filtrlash, statistika.
   4. Har bo‘lim uchun alohida `chizish*` funksiyasi — kod tartibli bo‘lsin.

   MASLAHATLAR:
   - Katta loyihani kichik funksiyalarga bo‘ling — senior dasturchi shunday qiladi.
   - console.log bilan oraliq tekshiruv qiling.
   - CSS ni oxirida bezang; avval mantiq ishlasin.

   NAMUNA CHIQISH (qisqacha):
   Guruh: A-10 (8 talaba, o'rtacha ball: 76)
   A'lo o'quvchilar (barcha guruhlar): 5 ta
   [Dilnoza — A-10 — 92 ball]
   ...
*/


/* =============================================================================
   QO‘SHIMCHA MINI-TOPSHIRIQLAR (vaqt qolsa, 15–20 daqiqa)
============================================================================= */

/*
   MINI A — map: sonlar massivi [1,2,3,4] → kvadratlari, ul#sonlar ga chiqaring.

   MINI B — filter: juft sonlarni ajrating, p#juft ichida sonlar ro‘yxati.

   MINI C — reduce: so‘zlar massividan eng uzun so‘z uzunligini toping (acc bo‘sh emas).

   MINI D — pop/push: "Oxirgi harakatlar" (5 ta) — har click da push, 5 dan oshsa shift.

   MINI E — Ob'ekt: foydalanuvchi { login, email, yosh } — `validate(user)` funksiya
            true/false (email @ bor, yosh >= 13). Form submit da xabar chiqaring.
*/


/* =============================================================================
   TEKSHIRUV RO‘YXATI (o‘zingiz baholang)
=============================================================================
   [ ] push/pop va shift/unshift ni to‘g‘ri joyda ishlatdim
   [ ] map/filter/reduce asl massivni buzmaydi (kerak bo‘lsa natijani saqladim)
   [ ] Ob'ekt maydonlarini to‘g‘ri o‘qidim va yangiladim
   [ ] Funksiyalar qisqa va bir vazifali
   [ ] DOM yangilanishi alohida funksiyada (masalan, chizish / render)
   [ ] Bo‘sh massiv va 0 ga bo‘linish holatlarini o‘yladim
============================================================================= */
