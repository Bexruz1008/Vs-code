const list = document.getElementById("list");

// fetch("https://pokeapi.co/api/v2/pokemon/")
//     .then((response) => response.json())
//     .then((data) => {
//       data.results.forEach((item) => {
//         const li = document.createElement("li");
//         li.textContent = item.name;
//         list.appendChild(li);
//       });
//     })

fetch("https://dummyjson.com/products/")
  .then((response) => response.json())
  .then((data) => {
    data.products.forEach((item) => {
      list.innerHTML += `<div class="card">
      <h3>Nomi: ${item.title}</h3>
      <h4>#${item.id}</h4>
        <p>${item.description}</p>
        <h2>Narxi: ${item.price}$</h2>
        </div>`;
    });
  });
