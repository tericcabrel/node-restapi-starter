import mongoose, { Document, Model as MongooseModel } from 'mongoose';

const taskSchema: mongoose.Schema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	status: {
		type: String,
		enum: ['Pending', 'Working', 'Done'],
		required: true,
		default: 'Pending',
	},
	is_important: {
		type: Boolean,
		required: true,
		default: false,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
},                                                      {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
	collection: 'tasks',
});

// tslint:disable-next-line:variable-name
const TaskModel: MongooseModel<Document> = mongoose.model('Task', taskSchema);

class Model extends TaskModel {
	public static updateParams: string[] = [
		'title',
		'description',
		'date',
		'status',
		'is_important',
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
