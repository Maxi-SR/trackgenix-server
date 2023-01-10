import mongoose from 'mongoose';

export default [
  {
    _id: mongoose.Types.ObjectId('634f281aca551819ef903f75'),
    name: 'lucas',
    lastName: 'salame',
    phone: '555555555',
    email: 'salamelucas@gmail.com',
    password: 'pacoelflaco123',
    projects: [mongoose.Types.ObjectId('634d73ca260e0ee548943dc3')],
    status: true,
  },
  {
    _id: mongoose.Types.ObjectId('6353177e414b58f4591599e0'),
    name: 'pedro',
    lastName: 'salchichon',
    phone: '555555555',
    email: 'laucan@furl.net',
    password: 'pacoelflaco123',
    projects: [mongoose.Types.ObjectId('634d924e260e0ee548943dc7')],
    status: true,
  },
  {
    _id: mongoose.Types.ObjectId('634d795e1e4d452e827183e6'),
    name: 'luis',
    lastName: 'pepperonni',
    phone: '555555555',
    email: 'pepepecas@gmail.com',
    password: 'pacoelflaco123',
    projects: [mongoose.Types.ObjectId('634f42d0409f09628b8a1479')],
    status: false,
  },
];
