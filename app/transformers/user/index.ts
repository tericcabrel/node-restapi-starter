import Transformer from '../transformer';

class UserTransformer extends Transformer {
  constructor(data: any) {
    const properties = [
      '_id', 'name', 'email', 'avatar', 'username', 'gender', 'confirmed', 'created_at', 'updated_at',
    ];
    super(data, properties);
  }
}

export default UserTransformer;
