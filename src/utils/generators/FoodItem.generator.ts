import { fakerAR, faker } from '@faker-js/faker';
import { IFoodItem } from '../../models/FoodMenu';

function randomNumber(max?: number, min = 0) {
	return +faker.commerce.price({ min, max });
}

const CATEGORIES = ['فطار', 'غداء', 'عشاء'];

export default async function (): Promise<IFoodItem> {
	const foodItem: IFoodItem = {
		title: fakerAR.lorem.words(),
		price: +faker.commerce.price({ max: 300 }),
		discount: +faker.commerce.price({ min: 0, max: 100 }),
		category: CATEGORIES[randomNumber(CATEGORIES.length - 1)],
		description: fakerAR.lorem.paragraph(),
		image: faker.image.urlLoremFlickr({ category: 'food' }),
	};
	console.log(foodItem);

	return foodItem;
}
