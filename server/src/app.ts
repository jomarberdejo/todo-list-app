import express from "express";
import cors from "cors";
import todoRoutes from './routes/todoRoutes'
import { errorHandlerMiddleware } from "./middlewares/error-handler";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
