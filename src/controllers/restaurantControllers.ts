import { UserRequest } from '../@types/customType';
import { getDb } from '../utils/database/connectionTomongo';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import restaurantSchema from '../models/restaurantModel';

export async function createRestaurant(req: UserRequest, res: Response) {
	try {
		const db = await getDb();
		const restaurantCollection = db.collection('restaurants');

		// Validate request body against the schema
		const validationResult = restaurantSchema.safeParse(req.body);

		if (!validationResult.success) {
			return res
				.status(400)
				.json({ message: 'Invalid request data', errors: validationResult.error.errors });
		}

		const { location, name } = req.body;

		// Insert the new restaurant into the collection
		const result = await restaurantCollection.insertOne({
			_id: new ObjectId(), // MongoDB will handle the ID generation
			location,
			name,
		});

		res.status(201).json({
			message: 'Restaurant created successfully',
			document: result, // Return the newly created document
		});
	} catch (err) {
		console.error('Failed to execute query', err);
		res.status(500).send('Error executing query');
	}
}

export async function getRestaurant(req: UserRequest, res: Response) {
	try {
		const db = await getDb();
		const { id } = req.params;

		const restaurantCollection = db.collection('restaurants');
		const restaurantDocument = await restaurantCollection.findOne({ _id: new ObjectId(id) });
		res.json(restaurantDocument);
	} catch (err) {
		console.error('Failed to execute query', err);
		res.status(500).send('Error executing query');
	}
}

export async function getRestaurantsInRadiusRange(req: UserRequest, res: Response) {
	try {
		const longitude = parseFloat(req.query.longitude as string);
		const latitude = parseFloat(req.query.latitude as string);
		const radius = parseFloat(req.query.radius as string);
		const db = await getDb();

		const restaurantCollection = db.collection('restaurants');
		if (
			isNaN(longitude) ||
			isNaN(latitude) ||
			isNaN(radius) ||
			!isFinite(longitude) ||
			!isFinite(latitude) ||
			!isFinite(radius)
		) {
			console.error('Invalid parameters:', { longitude, latitude, radius });
			return res.status(400).send('Invalid parameters');
		}

		// Convert radius from meters to radians
		const radiusInRadians = radius / 6371000; // Earth radius in meters (6371000 meters)

		const nearRestaurantDocuments = await restaurantCollection
			.find({
				location: {
					$geoWithin: {
						$centerSphere: [[longitude, latitude], radiusInRadians],
					},
				},
			})
			.toArray();
		res.json(nearRestaurantDocuments);
	} catch (err) {
		console.error('Failed to execute query', err);
		res.status(500).send('Error executing query');
	}
}

export async function getRestaurantsInDistanceRange(req: UserRequest, res: Response) {
	try {
		const longitude = parseFloat(req.query.longitude as string);
		const latitude = parseFloat(req.query.latitude as string);
		const mindistance = parseFloat(req.query.mindistance as string);
		const maxdistance = parseFloat(req.query.maxdistance as string);
		const db = await getDb();

		const restaurantCollection = db.collection('restaurants');
		if (
			isNaN(longitude) ||
			isNaN(latitude) ||
			isNaN(mindistance) ||
			isNaN(maxdistance) ||
			!isFinite(longitude) ||
			!isFinite(latitude) ||
			!isFinite(mindistance) ||
			!isFinite(maxdistance)
		) {
			console.error('Invalid parameters:', { longitude, latitude, mindistance, maxdistance });
			return res.status(400).send('Invalid parameters');
		}
		const nearRestaurantDocuments = await restaurantCollection
			.find({
				location: {
					$near: {
						$geometry: {
							type: 'Point',
							coordinates: [longitude, latitude],
						},
						$maxDistance: maxdistance,
						$minDistance: mindistance,
					},
				},
			})
			.toArray();

		res.json(nearRestaurantDocuments);
	} catch (err) {
		console.error('Failed to execute query', err);
		res.status(500).send('Error executing query');
	}
}

export async function updateRestaurant(req: UserRequest, res: Response) {
	try {
		const db = await getDb();
		const id = req.params.id;
		const restaurantCollection = db.collection('restaurants');
		if (!ObjectId.isValid(id)) {
			return res.status(400).json({ message: 'Invalid restaurant ID' });
		}

		const document = await restaurantCollection.findOne({ _id: new ObjectId(id) });
		const { location, name } = req.body;
		if (!document) {
			return res.status(404).json({ message: 'Restaurant not found' });
		}
		const restaurantdocumentafter = await restaurantCollection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{
				$set: {
					...(location && { location }),
					...(name && { name }),
				},
			},
			{ returnDocument: 'after' } // Return the document after update
		);
		res.json({
			message: 'deleted succesfully',
			restaurantdocumentafter,
		});
	} catch (err) {
		console.error('Failed to execute query', err);
		res.status(500).send('Error executing query');
	}
}

export async function deleteRestaurant(req: UserRequest, res: Response) {
	try {
		const db = await getDb();
		const id = req.params.id;

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
