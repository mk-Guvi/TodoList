import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (_, res) => {
  res.redirect('/');
};

export default handler;
