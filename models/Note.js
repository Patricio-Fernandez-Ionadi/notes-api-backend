const { Schema, model } = require("mongoose")

const noteSchema = new Schema({
	content: String,
	date: Date,
	important: Boolean,
})

// cambiamos el metodo toJSON del Schema para que nos parsee bien la id generada por mongo
noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		// el delete normalmente es una mala practica pero en este caso no pasa nada ya que no está mutando el objeto original directamente y lo hace antes de devolverlo
		delete returnedObject._id
		delete returnedObject.__v
	},
})

const Note = model("Note", noteSchema)

// const note = new Note({
// 	content: "Messirve una banda esto",
// 	date: new Date(),
// 	important: true,
// })

// note
// 	.save()
// 	.then((res) => {
// 		console.log(res)

// 		mongoose.connection.close()
// 	})
// 	.catch((err) => {
// 		console.log(err)
// 	})

// Note.find({}).then((res) => {
// 	console.log(res)
// 	mongoose.connection.close()
// })
module.exports = Note
