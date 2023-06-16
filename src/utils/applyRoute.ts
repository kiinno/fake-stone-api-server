import { RequestHandler, Router } from 'express';
import GlobalServices from '../services/global.service';
import StoneServices from '../services/stone.service';
import DocServices from '../services/document.service';
import { Model } from 'mongoose';
import { documentFeaturesValidation, documentIDValidationChain, vResault } from '../utils/validators/global';

interface Middlewares {
	before?: RequestHandler[];
	after?: RequestHandler[];
}

interface IEMWSpace {
	get?: Middlewares;
	post?: Middlewares;
	put?: Middlewares;
	patch?: Middlewares;
	delete?: Middlewares;
	options?: Middlewares;
	head?: Middlewares;
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

		// Services Instances
		this.globalServices = new GlobalServices<IModelSchema>(this._Model);
		this.docServices = new DocServices<IModelSchema>(this._Model);
		this.stoneServices = new StoneServices<IModelSchema>(this._Model);

		// Mouting Service

		// Index Service
		!extraMiddlewares?.index?.disabled &&
			this.router
				.route(extraMiddlewares?.index?.prefix || '/')
				.get(
					extraMiddlewares?.index?.get?.before || [],
					documentFeaturesValidation,
					vResault,
					this.globalServices.getDocuments(),
					...(extraMiddlewares?.index?.get?.after || [])
				)
				.post(
					extraMiddlewares?.index?.post?.before || [],
					this.globalServices.addDocument(),
					...(extraMiddlewares?.index?.post?.after || [])
				);

		// Spicific Document Service
		!extraMiddlewares?.single?.disabled &&
			this.router
				.route(`${extraMiddlewares?.single?.prefix || '/id'}/:id`)
				.get(
					extraMiddlewares?.single?.get?.before || [],
					documentIDValidationChain,
					vResault,
					this.docServices.getSDocument(),
					...(extraMiddlewares?.single?.get?.after || [])
				)
				.put(
					extraMiddlewares?.single?.put?.before || [],
					documentIDValidationChain,
					vResault,
					this.docServices.updateSDocument(),
					...(extraMiddlewares?.single?.put?.after || [])
				)
				.delete(
					extraMiddlewares?.single?.delete?.before || [],
					documentIDValidationChain,
					vResault,
					this.docServices.delSDocument(),
					...(extraMiddlewares?.single?.delete?.after || [])
				);

		// Stone Service
		!extraMiddlewares?.stone?.disabled &&
			this.router
				.route(extraMiddlewares?.stone?.prefix || '/stone')
				.post(
					extraMiddlewares?.stone?.post?.before || [],
					this.stoneServices.generator(genFunc),
					...(extraMiddlewares?.stone?.post?.after || [])
				)
				.delete(
					extraMiddlewares?.stone?.delete?.before || [],
					this.stoneServices.clean(),
					...(extraMiddlewares?.stone?.delete?.after || [])
				);
	}
}
