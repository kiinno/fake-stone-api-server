import type { Request, Response, NextFunction } from 'express';
import BlockedIP, { IBlockedIP } from '../models/blockedIp';

export async function rejectBlockedIP(req: Request, res: Response, next: NextFunction) {
	const blockedIP: IBlockedIP | null = await BlockedIP.findOne({
		ip: req.socket.remoteAddress,
	});
	const dt = new Date();
	if (blockedIP) {
		if (blockedIP.banned?.forever) {
			return res.status(200).end(`Sorry, Your IP '${blockedIP.ip}' has been banned.`);
		} else if (blockedIP.banned?.to) {
			const bannedTo = new Date(blockedIP.banned?.to);
			if (dt < bannedTo) {
				return res
					.status(200)
					.end(
						`Sorry, Your IP '${
							blockedIP.ip
						}' has been banned to ${bannedTo.getUTCMonth()}/${bannedTo.getUTCDate()}/${bannedTo.getFullYear()} ${bannedTo.getUTCHours()}:${bannedTo.getUTCMinutes()}.`
					);
			}
		}
	}
	return next();
}
