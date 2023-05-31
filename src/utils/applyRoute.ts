import { RequestHandler, Router } from 'express';
import GlobalServices from '../services/global.service';
import StoneServices from '../services/stone.service';
import DocServices from '../services/document.service';
import { Model } from 'mongoose';

interface IEMWSpace {
	get?: RequestHandler[];
	post?: RequestHandler[];
	put?: RequestHandler[];
	patch?: RequestHandler[];
	delete?: RequestHandler[];
	options?: RequestHandler[];
	head?: RequestHandler[];
	disabled?: boolean;
	prefix?: string;
}

interface IExtraMiddlewares {
	index?: IEMWSpace;
	stone?: IEMWSpace;
	single?: IEMWSpace;
}

export default class ApplyRoute<IModelSchema> {
	public router: Router;
	protected globalServices: GlobalServices<IModelSchema>;
	protected docServices: DocServices<IModelSchema>;
	protected stoneServices: StoneServices<IModelSchema>;

	constructor(
		private _Model: Model<IModelSchema>,
		genFunc: () => Promise<IModelSchema>,
		public extraMiddlewares?: IExtraMiddlewares
	) {
		this.router = Router();
		this.globalServices = new GlobalServices<IModelSchema>(this._Model);
		this.docServices = new DocServices<IModelSchema>(this._Model);
		this.stoneServices = new StoneServices<IModelSchema>(this._Model);

		!extraMiddlewares?.index?.disabled &&
			this.router
				.route(extraMiddlewares?.index?.prefix || '/')
				.get(extraMiddlewares?.index?.get || [], this.globalServices.getDocuments())
				.post(extraMiddlewares?.index?.post || [], this.globalServices.addDocument());

		!extraMiddlewares?.single?.disabled &&
			this.router
				.route(`${extraMiddlewares?.single?.prefix || '/id'}/:id`)
				.get(extraMiddlewares?.single?.get || [], this.docServices.getSDocument())
				.delete(extraMiddlewares?.single?.delete || [], this.docServices.delSDocument());

		!extraMiddlewares?.stone?.disabled &&
			this.router
				.route(extraMiddlewares?.stone?.prefix || '/stone')
				.post(extraMiddlewares?.index?.post || [], this.stoneServices.generator(genFunc))
				.delete(extraMiddlewares?.index?.delete || [], this.stoneServices.clean());
	}
}
