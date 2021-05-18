const mongoose = require("mongoose")
const password = require("./password")

const connectionString = `mongodb://poker:${password}@cluster0-shard-00-00.gvn3i.mongodb.net:27017,cluster0-shard-00-01.gvn3i.mongodb.net:27017,cluster0-shard-00-02.gvn3i.mongodb.net:27017/cluster0?ssl=true&replicaSet=atlas-2qn6om-shard-0&authSource=admin&retryWrites=true&w=majority`

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
