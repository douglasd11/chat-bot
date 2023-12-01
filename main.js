let usuario
let estado = 0
let container_chat = document.getElementById('chat')

const setEstado = (valor) => {
    estado = valor;
}

let mensajes = {
    bienvenida: "Bienvenidos a la pestaña de login desea ingresar o registrarse",
    usuario: "Ingresa el usuario: ",
    usuarioExiste: "Este usuario ya existe ingrese otro por favor: ",
    contrasena: "Ingresa la contraseña: ",
    usuarioRegistrado: "Registro exitoso ahora puedes ingresar.",
    inicioCorrecto: "Inicio de sesion correcto",
    inicioIncorrecto: "Usuario o contraseña incorrectos por favor vuelva a ingresar",
    menu: "te estare asesorando sobre tus compras y pedidos el dia de hoy, ingresa las opciones de menu:",
    asesor: "El siguiente asesor te ayudara",
    adios: "Hasta luego.",
    opcionIncorrecta: "Opcion incorrecta.",
    catalogo: "Nuestro catalogo de compra se clasifica en: "
}

let acciones = {
    login: [
            {
                nombre: 'Registrarse', handle: 'handleBtnRegister'
            },
            {
                nombre: 'Iniciar sesion', handle: 'handleBtnIniciar'
            }
    ],
    asesor: [
            {
                nombre: 'Asesor', handle: 'handleBtnAsesor'
            },
            {
                nombre: 'Volver', handle: 'handleBtnVolver'
            }
    ],
    catalogo: [
            {
                nombre: 'Comida', handle: 'handleBtnComida'
            },
            {
                nombre: 'Ropa', handle: 'handleBtnRopa'
            },
            {
                nombre: 'Belleza', handle: 'handleBtnBelleza'
            },
            {
                nombre: 'Otros', handle: 'handleBtnOtros'
            }
    ]
}


const enviarMensaje = (mensaje) => {
    try {
        container_chat.innerHTML += `<div class="message">
            <div class="text">
                <p>${ mensaje }</p>
            </div>
        </div>`
    } catch (error) {
    }
    container_chat.scrollTop=container_chat.scrollHeight;
}

const enviarMensajeUser = (mensaje) => {
    try {
        container_chat.innerHTML += `<div class="message">
        <div class="input-wrapper">
            <div class="text-user">
                <p>${ mensaje }</p>
            </div>
        </div>`
    } catch (error) {
    }
}

const enviarMensajeClave = (mensaje) => {

    let size = mensaje.length
    let clave = ''
    for(let i=0; i<size; i++){
        clave += '*'
    }

    try {
        container_chat.innerHTML += `<div class="message">
        <div class="input-wrapper">
            <div class="text-user">
                <p>${ clave }</p>
            </div>
        </div>`
    } catch (error) {
    }
}

const enviarBotones = (data) => {
    try {
        let content = `<div class="msg-buttons">`
        if(data[0].nombre == 'Comida'){
            content = `<div class="msg-buttons special">`
        }
        data.map((item) => {
            content += `<div class="single-button" onclick="${item.handle}()">
            <span>${item.nombre}</span></div>`
        })
        content += `</div>`
        container_chat.innerHTML += content

        // agregarEventos()
    } catch (error) {
            
    }
}

const respWenBot = () => {

    switch (estado) {
        case 0:
            enviarMensaje(mensajes.bienvenida)
            enviarBotones(acciones.login)
            break;
        case 1:
            enviarMensaje(mensajes.usuario)
            break;
        case 2:
            enviarMensaje(mensajes.usuario)
            break;
        case 3:
            enviarMensaje(mensajes.contrasena)
            break;
        case 4:
            enviarMensaje(mensajes.contrasena)
            break;
        case 5:
            enviarMensajeCatalogo()
            break;
        default:
            break;
    }
}

respWenBot();


function validarExisteUsuario(user) {

    let status = true

    fetch("https://api-chatbot-omiw.onrender.com/api/usuario/obtenerUsuarios")
    .then((response) => response.json())
    .then((response) => {

        response.forEach((item) => {
            if(item.usuario == user){
                status = false
            }
        });
    });

    if(status){
        setEstado(3)
        usuario = user
        respWenBot()
    }
    else{
        enviarMensaje(mensajes.usuarioExiste)
        setEstado(2)
    }
    
    return status;
}

function registrarUsuario (clave) {

    fetch("https://api-chatbot-omiw.onrender.com/api/usuario/agregarUsuario", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
            usuario: usuario,
            clave: clave
        })
    })

    enviarMensaje(mensajes.usuarioRegistrado)
    setEstado(0)
    respWenBot()
}

function capturarUsuario (user) {
    usuario = user
    setEstado(4)
    respWenBot()
}

function loguearUsuario (clave) {

    let status = false

    fetch("https://api-chatbot-omiw.onrender.com/api/usuario/obtenerUsuarios")
    .then((response) => response.json())
    .then((response) => {
        
        console.log("datos: ", usuario, clave)
        response.forEach((item) => {
            console.log(item)
            if(item.usuario == usuario && item.clave == clave){
                status = true
            }
        });

        if(status) {
            enviarMensaje(mensajes.inicioCorrecto)
            setEstado(5)
            respWenBot()
        }
        else{
            enviarMensaje(mensajes.inicioIncorrecto)
            setEstado(0)
            respWenBot()
        }
    });

}

function menuOpcion(opcion) {

    switch (opcion) {
        case '1':
            enviarMensaje(mensajes.catalogo)
            enviarBotones(acciones.catalogo)
            setEstado(7)
            break;
        case '2':
            enviarMensaje(mensajes.asesor)
            enviarBotones(acciones.asesor)
            setEstado(6)
            break;
        case '3':
            enviarMensaje(mensajes.adios)
            setEstado(0)
            respWenBot()
            break;
        default:
            enviarMensaje(mensajes.opcionIncorrecta)
            setEstado(5)
            respWenBot()
            break;
    }
}

const enviarMensajeProd = (item) => {
    try {
        container_chat.innerHTML += `<div class="message">
            <div class="text">
                <p>Id: ${ item.id }</p>
                <p>Nombre: ${ item.nombre }</p>
                <p>Descripcion: ${ item.descripcion }</p>
                <p>Precio: ${ item.precio }</p>
                <p>Stock: ${ item.stock }</p>
                <img src='${ item.imagen }'>
            </div>
        </div>`
    } catch (error) { 
    }
    container_chat.scrollTop=container_chat.scrollHeight;
}

const enviarMensajeCatalogo = () => {
    try {
        container_chat.innerHTML += `<div class="message">
            <div class="text">
                <p> Hola ${ usuario }, ${ mensajes.menu }</p>
                <p>1. Catalogo de compra </p>
                <p>2. Dudas </p>
                <p>3. Salir </p>
            </div>
        </div>`
    } catch (error) { 
    }
    container_chat.scrollTop=container_chat.scrollHeight;
}

function listarProductos (categoria) {

    fetch("https://api-chatbot-omiw.onrender.com/api/producto/obtenerProductos")
    .then((response) => response.json())
    .then((response) => {
        
        response.forEach((item) => {
            if (item.categoria == categoria) {
                enviarMensajeProd(item)
            }
        });

        setEstado(5)
        respWenBot()
    });
}


// eventos -------------------------------------------------------------------

try {
    var text_resp = document.getElementById("text_resp");
    var btn_send = document.getElementById("btn_send");

    if(btn_send){
        btn_send.addEventListener("click", () => {

            let valorInput = text_resp.value
            if(valorInput !== ''){
                if(estado == 3 || estado == 4){
                    enviarMensajeClave(valorInput)
                }
                else{
                    enviarMensajeUser(valorInput)
                }
                

                switch (estado) {
                    case 1:
                        capturarUsuario(valorInput)
                        break;
                    case 2:
                        validarExisteUsuario(valorInput)
                        break;
                    case 3:
                        registrarUsuario(valorInput)
                        break;
                    case 4:
                        loguearUsuario(valorInput)
                        break;
                    case 5:
                        menuOpcion(valorInput)
                        break;
                
                    default:
                        break;
                }

                console.log(text_resp.value)
                text_resp.value = ''
                container_chat.scrollTop=container_chat.scrollHeight;
            }
        });
    }
} catch (error) {
}


function handleBtnRegister () {
    if(estado == 0){
        setEstado(2)
        respWenBot()
    }
}

function handleBtnIniciar () {
    if(estado == 0){
        setEstado(1)
        respWenBot()
    }
}

function handleBtnAsesor () {
    if(estado == 6){
        location.href ='https://api.whatsapp.com/send/?phone=573003285430&text=Hola,%20me%20gustaria%20obtener%20m%C3%A1s%20informaci%C3%B3n&type=phone_number&app_absent=0';
    }
}

function handleBtnVolver () {
    if(estado == 6){
        setEstado(5)
        respWenBot()
    }
}

// -------------------------------------------------------------------

function handleBtnComida () {
    if(estado == 7){
        listarProductos('comida')
    }
}

function handleBtnRopa () {
    if(estado == 7){
        listarProductos('ropa')
    }
}

function handleBtnBelleza () {
    if(estado == 7){
        listarProductos('belleza')
    }
}

function handleBtnOtros () {
    if(estado == 7){
        listarProductos('otros')
    }
}