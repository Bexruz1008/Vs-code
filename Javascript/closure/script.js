
//1
function salomBeruvchi(ism) {
    return () => {
        console.log(`Salom`, ism);
    };
}

let salomBerish = salomBeruvchi("Ali");
salomBerish();


//2
function hisoblagich() {
    let count = 0;
    return () => {
        count++;
        console.log("count:", count);
    };
}

let hisob = hisoblagich();
hisob();
hisob();
hisob();


//3
function parolYarat(haqiqiyParol) {
    let foydalanuvchiParoli = 1234
    return () => {
        if (haqiqiyParol === foydalanuvchiParoli) {
            console.log(`Sizning parolingiz: ${foydalanuvchiParoli}`);
        } else {
            console.log("Noto'g'ri parol!");
        }
    };
}
let parolTekshirish = parolYarat(1234);
parolTekshirish();


//4
function createCollector() {
    let items = [];
    return {
        addItem: function (item) {
            items.push(item);
        },
        getItems: function () {
            return items;
        }
    };

}
let collector = createCollector();
collector.addItem("Kitob");
collector.addItem("Qalam");
console.log(collector.getItems());


//5
function makeCounter() {
    let counter = 0
    return {
        counterPlus: function (son) {
            counter += son
        },
        counterMinus: function (son) {
            counter -= son
        },
        counterReset: function () {
            counter = 0
        },
        showCount: function () {
            console.log("Joriy hisob:", counter);
        }

    }
}
let counter = makeCounter()
counter.counterPlus(10)
counter.counterMinus(5)
// counter.counterReset()
counter.showCount();


//6
function createUser(name) {
    let id = null
    function createUser() {
        id++
        console.log("user id:", id);
    }
    return createUser;
}
let showUser = createUser()
showUser()
showUser()