require("dotenv").config()
require("./mongo")
const express = require("express")
const app = express()
const cors = require("cors")
const Note = require("./models/Note")
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

app.get("/api/notes/:id", async (req, res, next) => {
	const { id } = req.params
	const note = await Note.findById(id)
	try {
		return res.json(note)
	} catch (e) {
		next(e)
	}
	res.status(404).end()
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

app.delete("/api/notes/:id", async (req, res, next) => {
	const { id } = req.params
	await Note.findByIdAndDelete(id)
	res.status(204).end()
})

app.post("/api/notes", async (req, res, next) => {
	const note = req.body

	if (!note.content) {
		return res.status(400).json({
			error: "note.content is missing",
		})
	}

	const newNote = new Note({
		content: note.content,
		important: note.important || false,
		date: new Date(),
	})

	try {
		const savedNote = await newNote.save()
		res.json(savedNote)
	} catch (err) {
		next(err)
	}
})

app.use(Sentry.Handlers.errorHandler())

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
