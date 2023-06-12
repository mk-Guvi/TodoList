import { hash } from 'bcryptjs';
import { NextApiHandler } from 'next';
import { connectMongo, UsersModel } from '../../../database';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(500).json({ message: 'Invalid HTTP request' });
    return;
  }

  try {
    await connectMongo();
    if (!req.body) {
      throw new Error('Invalid Input');
    }

    const { username, password, email } = req.body;

    const checkEmailExisting = await UsersModel.findOne({ email });

    if (checkEmailExisting) {
      throw new Error('User Already Exists');
    }

    const hashedPassword = await hash(password, 12);

    const data = await UsersModel.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Successfully created user', data });
  } catch (error) {
    res.status(404).json({ error: true, message: error.message || 'Failed To Create User' });
  }
};

export default handler;
