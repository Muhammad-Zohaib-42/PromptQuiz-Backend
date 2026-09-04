import { app } from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectDB } from "./src/config/database.js";

connectDB()
.then(() => {
    app.listen(config.PORT, () => {
        console.log(`Server is running on port ${config.PORT}`)
    })
})
.catch(error => {
    console.log(`DB connection failed! error: ${error}`)
    process.exit(1)
})