const API_REGISTRO = "http://localhost:3000/usuarios/registro";

async function registrarUsuario() {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const respuesta = await fetch(API_REGISTRO, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            correo: correo,
            password: password
        })
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
        alert("Usuario registrado correctamente");
        window.location.href = "login.html";
    } else {
        alert(data.mensaje);
    }
}