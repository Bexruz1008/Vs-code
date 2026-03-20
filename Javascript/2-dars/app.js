// Methods = Metodlar.
// Metodlar doim . (nuqta) bilan boshlanadi va () bilan tuqaydi.
// Metod nima?

// String (matn) metodlari.

// let ism = 'Bahriddinov Zuhriddin';
// 1 .toUpperCase() = 
// ism.toUpperCase()
// console.log(ism.toUpperCase())

// 2 .toLowerCase() = 
// console.log(ism.toLowerCase())


// 3  .length  = 
// console.log(ism.length) // 21

// 4.  .trim() =
// let parol = '     1111fff    ';
// console.log(parol.trim());

// 5. .includes() = 
// let a9 = 'Alisher Zuhriddin Bobur Muhammad Salohiddin';
// let email = 'zukh@gmail.com';
// if (email.includes('@')) {
//     console.log('Yaxshi')
// } else {
//     console.log('Xato email')
// }
// console.log(a9.includes('Bobur'))

// 6. .indexOf() / .lastIndexOf() = 
// console.log('helllllo'.indexOf('l')) // 2
// console.log('helllllo'.lastIndexOf('l')) // 6
// console.log('helllllo'.lastIndexOf('ola'))

// 7. .slice(start, end) = 
// console.log(ism.slice(12))
// console.log(ism.slice(0, 11))

// 8. .replace() / .replaceAll()
// let text = "Men a9 da o'qiyman. a9 eng yaxshi gruh deb o'ylayman. a9 is the best. 🍜"
// console.log(text.replace('a9', 'a10'))
// console.log(text.replaceAll('a9', 'a10'))

// 9. .split() = 
// console.log(a9.split())
// console.log(a9.split(' '))
// let matn = 'Men-boraman-uyga-birga';
// console.log(matn.split('-'))
// console.log(a9.split(''))


// Number metodlari.

// 1. .toFixed() = 
// let natija = 87.2333311;
// console.log(natija.toFixed(1)) // '87.2'

// 2. .toString() = 
// console.log(natija.toString()) // 87.2333311  =>  '87.2333311'


// 3. .parseInt() / .parseFloat() = 
// console.log(parseInt("100px")); // 100
// console.log(parseFloat("100px")); // 100
// console.log(parseFloat("10.5kg")); // 10.5
// console.log(Number("10.5kg")) // NaN

// 90 => Number  90.1 Float
// 90 => Number/Intiger  90.1 Float


// 4. .isNaN() / Number.isNan() =

// console.log(isNaN('hello'))
// console.log(isNaN(123))
// console.log(Number.isNaN(NaN))

// // 5. Number.isInteger() =
// console.log(Number.isInteger(12))
// console.log(Number.isInteger(12.5))

// console.log(Boolean(-1))
// console.log(!!'text')
// console.log(!!'')
// console.log(!!0)
// console.log(!!-1)


// let ism = prompt('ismingizni kiriting')


// if (ism.trim()) {
//     console.log('Salom ', ism)
// } else {
//     console.log('Ism kiriting.')
// }


// Operatorlar

// 1. Arithmetic (Matematik) operatorlar
// +, -, /, *, %, **


// 2. Assignment (Tayinlash) operatorlari.
// =, +=, -=, *=, /=, %=


// let a = 5;

// a += 5;

// console.log(a) 

// a *= 2;

// console.log(a)

// a -= 12;

// console.log(a)

// 3. Comparison (Taqqoslash) operatorlari.
// ==, ===, !=, !==, >, <, >=, <=

// let yosh = 15;

// if (yosh <= 15) {
//     console.log('Yiz passport ololmaysiz.')
// }


// 4. Logical (Mantiqiy) operatorlar.
// && (and, va), || (or, yoki), ! (not, yo'q)4



/////

let matn = "Men-front-end-dasturchiman";
let words = matn.split("-");
console.log(words);

let text = "JavAScrIPT";
let count = 0;

for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === text.charAt(i).toUpperCase()) {
        count++;
    }
}

console.log(count);

let qiymat = " 7 "
console.log(qiymat.trim());
Number(qiymat);
console.log(qiymat * qiymat);

let text2 = "applez";
let result = text2.charAt(0) == "a" && text2.charAt(text2.length - 1) == "z";
console.log(result);

let text3 = "web" + "App" + "Design"
console.log(text3.length);

let text4 = "frontend";
let count2 = 0;

for (let i = 0; i < text4.length; i++) {
    if (text4.charAt(i) === "a" || text4.charAt(i) === "e" || text4.charAt(i) === "i" || text4.charAt(i) === "o" || text4.charAt(i) === "u") {
        count2++;
    }
}
console.log(count2);
