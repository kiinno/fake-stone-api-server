import { faker } from '@faker-js/faker';
import { IBlockedIP } from '../../models/blockedIp';

export default async function (): Promise<IBlockedIP> {
	const blockedIP: IBlockedIP = {
		ip: faker.internet.ip(),
		...(faker.datatype.boolean() && { to: faker.date.soon({ days: 365 }) }),
		...(faker.datatype.boolean() && { comment: faker.lorem.text() }),
	};

	return blockedIP;
}
