import { stadiums } from "./data.js";
// console.log(stadiums);
let wrapper = document.querySelector(".wrapper");
stadiums.forEach((stadium) => {
  let card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML += `
    <img src="${stadium.imgUrl}">
    <h1>Name: ${stadium.title}</h1>
    <p>Location: <span>${stadium.city}</span></p>
    <p>Club: <span>${stadium.club}</span></p>
  `;
  wrapper.appendChild(card);
});
