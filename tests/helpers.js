const { app } = require("../index")
const supertest = require("supertest")
const api = supertest(app)

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

const getAllContentFromNotes = async () => {
	const response = await api.get("/api/notes")
	return {
		contents: response.body.map((note) => note.content),
		response,
	}
}

module.exports = { initialNotes, api, getAllContentFromNotes }
