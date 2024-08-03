import express, { Request, Response, NextFunction } from 'express';
import { connectToDatabase, closeConnection } from './utils/database/connectionTomongo';
import restaurantRoutes from './routes/restaurantRoutes';
import userRoutes from './routes/userRoutes';
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

let db: any;
connectToDatabase();
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

app.get('/', (req, res) => {
	res.json({ message: 'server running succesfully' });
});
app.use('/api', restaurantRoutes);
app.use('/api', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
	await closeConnection();
	process.exit(0);
});

export default app;
