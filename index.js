// API = Application Programming Interface
// permiten a traves de endpoints, recuperar, crear, guardar, etc. informacion o recursos

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// LEVANTANDO EL SV

/* const http = require("http") // importacion de modulo => import http from 'http'

const app = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" })
	res.end("Hello world") // respuesta del servidor
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`) */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// USO DE NODEMON
// DEVOLVIENDO CONTENIDO

/* 
// nodemon se instala como dependencia de desarrollo
// ./node_modules/.bin/nodemon ./index.js
// o creando un script en el package.json
// "dev": "nodemon index.js" en el objeto scripts
// se ejecuta desde consola 'npm run dev'

const http = require("http")

let notes = [
	{
		id: 1,
		content: "HTML is super-easy",
		date: "2019-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		date: "2019-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2019-05-30T19:20:14.298Z",
		important: true,
	},
]

const app = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "application/json" })
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
	// los content types le dan semantica al header de la respuesta y en ocaciones hasta la funcionalidad
	res.end(JSON.stringify(notes))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`) */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// USANDO EXPRESS
// METODO GET

/*const express = require("express")

const app = express()
app.use(express.json())

let notes = [
	{
		id: 1,
		content: "HTML is super-easy",
		date: "2019-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		date: "2019-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2019-05-30T19:20:14.298Z",
		important: true,
	},
]

// CUANDO SE HAGA UNA PETICION GET EN EL PATH DEL PRIMER ARGUMENTO, EJECUTAR SEGUNDO ARGUMENTO
app.get("/", (req, res) => {
	res.send("<h1>Hello home</h1>") // la respuesta va a devolver 
})

// especificamos otra respuesta para peticiones get en otra ruta
app.get("/api/notes", (req, res) => {
	res.json(notes)
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
}) */

// RUTAS DINAMICAS

/* const http = require("http")
const express = require("express")

const app = express()
app.use(express.json())

let notes = [
	{
		id: 1,
		content: "HTML is super-easy",
		date: "2019-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		date: "2019-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2019-05-30T19:20:14.298Z",
		important: true,
	},
]

app.get("/", (req, res) => {
	res.send("<h1>Hello home</h1>")
})
app.get("/api/notes", (req, res) => {
	res.json(notes)
})
app.get("/api/notes/:id", (req, res) => {
	// convertimos a numero el parametro recibido ya que siempre será un string y necesitamos un valur numerico
	const id = Number(req.params.id)
	// guardamos en note la busqueda en notes de un objeto cuya id sea igual a la id que llega desde los parametros de la request
	const note = notes.find((note) => note.id === id)

	// hacemos una comprobacion de si tenemos el dato necesitado
	if (note) {
		res.json(note)
	} else {
		// en caso de que la nota no sea encontrada devolveremos un status 404 y finalizamos la peticion
		res.status(404).end()
	}
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
}) */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// METODO POST

/* const express = require("express")

const app = express()
app.use(express.json())

let notes = [
	{
		id: 1,
		content: "HTML is super-easy",
		date: "2019-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		date: "2019-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2019-05-30T19:20:14.298Z",
		important: true,
	},
]

app.get("/", (req, res) => {
	res.send("<h1>Hello home</h1>")
})
app.get("/api/notes", (req, res) => {
	res.json(notes)
})
app.get("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id)
	const note = notes.find((note) => note.id === id)

	if (note) {
		res.json(note)
	} else {
		res.status(404).end()
	}
})

// con insomnia vemos que este recurso funciona, veremos mas adelante como hacer que persista en memoria ya que de momento funciona mientras el servidor no se actualice/reinicie
app.delete("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id)
	notes = notes.filter((note) => note.id !== id)
	res.status(204).end()
})

app.post("/api/notes", (req, res) => {
	// obtenemos el contenido
	const note = req.body

	// asimismo el contenido debe ser obligatorio por lo que si no lo tenemos
	if (!note || !note.content) {
		return res.status(400).json({
			error: "note.content is missing",
		})
	}

	// recuperamos todas las id
	const ids = notes.map((each) => each.id)
	// buscamos el valos maximo de todas las ids
	const maxId = Math.max(...ids)

	// preparamos un objeto para recibir la nota
	const newNote = {
		id: maxId + 1,
		content: note.content,
		important: typeof note.important !== "undefined" ? note.important : false,
		date: new Date().toISOString(),
	}

	// añadimos a notas la nueva nota
	notes = [...notes, newNote]
	// otra forma de añadirlo podria ser con concat()

	res.status(201).json(newNote)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
}) */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MIDDLEWARES

/* const express = require("express")

const app = express()
app.use(express.json())

// las peticiones al llegar al servidor ejecutan el codigo de arriba abajo entrando en donde tenga lugar o el path se lo especifique
app.use((req, res, next) => {
	console.log(req.method)
	console.log(req.path)
	console.log(req.body)
	console.log("-----------")
	// al intentar entrar a la pagina (la primer peticion) se ejecuta por primera vez el codigo, llegado a este punto se quedará a la espera a menos que se lo especifiquemos
	// => next()
	next()
})

let notes = [
	{
		id: 1,
		content: "HTML is super-easy",
		date: "2019-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		date: "2019-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2019-05-30T19:20:14.298Z",
		important: true,
	},
]

app.get("/", (req, res) => {
	res.send("<h1>Hello home</h1>")
})
app.get("/api/notes", (req, res) => {
	res.json(notes)
})
app.get("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id)
	const note = notes.find((note) => note.id === id)

	if (note) {
		res.json(note)
	} else {
		res.status(404).end()
	}
})

app.delete("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id)
	notes = notes.filter((note) => note.id !== id)
	res.status(204).end()
})

app.post("/api/notes", (req, res) => {
	const note = req.body

	if (!note || !note.content) {
		return res.status(400).json({
			error: "note.content is missing",
		})
	}

	const ids = notes.map((each) => each.id)
	const maxId = Math.max(...ids)

	const newNote = {
		id: maxId + 1,
		content: note.content,
		important: typeof note.important !== "undefined" ? note.important : false,
		date: new Date().toISOString(),
	}

	notes = [...notes, newNote]
	res.status(201).json(newNote)
})

// vemos que al hacer una peticion a /api/notes no llega nunca a este punto, y eso es porque no se lo hemops especificado en el callback (podriamos agregarle el tercer parametro next y ejecutarlo al final del bloque, cosa que no sería muy util en ese caso)
// para lo que si nos será util esto es para el 404
app.use((req, res) => {
	// por curiosidad podemos almacenar los path que llegan para usarlos.. por lo que sea XD
	console.log(req.path)

	// cuando intente buscar una ruta inexistente llegará a este punto ya que será el unico lugar donde se le permite entrar al no tener un path especificado
	res.status(404).json({
		error: "Not found",
	})
	// al pasarle .json({}) podemos especificar el error ocurrido
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
}) */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// MODULOS

/* const express = require("express")

const app = express()

// esta funcion que llamaremos mas abajo, la exportamos a un archivo separado por ej loggerMiddleware.js
// const logger = (req, res, next) => {
// 	console.log(req.method)
// 	console.log(req.path)
// 	console.log(req.body)
// 	console.log("-----------")
// 	next()
// }
// por supuesto deberemos importarla
const logger = require("./loggerMiddleware")

app.use(express.json())
app.use(logger)

let notes = [
	{
		id: 1,
		content: "HTML is super-easy",
		date: "2019-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		date: "2019-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2019-05-30T19:20:14.298Z",
		important: true,
	},
]

app.get("/", (req, res) => {
	res.send("<h1>Hello home</h1>")
})
app.get("/api/notes", (req, res) => {
	res.json(notes)
})
app.get("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id)
	const note = notes.find((note) => note.id === id)

	if (note) {
		res.json(note)
	} else {
		res.status(404).end()
	}
})

app.delete("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id)
	notes = notes.filter((note) => note.id !== id)
	res.status(204).end()
})

app.post("/api/notes", (req, res) => {
	const note = req.body

	if (!note || !note.content) {
		return res.status(400).json({
			error: "note.content is missing",
		})
	}

	const ids = notes.map((each) => each.id)
	const maxId = Math.max(...ids)

	const newNote = {
		id: maxId + 1,
		content: note.content,
		important: typeof note.important !== "undefined" ? note.important : false,
		date: new Date().toISOString(),
	}

	notes = [...notes, newNote]
	res.status(201).json(newNote)
})

app.use((req, res) => {
	res.status(404).json({
		error: "Not found",
	})
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
}) */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CROSS ORIGIN

const express = require("express")
const app = express()
// const logger = require("./loggerMiddleware")

// instalamos npm i cors -E
const cors = require("cors")
app.use(cors())
// es un middleware que soluciona problemas de cross-origin
// esto por defecto cualquier origen podrá hacer peticiones a unestra API

app.use(express.json())
// app.use(logger)

let notes = [
	{
		id: 1,
		content: "HTML is super-easy",
		date: "2019-05-30T17:30:31.098Z",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		date: "2019-05-30T18:39:34.091Z",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		date: "2019-05-30T19:20:14.298Z",
		important: true,
	},
]

app.get("/", (req, res) => {
	res.send("<h1>Hello home</h1>")
})
app.get("/api/notes", (req, res) => {
	res.json(notes)
})
app.get("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id)
	const note = notes.find((note) => note.id === id)

	if (note) {
		res.json(note)
	} else {
		res.status(404).end()
	}
})

app.delete("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id)
	notes = notes.filter((note) => note.id !== id)
	res.status(204).end()
})

app.post("/api/notes", (req, res) => {
	const note = req.body

	if (!note || !note.content) {
		return res.status(400).json({
			error: "note.content is missing",
		})
	}

	const ids = notes.map((each) => each.id)
	const maxId = Math.max(...ids)

	const newNote = {
		id: maxId + 1,
		content: note.content,
		important: typeof note.important !== "undefined" ? note.important : false,
		date: new Date().toISOString(),
	}

	notes = [...notes, newNote]
	res.status(201).json(newNote)
})

app.use((req, res) => {
	res.status(404).json({
		error: "Not found",
	})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// semantica de versionado
// major.minor.patch
// cambio de contrato (major): cambio estructural que rompe la compatibilidad con versiones anteriores
// new Feature (minor): añadido de contenido o funcionalidad
// patch : reparacion de alguna funcionalidad, no agrega ni cambia funcionalidad

// instalado heroku => heroku create
// git remote show origin
