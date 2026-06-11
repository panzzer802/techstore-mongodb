const usuario = localStorage.getItem("usuario");

if (!usuario) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
}