const mongoose = require("mongoose")

const connectionString = process.env.MONGO_DB_URI

// conexion a mongo
mongoose
	.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})

	.then(() => {
		console.log("Database Conected")
	})
	.catch((err) => {
		console.error("Error: ", err)
	})
