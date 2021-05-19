require("dotenv").config()
require("./mongo")
// base
const express = require("express")
const app = express()
// serv
const cors = require("cors")
// Schema
const Note = require("./models/Note")
// errors
const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")
const handleErrors = require("./middlewares/handleErrors")
const notFound = require("./middlewares/notFound")

app.use(cors())
app.use(express.json())
//
Sentry.init({
	dsn: "https://7124861b11f94094be271644c6c9ed94@o686739.ingest.sentry.io/5772881",
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
	],
	tracesSampleRate: 1.0,
})
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

//
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
		.then((note) => (note ? res.json(note) : res.status(404).end()))
		.catch(next)
})

app.put("/api/notes/:id", (req, res, next) => {
	const { id } = req.params
	const note = req.body

	const newNoteInfo = {
		content: note.content,
		important: note.important,
	}
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

app.use(Sentry.Handlers.errorHandler())

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
