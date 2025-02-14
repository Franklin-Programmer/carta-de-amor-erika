const envoltura = document.querySelector(".envoltura-sobre");
const carta = document.querySelector(".carta");
const cancion = document.getElementById("cancion");
const letrasCancion = document.getElementById("letras-cancion");

let letras = []; // Guardará las líneas del archivo LRC

// 📌 Cargar el archivo LRC
async function cargarLetrasLRC(url) {
    const respuesta = await fetch(url);
    const texto = await respuesta.text();
    procesarLRC(texto);
}

// 📌 Procesar el archivo LRC
function procesarLRC(lrc) {
    const lineas = lrc.split("\n");
    letras = lineas.map(linea => {
        const match = linea.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            const tiempo = parseInt(match[1]) * 60 + parseFloat(match[2]);
            const texto = match[3].trim();
            return { tiempo, texto };
        }
    }).filter(Boolean);
}

// 📌 Mostrar la letra sincronizada con la canción
function mostrarLetras() {
    const tiempoActual = cancion.currentTime;
    let letraActual = "";

    for (let i = 0; i < letras.length; i++) {
        if (tiempoActual >= letras[i].tiempo) {
            letraActual = letras[i].texto;
        } else {
            break;
        }
    }

    letrasCancion.innerHTML = letraActual;
}

// Sincronizar letras con la canción
cancion.addEventListener("timeupdate", mostrarLetras);

// 📌 Evento de interacción con la carta
document.addEventListener("click", (e) => {
    if (e.target.matches(".sobre") || 
        e.target.matches(".solapa-derecha") ||
        e.target.matches(".solapa-izquierda") ||
        e.target.matches(".corazon")) {
        
        envoltura.classList.toggle("abierto");

    } else if (e.target.matches(".sobre *")) {
        if (!carta.classList.contains("abierta")) {
            carta.classList.add("mostrar-carta");

            setTimeout(() => {
                carta.classList.remove("mostrar-carta");
                carta.classList.add("abierta");
                cancion.play(); // 📌 Reproducir canción al abrir la carta
            }, 500);

            envoltura.classList.add("desactivar-sobre");
        } else {
            carta.classList.add("cerrando-carta");
            envoltura.classList.remove("desactivar-sobre");

            setTimeout(() => {
                carta.classList.remove("cerrando-carta");
                carta.classList.remove("abierta");
                cancion.pause(); // 📌 Pausar la canción al cerrar la carta
                cancion.currentTime = 0; // Reiniciar la canción
                letrasCancion.innerHTML = ""; // Limpiar las letras
            }, 500);
        }
    } 
});

// 📌 Cargar el archivo LRC (debes tener el archivo en la misma carpeta)
cargarLetrasLRC("Billie Eilish - BIRDS OF A FEATHER.lrc");
