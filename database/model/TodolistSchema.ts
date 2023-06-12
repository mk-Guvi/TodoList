import { model, models, Schema } from 'mongoose';



const TodoListItemSchema = new Schema({
  label: String,
  id: String,
  parentId: String,
  children: [this],
  status: {
    type: String,
    enum: ['COMPLETED', 'PENDING',], // Separate string literals without the union type
    default: 'PENDING',
  },
});

const todolistSchema = new Schema({
  todolist: [TodoListItemSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
    require:true
  },
});
//if model user already exist the models.todolist comes into place
export const todolistModel = models?.todolist || model('todolist', todolistSchema);
