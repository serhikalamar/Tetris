const canvas = document.getElementById("tetris");
const lienzo = canvas.getContext("2d");

const siguienteCanvas = document.getElementById("siguiente");
const siguienteLienzo = siguienteCanvas.getContext("2d");

let nivel = 1; // Nivel inicial
let velocidadBase = 500; // Tiempo base de caída en milisegundos
let velocidadActual = velocidadBase; // Velocidad ajustada según el nivel





const dibujarSiguientePieza = (pieza, lienzo) => {
    lienzo.clearRect(0, 0, lienzo.canvas.width, lienzo.canvas.height);

    const bloqueSize = 20; // Tamaño de los bloques

    // Calcula el desplazamiento para centrar la pieza
    const piezaAncho = pieza.forma[0].length * bloqueSize; // Ancho de la pieza
    const piezaAlto = pieza.forma.length * bloqueSize;     // Alto de la pieza

    const offsetX = (lienzo.canvas.width - piezaAncho) / 2; // Desplazamiento horizontal
    const offsetY = (lienzo.canvas.height - piezaAlto) / 2; // Desplazamiento vertical

    // Dibuja la pieza centrada
    pieza.forma.forEach((fila, y) => {
        fila.forEach((bloque, x) => {
            if (bloque) {
                lienzo.fillStyle = pieza.color;
                lienzo.fillRect(
                    offsetX + x * bloqueSize, // Posición centrada en X
                    offsetY + y * bloqueSize, // Posición centrada en Y
                    bloqueSize,
                    bloqueSize
                );

                // Opcional: dibuja bordes
                lienzo.strokeStyle = "#000";
                lienzo.strokeRect(
                    offsetX + x * bloqueSize,
                    offsetY + y * bloqueSize,
                    bloqueSize,
                    bloqueSize
                );
            }
        });
    });
};


let puntuacion = 0; 
let piezaActiva = null; // La pieza que está en el tablero
let piezaSiguiente = null; // La pieza que se muestra como próxima pieza

const tablero = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
];


class Tablero {
    constructor(){
        this.filas = 20;
        this.columnas = 10;
        this.Tcelda = 30;
    }
    dibujarTablero(lienzo, piezas) {
        lienzo.clearRect(0, 0, lienzo.canvas.width, lienzo.canvas.height); // Limpiar el canvas
    
        // Dibujar las celdas del tablero
        for (let fila = 0; fila < this.filas; fila++) {
            for (let columna = 0; columna < this.columnas; columna++) {
                if (tablero[fila][columna]) {
                    lienzo.fillStyle = "gray"; // Color de las celdas ocupadas
                    lienzo.fillRect(
                        columna * this.Tcelda,
                        fila * this.Tcelda,
                        this.Tcelda,
                        this.Tcelda
                    );
                }
                lienzo.strokeStyle = "#ddd"; // Líneas del tablero
                lienzo.strokeRect(
                    columna * this.Tcelda,
                    fila * this.Tcelda,
                    this.Tcelda,
                    this.Tcelda
                );
            }
        }
    }
}
const miTablero = new Tablero();
canvas.width = miTablero.columnas * miTablero.Tcelda;
canvas.height = miTablero.filas * miTablero.Tcelda;


const piezas = [
    {
        posicion: { x: 4, y: 2 },
        forma: [[1, 1], [1, 1]],
        nombre: "O",
        color: "green",
        probabilidad: 0.25,
        puntuacion: 150,
    },
    {
        posicion: { x: 4, y: 0 },
        forma: [[1, 1, 1, 1]],
        nombre: "I",
        color: "cyan",
        probabilidad: 0.20,
        puntuacion: 300,
    },
    {
        posicion: { x: 4, y: 0 },
        forma: [[0, 1, 1], [1, 1, 0]],
        nombre: "S",
        color: "red",
        probabilidad: 0.15,
        puntuacion: 250,
    },
    {
        posicion: { x: 4, y: 0 },
        forma: [[1, 1, 0], [0, 1, 1]],
        nombre: "Z",
        color: "yellow",
        probabilidad: 0.15,
        puntuacion: 250,
    },
    {
        posicion: { x: 4, y: 0 },
        forma: [[1, 0, 0], [1, 1, 1]],
        nombre: "L",
        color: "orange",
        probabilidad: 0.10,
        puntuacion: 200,
    },
    {
        posicion: { x: 4, y: 0 },
        forma: [[0, 0, 1], [1, 1, 1]],
        nombre: "J",
        color: "blue",
        probabilidad: 0.10,
        puntuacion: 200,
    },
    {
        posicion: { x: 4, y: 0 },
        forma: [[0, 1, 0], [1, 1, 1]],
        nombre: "T",
        color: "purple",
        probabilidad: 0.05,
        puntuacion: 300,
    }
];




/*
const pieza2 = new Pieza("#red","C",[[1,1,1],[1,0,1]],0.5,70);
const pieza4 = new Pieza("#blue","Z",[[0,1,1],[0,1,0],[1,1,0]],0.25,150);
const pieza3 = new Pieza("#violet","L",[[1,0,0],[1,0,0],[1,1,1]],0.25,150);
const pieza5 = new Pieza("pink","T",[[1,1,1],[0,1,0],[0,1,1]],0.30,150);
*/


const dibujarPieza = (pieza, lienzo, tablero) => {
    for (let y = 0; y < pieza.forma.length; y++) {
        for (let x = 0; x < pieza.forma[y].length; x++) {
            if (pieza.forma[y][x]) {
                lienzo.fillStyle = pieza.color;
                lienzo.fillRect(
                    (pieza.posicion.x + x) * tablero.Tcelda,
                    (pieza.posicion.y + y) * tablero.Tcelda,
                    tablero.Tcelda,
                    tablero.Tcelda
                );
            }
        }
    }
};
// Función para rotar una pieza
const rotarPieza = (pieza) => {
    const nuevaForma = pieza.forma[0].map((_, i) =>
        pieza.forma.map(row => row[i]).reverse()
    );
    const nuevaPieza = { ...pieza, forma: nuevaForma };

    // Verificar colisiones antes de aplicar la rotación
    if (!chequearColisiones(nuevaPieza, tablero)) {
        pieza.forma = nuevaForma;
    }
};


document.addEventListener("keydown", (event) => {
    const nuevaPosicion = { ...piezaActiva.posicion }; // Usar la pieza activa en lugar de piezas[0][0]

    // Mover la pieza según la tecla presionada
    if (event.key === "a") nuevaPosicion.x--; // Mover a la izquierda
    if (event.key === "d") nuevaPosicion.x++; // Mover a la derecha
    if (event.key === "s") nuevaPosicion.y++; // Mover hacia abajo
    if (event.key === "w") rotarPieza(piezaActiva); // Rotar la pieza

    // Verificar colisiones antes de mover la pieza
    if (!chequearColisiones({ ...piezaActiva, posicion: nuevaPosicion }, tablero)) {
        piezaActiva.posicion = nuevaPosicion; // Si no hay colisión, actualiza la posición de la pieza activa
    }
});


const chequearColisiones = (pieza, tablero) => {
    const { forma, posicion } = pieza;

    for (let y = 0; y < forma.length; y++) {
        for (let x = 0; x < forma[y].length; x++) {
            if (forma[y][x] !== 0) { // Si la celda de la pieza no está vacía
                const tableroX = posicion.x + x;
                const tableroY = posicion.y + y;

                // Verificar límites del tablero
                if (
                    tableroX < 0 || // Límite izquierdo
                    tableroX >= tablero[0].length || // Límite derecho
                    tableroY < 0 || // Límite superior
                    tableroY >= tablero.length // Límite inferior
                ) {
                    return true; // Hay colisión
                }

                // Verificar colisión con otra pieza
                if (tablero[tableroY][tableroX] !== 0) {
                    return true; // Hay colisión
                }
            }
        }
    }

    return false; // No hay colisión
};
const fijarPieza = (pieza, tablero) => {
    for (let y = 0; y < pieza.forma.length; y++) {
        for (let x = 0; x < pieza.forma[y].length; x++) {
            if (pieza.forma[y][x]) {
                tablero[pieza.posicion.y + y][pieza.posicion.x + x] = true; // Marca las celdas ocupadas
            }
        }
    }

    borrarLineas(tablero); // Llamar a la función para borrar las líneas completas
    actualizarPuntuacion(); // Actualizar la puntuación
};


// Función para borrar las líneas completas y actualizar el tablero
const borrarLineas = (tablero) => {
    let lineasBorradas = 0;

    for (let fila = tablero.length - 1; fila >= 0; fila--) {
        if (tablero[fila].every(celda => celda !== 0)) { // Si la fila está completa
            lineasBorradas++;

            // Mover las filas superiores hacia abajo
            for (let i = fila; i >= 1; i--) {
                tablero[i] = [...tablero[i - 1]]; // Copiar la fila superior
            }

            // Limpiar la fila superior (ahora vacía)
            tablero[0] = Array(tablero[0].length).fill(0);
            fila++; // Comprobar de nuevo la fila actual, ya que se ha movido
        }
    }

    // Sumar puntos por las líneas borradas
    if (lineasBorradas > 0) {
        puntuacion += lineasBorradas * 100; // 100 puntos por cada línea eliminada
        actualizarPuntuacion();
    }
};

// Función para actualizar el valor de la puntuación en el HTML
const actualizarPuntuacion = () => {
    const puntuacionElemento = document.querySelector("p"); // Seleccionamos la etiqueta <p> del HTML
    puntuacionElemento.textContent = `Puntuación: ${puntuacion} | Nivel: ${nivel}`;

    // Aumentar nivel cada 500 puntos (ajusta este valor según prefieras)
    const nuevoNivel = Math.floor(puntuacion / 500) + 1;
    if (nuevoNivel > nivel) {
        nivel = nuevoNivel;
        ajustarVelocidad();
    }
};
const ajustarVelocidad = () => {
    // Reduce el intervalo de caída (limita un mínimo de 100ms para evitar que sea imposible)
    velocidadActual = Math.max(100, velocidadBase - (nivel - 1) * 50);
    console.log(`Nuevo nivel: ${nivel}, Velocidad: ${velocidadActual}ms`);
};

const generarNuevaPieza = () => {
    // Selecciona aleatoriamente una nueva pieza para la activa
    const indiceActiva = Math.floor(Math.random() * piezas.length);
    const nuevaPiezaActiva = { ...piezas[indiceActiva] }; // Copia de la pieza activa

    // Reinicia su posición inicial
    nuevaPiezaActiva.posicion = { x: 4, y: 0 };

    // Verifica si hay colisión al generar la pieza activa (Game Over)
    if (chequearColisiones(nuevaPiezaActiva, tablero)) {
        alert("Game Over, este juego esta desarrollado por Sergi Martinez");
        return; // Detener el juego o manejar el fin del juego aquí
    }

    // Asigna la nueva pieza activa
    piezaActiva = nuevaPiezaActiva;

    // Selecciona aleatoriamente una nueva pieza para la próxima pieza
    const indiceSiguiente = Math.floor(Math.random() * piezas.length);
    const nuevaPiezaSiguiente = { ...piezas[indiceSiguiente] }; // Copia de la próxima pieza

    // Asigna la nueva pieza como la pieza siguiente
    piezaSiguiente = nuevaPiezaSiguiente;

    // Actualiza el lienzo de la próxima pieza
    dibujarSiguientePieza(piezaSiguiente, siguienteLienzo);
};

let lastDropTime = 0; // Tiempo de la última caída
const dropInterval = 500; 
const jugar = (time) => {
    const timeDelta = time - lastDropTime;

    // Si ha pasado el intervalo de caída, mueve la pieza hacia abajo
    if (timeDelta > dropInterval) {
        lastDropTime = time;

        // Si no hay pieza activa, genera una nueva pieza
        if (!piezaActiva) {
            generarNuevaPieza(); // Esto ahora genera dos piezas: una activa y una siguiente
        }

        const nuevaPosicion = { ...piezaActiva.posicion, y: piezaActiva.posicion.y + 1 };

        // Intentar mover la pieza hacia abajo
        if (!chequearColisiones({ ...piezaActiva, posicion: nuevaPosicion }, tablero)) {
            piezaActiva.posicion = nuevaPosicion; // Mueve la pieza hacia abajo
        } else {
            // Si la pieza no puede moverse hacia abajo, fijarla y generar una nueva pieza
            fijarPieza(piezaActiva, tablero);

            // Al fijar la pieza activa, la próxima pieza pasa a ser activa y generamos una nueva para la siguiente
            piezaActiva = piezaSiguiente;
            generarNuevaPieza(); // Genera una nueva pieza para la próxima
        }
    }

    // Dibujar el tablero y la pieza activa
    miTablero.dibujarTablero(lienzo); // Solo dibujamos el tablero
    if (piezaActiva) {
        dibujarPieza(piezaActiva, lienzo, miTablero); // Dibuja la pieza activa
    }

    // Solicitar el siguiente frame
    window.requestAnimationFrame(jugar);
};