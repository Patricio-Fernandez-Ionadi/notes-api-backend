const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())
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
