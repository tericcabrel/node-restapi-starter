import mongoose, { Document, Model as MongooseModel } from 'mongoose';

const userSchema: mongoose.Schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: false,
		default: 'M',
	},
	confirmed: {
		type: Boolean,
		required: true,
		default: false,
	},
	email_token: {
		type: String,
		required: false,
		default: null,
	},
	avatar: {
		type: String,
		required: false,
		default: null,
	},
},                                                      {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
	collection: 'users',
});

// tslint:disable-next-line:variable-name
const UserModel: MongooseModel<Document, {}> = mongoose.model('User', userSchema);

class Model extends UserModel {
	public static updateParams: string[] = [
		'name',
		'username',
		'gender',
	];

	public static async getAll(): Promise<Document[]> {
		return this.find({}).sort('-created_at').exec();
	}

	public static async add(item: any): Promise<Document> {
		return item.save();
	}

	public static async delete(id: any): Promise<any> {
		return this.deleteOne({ _id: id });
	}

	public static async get(id: any): Promise<Document|null> {
		return this.findOne({ _id: id });
	}

	public static async change(id: any, data: any): Promise<Document|null> {
		return this.findOneAndUpdate({ _id: id }, data);
	}

	public static async getBy(param: any): Promise<any> {
		return this.find(param);
	}

	public static async getOneBy(param: any): Promise<Document|null> {
		return this.findOne(param);
	}

	public static async bulkDelete(param: any): Promise<any> {
		return this.deleteMany(param);
	}
}

export { Model };
