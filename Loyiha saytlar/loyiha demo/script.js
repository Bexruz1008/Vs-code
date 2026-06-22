const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");

if (grid) {
  const createCard = (user) => {
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
        <div>Kompaniya: ${user.company?.name ?? user.company ?? "-"}</div>
        <div>Shahar: ${user.address?.city ?? user.city ?? "-"}</div>
      </div>
      <button class="card-button">Batafsil</button>
    `;
    return card;
  };

  const renderCards = (users) => {
    grid.innerHTML = "";
    users.forEach((user) => grid.appendChild(createCard(user)));
  };

  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((users) => {
      const savedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      renderCards([...users, ...savedEmployees]);
    })
    .catch(() => {
      const savedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      renderCards(savedEmployees);
    });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchResult = this.value.toLowerCase();
      const cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        const name = card.querySelector(".card-name").textContent.toLowerCase();
        card.style.display = name.includes(searchResult) ? "block" : "none";
      });
    });
  }
}
