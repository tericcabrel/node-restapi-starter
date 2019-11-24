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

const taskUpdateParams: string[] = [
	'title',
	'description',
	'date',
	'status',
	'is_important',
];

export { TaskModel, taskUpdateParams };
