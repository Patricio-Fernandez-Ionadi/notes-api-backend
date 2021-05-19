const supertest = require("supertest")
const { app, server } = require("../index")
const api = supertest(app)
const mongoose = require("mongoose")
const Note = require("../models/Note")

const initialNotes = [
	{
		content: "Aprendiendo fullstack js",
		important: true,
		date: new Date(),
	},
	{
		content: "Aplicar lo aprendido en proyectos propios",
		important: true,
		date: new Date(),
	},
]

beforeEach(async () => {
	await Note.deleteMany({})
	const note1 = new Note(initialNotes[0])
	await note1.save()
	const note2 = new Note(initialNotes[1])
	await note2.save()
})

test("notes are returned as json", async () => {
	await api
		.get("/api/notes")
		.expect(200)
		.expect("Content-Type", /application\/json/)
})

test("there are two notes", async () => {
	const response = await api.get("/api/notes")
	expect(response.body).toHaveLength(initialNotes.length)
})

test("some note is about js", async () => {
	const response = await api.get("/api/notes")
	const contents = response.body.map((note) => note.content)
	expect(contents).toContain("Aprendiendo fullstack js")
})

afterAll(() => {
	server.close()
	mongoose.connection.close()
})
