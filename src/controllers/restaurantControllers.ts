import { UserRequest } from '../@types/customType';
import { getDb } from '../utils/database/connectionTomongo';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
export async function getRestaurants(req: UserRequest, res: Response) {
	try {
		const db = await getDb();
		console.log(req.user, 'req.user inside get restaurent');
		const restaurantCollection = db.collection('restaurants');
		const documents = await restaurantCollection.find({}).limit(10).toArray();
		res.json(documents);
	} catch (err) {
		console.error('Failed to execute query', err);
		res.status(500).send('Error executing query');
	}
}
export async function deleteRestaurant(req: UserRequest, res: Response) {
	try {
		const db = await getDb();
		const id = req.params.id;
		console.log(req.user, id, 'req.user inside get restaurent');
		const restaurantCollection = db.collection('restaurants');
		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Invalid restaurant ID' });
		}
		const document = await restaurantCollection.findOneAndDelete({
			_id: new ObjectId(req.params.id),
		});
		if (!document) {
			return res.status(404).json({ message: 'Restaurant not found' });
		}
		res.json({
			message: 'deleted succesfully',
			document,
		});
	} catch (err) {
		console.error('Failed to execute query', err);
		res.status(500).send('Error executing query');
	}
}
