//1
let kitoblar = [];
// 2
function kitobQosh(kitob) {
    kitoblar.push(kitob)
}
kitobQosh({ id: 1, nom: "JavaScript asoslari", muallif: "Karimov" })
kitobQosh({ id: 2, nom: "Python asoslari", muallif: "Sariq dev" })
// 3
function kitobOlish() {
    if (kitoblar.length > 0) {
        return kitoblar.shift()
    }
    return null;
}
// console.log(kitobOlish())
// 4
function tezkorKitobQosh(kitob) {
    kitoblar.unshift(kitob)
}
tezkorKitobQosh({ id: 4, nom: "SOS", muallif: "James" })
// 5 
function oxirgiKitobniOlibTashla() {
    kitoblar.pop()
}
oxirgiKitobniOlibTashla()

// 6
console.log(kitoblar)


let talabalar = [
    { ism: "Dilnoza", yosh: 16, kurs: "Frontend", ball: 90 },
    { ism: "Aziz", yosh: 16, kurs: "UI/UX", ball: 95 },
    { ism: "Saidshox", yosh: 16, kurs: "Frontend", ball: 70 },
    { ism: "Hoji", yosh: 16, kurs: "Backend", ball: 65 },
    { ism: "Saloh", yosh: 16, kurs: "Backend", ball: 75 },
    { ism: "Bobur", yosh: 17, kurs: "Frontend", ball: 65 }
]

// 2
function talabaInfo(talaba) {
    console.log("${talaba.ism}, ${talaba.yosh} yosh, ${talaba.kurs}, ball: ${talaba.ball}")
}
talabaInfo(talabalar[4])
// 3
function kursBoyichaFiltr(talabalar, kursNomi) {
    let soni = talabalar.filter((talaba) => talaba.kurs === kursNomi).length;
    console.log("${kursNomi} talabalari: ${soni} ta")
}

kursBoyichaFiltr(talabalar, 'Frontend')
kursBoyichaFiltr(talabalar, 'Backend')
kursBoyichaFiltr(talabalar, 'UI/UX')

// 4 
function ortachaBall(students) {
    let jamiBaho = students.reduce((sum, item) => {
        return sum + item.ball
    }, 0);
    console.log("O'rtacha ball: ${(jamiBaho / students.length).toFixed(1)}")
}
ortachaBall(talabalar)

// let mevaRoyxati = document.getElementById('meva_royxati');
// let mevalar = ["olma", "banan", "uzum", "anor", "apelsin"];

// mevalar.forEach((meva) => {
//     let li = document.createElement('li');
//     li.textContent = meva;
//     mevaRoyxati.appendChild();
// })

const mahsulotlar = [
    { nom: "Telefon", narx: 2500000, kategoriya: "elektronika", mavjud: true },
    { nom: "Ko'ylak", narx: 120000, kategoriya: "kiyim", mavjud: false },
    { nom: "Soat", narx: 150000, kategoriya: "aksessuar", mavjud: false },
    { nom: "Achki", narx: 150000, kategoriya: "aksessuar", mavjud: false },
    { nom: "Tomford", narx: 120000, kategoriya: "parfume", mavjud: false },
    { nom: "Channel", narx: 690000, kategoriya: "parfume", mavjud: false },
    { nom: "Shim", narx: 10000, kategoriya: "kiyim", mavjud: false },
    { nom: "Apelsin", narx: 10000, kategoriya: "ozuqOvqat", mavjud: false },
    { nom: "Somsa", narx: 7000, kategoriya: "ozuqOvqat", mavjud: false },

];


const katalog = document.getElementById('katalog');
const kategoriya = document.getElementById('kategoriya');


kategoriya.addEventListener('change', (e) => {
    katalog.innerHTML = '';

    let turi = kategoriya.value;

    if (turi === 'barcha') {
        mahsulotlar.forEach(product => {
            katalog.innerHTML += `<li> 
                <h2>${product.nom} </h2>
                <p> ${product.narx} so'm</p>
            </li>`
        })
    }
    if (turi) {
        let filteredProducts = mahsulotlar.filter((mahsulot) => mahsulot.kategoriya === turi)

        filteredProducts.forEach(product => {
            katalog.innerHTML += `<li> 
                <h2>${product.nom} </h2>
                <p> ${product.narx} so'm</p>
            </li>`
        })
    }
})

document.addEventListener('DOMContentLoaded', () => {
    mahsulotlar.forEach(product => {
        katalog.innerHTML += `<li> 
                <h2>${product.nom} </h2>
                <p> ${product.narx} so'm</p>
            </li>`
    })
})




//5



const mahsulotlar2 = [
    { id: 1, nom: "Telefon", narx: 2500000 },
    { id: 2, nom: "Quloqchin", narx: 150000 },
    { id: 3, nom: "Noutbuk", narx: 7000000 },
    { id: 4, nom: "Sichqoncha", narx: 80000 }
];


let savat = [];


const mahsulotlarRoyxatiEl = document.getElementById("mahsulotlar-ro'yxati");
const savatEl = document.getElementById("savat");
const jamiEl = document.getElementById("jami");
const olibTashlashBtn = document.getElementById("savatdan-olib-tashlash");


function mahsulotlar3() {
    mahsulotlarRoyxatiEl.innerHTML = "";

    mahsulotlar2.forEach(mahsulot => {
        const li = document.createElement("li");
        const btn = document.createElement("button");

        btn.textContent = `${mahsulot.nom} — ${mahsulot.narx} so'm`;
        btn.setAttribute("data-id", mahsulot.id);


        btn.addEventListener("click", () => {
            savatgaQosh(mahsulot);
        });

        li.appendChild(btn);
        mahsulotlarRoyxatiEl.appendChild(li);
    });
}

function savatgaQosh(mahsulot) {
    savat.push(mahsulot);
    savatniChiqarish();
}
function savatdanOxirgisiniOlibTashla() {
    savat.pop();
    savatniChiqarish();
}
function jamiNarx(savatMassivi) {
    return savatMassivi.reduce((yigindi, item) => yigindi + item.narx, 0);
}

function savatniChiqarish() {
    savatEl.innerHTML = "";
    savat.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `- ${item.nom} — ${item.narx} so'm`;
        savatEl.appendChild(li);
    });

    const jamiSumma = jamiNarx(savat);

    if (savat.length === 0) {
        jamiEl.textContent = "Jami: —";
    } else {
        jamiEl.textContent = `Jami: ${jamiSumma} so'm`;
    }
}

olibTashlashBtn.addEventListener("click", savatdanOxirgisiniOlibTashla);

mahsulotlar3();
savatniChiqarish();



//6


//12
const markaz = {
    guruhlar: [
        {
            nom: "A-10",
            talabalar: [
                { ism: "Dilnoza", ball: 92 },
                { ism: "Aziz", ball: 75 },
                { ism: "Madina", ball: 81 }
            ]
        },

    ]
};

const guruhTanlashEl = document.getElementById("guruh-tanlash");
const talabaIsmEl = document.getElementById("talaba-ism");
const talabaBallEl = document.getElementById("talaba-ball");
const talabaQoshishBtn = document.getElementById("talaba-qoshish");
const talabaChiqarishBtn = document.getElementById("talaba-chiqarish");
const guruhSarlavhaEl = document.getElementById("guruh-sarlavha");
const guruhOrtachaEl = document.getElementById("guruh-ortacha");
const talabalarRoyxatiEl = document.getElementById("talabalar-ro'yxati");
const aloOquvchilarEl = document.getElementById("alo-oquvchilar");
const jamiTalabalarEl = document.getElementById("jami-talabalar");
const jamiGuruhlarEl = document.getElementById("jami-guruhlar");

function guruhlarniSelectgaJoyla() {
    guruhTanlashEl.innerHTML = "";

    markaz.guruhlar.forEach(function (guruh) {
        const option = document.createElement("option");
        option.value = guruh.nom;
        option.textContent = guruh.nom;
        guruhTanlashEl.appendChild(option);
    });
}

function tanlanganGuruhniOl() {
    return markaz.guruhlar.find(function (guruh) {
        return guruh.nom === guruhTanlashEl.value;
    });
}

function guruhOrtachaBall(guruh) {
    if (guruh.talabalar.length === 0) {
        return 0;
    }

    const jamiBall = guruh.talabalar.reduce(function (yigindi, talaba) {
        return yigindi + talaba.ball;
    }, 0);

    return (jamiBall / guruh.talabalar.length).toFixed(1);
}

function barchaAloOquvchilarniOl() {
    const aloTalabalar = [];

    markaz.guruhlar.forEach(function (guruh) {
        guruh.talabalar.forEach(function (talaba) {
            if (talaba.ball >= 80) {
                aloTalabalar.push({
                    ism: talaba.ism,
                    ball: talaba.ball,
                    guruh: guruh.nom
                });
            }
        });
    });

    return aloTalabalar;
}

function jamiTalabalarSoni() {
    return markaz.guruhlar.reduce(function (yigindi, guruh) {
        return yigindi + guruh.talabalar.length;
    }, 0);
}

function tanlanganGuruhniChiz() {
    const guruh = tanlanganGuruhniOl();

    guruhSarlavhaEl.textContent = "Guruh: " + guruh.nom + " (" + guruh.talabalar.length + " ta talaba)";
    guruhOrtachaEl.textContent = "O'rtacha ball: " + guruhOrtachaBall(guruh);
    talabalarRoyxatiEl.innerHTML = "";

    guruh.talabalar.forEach(function (talaba) {
        const li = document.createElement("li");
        li.textContent = talaba.ism + " - " + talaba.ball + " ball";
        talabalarRoyxatiEl.appendChild(li);
    });
}

function aloOquvchilarniChiz() {
    const aloTalabalar = barchaAloOquvchilarniOl();
    aloOquvchilarEl.innerHTML = "";

    aloTalabalar.forEach(function (talaba) {
        const li = document.createElement("li");
        li.textContent = talaba.ism + " - " + talaba.guruh + " - " + talaba.ball + " ball";
        aloOquvchilarEl.appendChild(li);
    });
}

function markazStatistikasiniChiz() {
    jamiTalabalarEl.textContent = "Jami talabalar: " + jamiTalabalarSoni();
    jamiGuruhlarEl.textContent = "Jami guruhlar: " + markaz.guruhlar.length;
}

function markazniYangila() {
    tanlanganGuruhniChiz();
    aloOquvchilarniChiz();
    markazStatistikasiniChiz();
}

function talabaQoshish() {
    const ism = talabaIsmEl.value.trim();
    const ball = Number(talabaBallEl.value);
    const guruh = tanlanganGuruhniOl();

    if (ism === "" || ball < 0 || ball > 100 || Number.isNaN(ball)) {
        return;
    }

    guruh.talabalar.push({
        ism: ism,
        ball: ball
    });

    talabaIsmEl.value = "";
    talabaBallEl.value = "";
    markazniYangila();
}

function oxirgiTalabaniChiqarish() {
    const guruh = tanlanganGuruhniOl();

    if (guruh.talabalar.length === 0) {
        return;
    }

    guruh.talabalar.pop();
    markazniYangila();
}

guruhTanlashEl.addEventListener("change", markazniYangila);
talabaQoshishBtn.addEventListener("click", talabaQoshish);
talabaChiqarishBtn.addEventListener("click", oxirgiTalabaniChiqarish);

guruhlarniSelectgaJoyla();
markazniYangila();
