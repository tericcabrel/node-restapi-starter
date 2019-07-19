import mongoose, { Model, Document } from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
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
    unique: true,
  },
  avatar: {
    type: String,
    required: false,
    default: null,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'users',
});

const UserModel: Model<Document, {}> = mongoose.model('User', UserSchema);

class UserRepo extends UserModel {
  public static updateParams = [
    'name',
    'username',
    'gender',
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

export default UserRepo;
