const API_LOGIN = "http://localhost:3000/usuarios/login";

async function login() {

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const respuesta = await fetch(API_LOGIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            correo: correo,
            password: password
        })
    });

    const data = await respuesta.json();

    if (data.usuario) {

        localStorage.setItem(
            "usuario",
            JSON.stringify(data.usuario)
        );

        window.location.href = "index.html";

    } else {

        alert("Correo o contraseña incorrectos");

    }
}