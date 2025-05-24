// include.js
document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");

  includes.forEach((el) => {
    const file = el.getAttribute("data-include");
    fetch(file)
      .then((res) => res.text())
      .then((html) => {
        el.innerHTML = html;
      })
      .catch((err) => {
        el.innerHTML = "<p>Error al cargar el archivo: " + file + "</p>";
        console.error(err);
      });
  });
});
