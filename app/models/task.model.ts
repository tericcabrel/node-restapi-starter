import mongoose from 'mongoose';

const { Schema } = mongoose;

const TaskSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'tasks',
});

const TaskModel = mongoose.model('Task', TaskSchema);

class TaskRepo extends TaskModel {
  public static updateParams = [
    'title',
    'description',
    'date',
    'status',
    'is_important',
  ];

  public static async getAll() {
    return this.find({}).sort('-created_at').exec();
  }

  public static async add(item: any) {
    return item.save();
  };

  public static async delete(id: any){
    return this.deleteOne({ _id: id });
  }

  public static async get(id: any){
    return this.findOne({ _id: id });
  }

  public static async change(id: any, data: any){
    return this.findOneAndUpdate({ _id: id }, data);
  }

  public static async getBy(param: any) {
    return this.find(param);
  }

  public static async getOneBy(param: any){
    return this.findOne(param);
  }

  public static async bulkDelete(param: any){
    return this.deleteMany(param);
  }
}
export default TaskRepo;
