const { server } = require("../index")
const mongoose = require("mongoose")
const Note = require("../models/Note")
const { initialNotes, api, getAllContentFromNotes } = require("./helpers")

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

test("a valid note can be added", async () => {
	const newNote = {
		content: "viendo async/await nuevamente XD",
		imporntant: true,
	}
	await api
		.post("/api/notes")
		.send(newNote)
		// .expect(201)
		.expect(200)
		.expect("Content-Type", /application\/json/)

	const { contents, response } = await getAllContentFromNotes()

	expect(response.body).toHaveLength(initialNotes.length + 1)
	expect(contents).toContain(newNote.content)
})

test("a note without content cant be added", async () => {
	const newNote = {
		imporntant: true,
	}
	await api.post("/api/notes").send(newNote).expect(400)

	const response = await api.get("/api/notes")
	expect(response.body).toHaveLength(initialNotes.length)
})

test("a note can be deleted", async () => {
	const { response } = await getAllContentFromNotes()
	const { body: notes } = response
	const noteToDelete = notes[0]

	await api.delete(`/api/notes/${noteToDelete.id}`)

	expect(204)

	const { response: secondResponse, contents } = await getAllContentFromNotes()

	expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
	expect(contents).not.toContain(noteToDelete.content)
})

/* test("a note that do not exist can not be deleted", async () => {
	await api.delete(`/api/notes/123454`).expect(400)

	const { response } = await getAllContentFromNotes()

	expect(response.body).toHaveLength(initialNotes.length)
}) */

afterAll(() => {
	server.close()
	mongoose.connection.close()
})
