
const users = [
    { id: 1, name: "Ali", city: "Tashkent", age: 19, isActive: true },
    { id: 2, name: "Madina", city: "Samarkand", age: 22, isActive: false },
    { id: 3, name: "Javohir", city: "Bukhara", age: 17, isActive: true },
    { id: 4, name: "Malika", city: "Tashkent", age: 25, isActive: true }
];

const products = [
    { id: 101, name: "Laptop", price: 950, category: "tech", inStock: true },
    { id: 102, name: "Headphones", price: 120, category: "tech", inStock: true },
    { id: 103, name: "Chair", price: 80, category: "home", inStock: false },
    { id: 104, name: "Notebook", price: 12, category: "study", inStock: true }
];

const orders = [
    { id: 5001, customer: "Ali", total: 35, status: "pending" },
    { id: 5002, customer: "Madina", total: 120, status: "delivered" },
    { id: 5003, customer: "Malika", total: 78, status: "pending" },
    { id: 5004, customer: "Javohir", total: 220, status: "cancelled" }
];
/*
========================================
forEach TASKLARI
========================================
 
1. Demo task:
   users ichidagi barcha userlarni DOMga chiqaring.
   Format:
   Ali from Tashkent
   Madina from Samarkand
 
2. Student task:
   products ichidagi barcha mahsulotlarni DOMga chiqaring.
   Format:
   Laptop - $950
   Headphones - $120
 
3. Student task:
   orders ichidagi barcha buyurtmalarni DOMga chiqaring.
   Format:
   Order #5001 - pending
   Order #5002 - delivered
*/
const task1Ul1 = document.querySelector('#forEachTask1');

function renderUsers() {
    users.forEach((user) => {
        task1Ul1.innerHTML += `<li> ${user.name} from ${user.city} </li>`
    })
}
renderUsers()

const task1Ul2 = document.querySelector('#forEachTask2');

function renderProducts() {
    products.forEach((product) => {
        task1Ul2.innerHTML += `<li> ${product.name} - $${product.price} </li>`
    })
}
renderProducts()
const task1Ul3 = document.querySelector('#forEachTask3');

function renderOrders() {
    orders.forEach((order) => {
        task1Ul3.innerHTML += `<li> Order id:${order.id} - ${order.status} </li>`
    })
}
renderOrders()

/*
========================================
map TASKLARI
========================================

1. Demo task:
users dan faqat ismlarni olib, DOMga chiqaring.

2. Student task:
products dan quyidagi formatda yangi array yarating va DOMga chiqaring:
Laptop costs $950

3. Student task:
orders dan quyidagi formatda yangi array yarating va DOMga chiqaring:
Ali ordered $35
*/

const task2Ul1 = document.querySelector('#mapTask1');
const task2Ul2 = document.querySelector('#mapTask2');
const task2Ul3 = document.querySelector('#mapTask3');

let userNames = users.map(user => user.name);
userNames.forEach(name => {

    let li = document.createElement('li')
    li.textContent = name
    task2Ul1.appendChild(li)
})

let renderProduct2 = products.map(product => {
    return product.name + " costs $" + product.price
});
renderProduct2.forEach(order => {

    let li = document.createElement('li')
    li.textContent = order
    task2Ul2.appendChild(li)
})



let renderProduct3 = orders.map(product => {
    return product.customer + " ordered $" + product.total
});
renderProduct3.forEach(product => {

    let li = document.createElement('li')
    li.textContent = product
    task2Ul3.appendChild(li)
})


/*
========================================
filter TASKLARI
========================================

1. Demo task:
   users ichidan faqat isActive: true bo'lganlarni ajrating
   va faqat ismlarini DOMga chiqaring.

2. Student task:
   products ichidan faqat inStock: true bo'lganlarni ajrating
   va ularning nomlarini DOMga chiqaring.

3. Student task:
   orders ichidan faqat status === "pending" bo'lganlarni ajrating
   va quyidagi formatda DOMga chiqaring:
   #5001 - Ali
*/

const filterTask1 = document.querySelector("#filterTask1")
const filterTask2 = document.querySelector("#filterTask2")
const filterTask3 = document.querySelector("#filterTask3")

function ShowactiveUsers() {
    let activeUsers = users.filter(user => {
        return user.isActive === true
    })
    activeUsers.forEach(student => {
        let filterLi = document.createElement('li')
        filterLi.textContent = student.name
        filterTask1.appendChild(filterLi)
    })
}
ShowactiveUsers()


function ShowinStock() {

    let inStock = products.filter(sotuvda => sotuvda.inStock === true);

    inStock.forEach(product => {
        let filterLi2 = document.createElement('li');
        filterLi2.textContent = product.name;
        filterTask2.appendChild(filterLi2);
    });
}

ShowinStock();
function isPending() {
    const pendingProducts = orders.filter(item => item.status === "pending");

    pendingProducts.forEach(pending => {
        filterTask3.innerHTML += `<li>${pending.id} - ${pending.customer}</li>`;
    });
}

isPending();
/*
========================================
find TASKLARI
========================================

1. Demo task:
   users ichidan ismi "Madina" bo'lgan userni toping
   va DOMga chiqaring.
   Format:
   Madina is 22 years old

2. Student task:
   products ichidan nomi "Chair" bo'lgan mahsulotni toping
   va DOMga chiqaring.
   Format:
   Chair costs $80

3. Student task:
   orders ichidan id si 5002 bo'lgan orderni toping
   va DOMga chiqaring.
   Format:
   Order #5002 belongs to Madina
*/
const findTask1 = document.getElementById('findTask1');
const findTask2 = document.getElementById('findTask2');
const findTask3 = document.getElementById('findTask3');

let foundUser = users.find((user) => user.name === "Madina");

findTask1.innerHTML = `<p>${foundUser.name} is ${foundUser.age} years old</p>`  
let foundProduct = products.find((product) => product.name === "Chair");


findTask2.innerHTML = `<p>${foundProduct.name} costs $${foundProduct.price}</p>`  
let foundOrder = orders.find((order) => order.id === 5002);

findTask3.innerHTML = `<p>Order #${foundOrder.id} belongs to ${foundOrder.customer}</p>`  