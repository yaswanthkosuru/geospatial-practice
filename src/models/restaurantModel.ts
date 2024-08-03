import { z } from 'zod';

const restaurantSchema = z.object({
	location: z.object({
		coordinates: z.tuple([z.number(), z.number()]),
		type: z.literal('Point'),
	}),
	name: z.string(),
});
export default restaurantSchema;
