import { UserRequest } from '../@types/customType';
import { getDb } from '../utils/database/connectionTomongo';
import { Request, Response } from 'express';
export async function getRestaurants(req: UserRequest, res: Response) {
	try {
		const db = await getDb();
		console.log(req.user, 'req.user inside get restaurent');
		const collection = db.collection('restaurants');
		const documents = await collection.find({}).limit(10).toArray();
		res.json(documents);
	} catch (err) {
		console.error('Failed to execute query', err);
		res.status(500).send('Error executing query');
	}
}
