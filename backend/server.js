import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import reviewRouter from "./routes/reviewRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from './config/swagger.js'

// App Config 
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary();

// middlewares
app.use(express.json())
app.use(cors())

// API endpoints 
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use("/api/product", reviewRouter);
app.use("/api/product", productRouter);

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : ' + port))
