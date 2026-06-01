let form = document.getElementById("add-student-form");
let submit = document.getElementById("submit-btn");
let reset = document.getElementById("reset-btn");
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let phoneInput = document.getElementById("phone");
let websiteInput = document.getElementById("website");
let companyInput = document.getElementById("company");
let cityInput = document.getElementById("city");

let ishchilar = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ishchi = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    website: websiteInput.value,
    company: companyInput.value,
    city: cityInput.value,
  };
  ishchilar.push(ishchi);
  form.reset();
  console.log(ishchilar);
  ishchilar.forEach((ishchi) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
      <i class="fas fa-user"></i>
      <div>
      <h1 class="card-name">${ishchi.name}</h1>
      <p class="card-email">${ishchi.email}</p>
      </div>
      
      </div>
        <div class="card-body">
          <div>Kompaniya: ${ishchi.company}</div>
          <div>Shahar: ${ishchi.city}</div>
        </div>
        <button class="card-button">Batafsil</button>
      `;
    grid.appendChild(card);
  });
});
