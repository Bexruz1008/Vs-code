const grid = document.getElementById("grid");
let searchInput = document.getElementById("search");

fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((users) => {
    if (!grid) return;

    users.forEach((user) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
      <div class="card-header">
      <i class="fas fa-user"></i>
      <div>
      <h1 class="card-name">${user.name}</h1>
      <p class="card-email">${user.email}</p>
      </div>
      
      </div>
        <div class="card-body">
          <div>Kompaniya: ${user.company.name}</div>
          <div>Shahar: ${user.address.city}</div>
        </div>
        <button class="card-button">Batafsil</button>
      `;
      grid.appendChild(card);
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const searchResult = this.value.toLowerCase();
        const cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
          const name = card
            .querySelector(".card-name")
            .textContent.toLowerCase();
          if (name.includes(searchResult)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    }
  });
