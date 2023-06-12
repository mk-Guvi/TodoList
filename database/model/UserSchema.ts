import { model, models, Schema } from 'mongoose';

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});
//if model user already exist the models.users comes into place
export const UsersModel = models?.user || model('user', userSchema);
