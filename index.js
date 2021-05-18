require("dotenv").config()
require("./mongo")
const Note = require("./models/Note")
const express = require("express")
const app = express()
const cors = require("cors")
//
const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")

app.use(cors())
app.use(express.json())

Sentry.init({
	dsn: "https://7124861b11f94094be271644c6c9ed94@o686739.ingest.sentry.io/5772881",
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Tracing.Integrations.Express({ app }),
	],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,
})

app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get("/", (req, res) => {
	res.send("<h1>Hello home</h1>")
})

app.get("/api/notes", (req, res) => {
	Note.find({}).then((notes) => {
		res.json(notes)
	})
})

app.get("/api/notes/:id", (req, res, next) => {
	const { id } = req.params
	Note.findById(id)
		.then((note) => {
			return note ? res.json(note) : res.status(404).end()
			// if (note) {
			// 	return res.json(note)
			// } else {
			// 	res.status(404).end()
			// }
		})
		.catch(next)
})

app.put("/api/notes/:id", (req, res, next) => {
	const { id } = req.params
	const note = req.body

	const newNoteInfo = {
		content: note.content,
		important: note.important,
	}
	// cuando se usa el metodo findByIdAndUpdate() lo que nos devuelve es lo que ha encontrado por id y no el nuevo contenido actualizado
	// le pasamos un objeto como tercer parametro con la key 'new' y el value true, y asi nos devolverá el objeto actualizado
	Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then((response) => {
		res.json(response)
	})
})

app.delete("/api/notes/:id", (req, res, next) => {
	const { id } = req.params

	Note.findByIdAndDelete(id)
		.then(() => res.status(204).end())
		.catch(next)
})

app.post("/api/notes", (req, res) => {
	const note = req.body

	if (!note || !note.content) {
		return res.status(400).json({
			error: "note.content is missing",
		})
	}

	const newNote = new Note({
		content: note.content,
		important: typeof note.important !== "undefined" ? note.important : false,
		date: new Date().toISOString(),
	})

	newNote.save().then((savedNote) => {
		res.json(savedNote)
	})

	res.status(201).json(newNote)
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

// moveremos esto a un archivo externo por ejemplo notFound.js en una carpeta middlewares
// app.use((req, res, next) => {
// 	res.status(404).end()
// })
const notFound = require("./middlewares/notFound") // esto deberia importarse arriba
app.use(notFound)

// entrará a este middleware cuando llegue un error como parametro
// app.use((err, req, res, next) => {
// 	console.error(err)
// 	if (err.name === "CastError") {
// 		res.status(400).send({ error: "id used is malformed" })
// 	} else {
// 		res.status(500).end()
// 	}
// })
const handleErrors = require("./middlewares/handleErrors")
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
