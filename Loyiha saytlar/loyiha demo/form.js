const form = document.getElementById("add-student-form");

if (form) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const websiteInput = document.getElementById("website");
  const companyInput = document.getElementById("company");
  const cityInput = document.getElementById("city");
  let reset = document.getElementById("reset-btn")

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newEmployee = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      website: websiteInput.value.trim(),
      company: companyInput.value.trim(),
      city: cityInput.value.trim(),
    };

    const savedEmployees = JSON.parse(
      localStorage.getItem("employees") || "[]",
    );
    savedEmployees.push(newEmployee);
    localStorage.setItem("employees", JSON.stringify(savedEmployees));

    form.reset();
    alert("Yangi xodim muvaffaqiyatli qo'shildi!");
    winow.location.href = "./index.html";
  });
  
}
reset.addEventListener("click", ()=>{
    savedEmployees.pop(newEmployee);
}
)
