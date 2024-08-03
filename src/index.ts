import express, { Request, Response, NextFunction } from "express";
import {
  connectToDatabase,
  closeConnection,
} from "./utils/database/connectionTomongo";
import restaurantroutes from "./routes/restaurant";
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

let db: any;

const startServer = async () => {
  try {
    db = await connectToDatabase();
    app.use((req, res, next) => {
      console.log(req.path, req.method);
      next();
    });

    app.get("/", (req, res) => {
      res.json({ message: "server running succesfully" });
    });
    app.use("/api", restaurantroutes);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    process.on("SIGINT", async () => {
      await closeConnection();
      process.exit(0);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
