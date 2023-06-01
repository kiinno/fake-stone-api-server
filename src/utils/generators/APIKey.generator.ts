import { faker } from '@faker-js/faker';
import { IAPIKey } from '../../models/apiKey';
import generateApiKey from 'generate-api-key';

export default async function (): Promise<IAPIKey> {
	const { future } = faker.date;
	const APIKey: IAPIKey = {
		key: generateApiKey({ min: 16, max: 32, prefix: 'stone', method: 'base62' }) as string,
		blocked: faker.datatype.boolean(),
		expiredAt: future(),
	};

	return APIKey;
}
