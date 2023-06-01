import { Schema, model, Types, Model } from 'mongoose';
import { hashSync, genSaltSync, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export interface ILOCATION {
	buildingNumber: string;
	street: string;
	zipCode: string;
	city: string;
	country: string;
	countryCode: string;
	county: string;
	state: string;
	gps: [number, number];
}
export interface IUSER {
	username: string;
	password: string;
	plainPassword: string;
	email: string;
	avatar: string;

	phone: {
		primary: string;
		secondary?: string;
	};

	name: {
		firstName: string;
		middleName: string;
		lastName: string;
	};

	gender: string;
	bio: string;

	job: {
		jobType: string;
		title: string;
		descriptor: string;
		stillWorking: boolean;
		company: {
			name: string;
			location: ILOCATION;
		};
	};

	location: ILOCATION;
	super: 0 | 1 | 2;

	friends?: Types.ObjectId[];
}

export interface IUSERMethods {
	verifyPassword: (password: string) => Promise<boolean>;
	generateToken: () => string;
}

type UserModel = Model<IUSER, object, IUSERMethods>;

const schema = new Schema<IUSER, UserModel, IUSERMethods>(
	{
		name: {
			firstName: {
				type: String,
				required: true,
			},
			middleName: {
				type: String,
				required: true,
			},
			lastName: {
				type: String,
				required: true,
			},
		},
		gender: { type: String, enum: ['male', 'female'] },
		bio: { type: String, default: null },
		job: {
			jobType: String,
			title: String,
			descriptor: String,
			stillWorking: Boolean,
			company: {
				name: String,
				location: {
					buildingNumber: String,
					street: String,
					zipCode: String,
					country: String,
					countryCode: String,
					city: String,
					county: String,
					gps: [Number, Number],
				},
			},
		},
		location: {
			buildingNumber: String,
			street: String,
			zipCode: String,
			countryCode: String,
			city: String,
			country: String,
			county: String,
			gps: {
				type: [Number, Number],
			},
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
		phone: {
			primary: {
				type: String,
				required: true,
				unique: true,
			},
			secondary: String,
		},
		password: {
			type: String,
			trim: true,
			required: true,
			set: (v: string): string => {
				const { BC_INJECTION = '' } = process.env;
				const salt = genSaltSync();
				const hashed = hashSync(`${v}.${BC_INJECTION}`, salt);
				return hashed;
			},
			minlength: 10,
			maxlength: 128,
		},
		plainPassword: String,
		super: {
			type: Number,
			enum: [0, 1, 2],
			default: 0,
		},
		avatar: {
			type: String,
			default: null,
		},
		friends: {
			type: [Types.ObjectId],
			ref: 'User',
		},
	},
	{ timestamps: true, versionKey: false }
);

schema.methods.verifyPassword = async function (password: string): Promise<boolean> {
	const { BC_INJECTION = '' } = process.env;
	const check = compare(`${password}.${BC_INJECTION}`, this.password);
	return check;
};

schema.methods.generateToken = function () {
	const { JWT_SECRET_KEY = '' } = process.env;
	const token = sign({ id: this._id }, JWT_SECRET_KEY);
	return token;
};

const User = model<IUSER, UserModel>('User', schema);

export default User;
