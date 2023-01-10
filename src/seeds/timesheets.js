import mongoose from 'mongoose';

export default [
  {
    _id: mongoose.Types.ObjectId('6350b1792476de78a2f1db94'),
    description: 'testing',
    date: '2022-02-24',
    task: mongoose.Types.ObjectId('6352aded6fd9d7321c392e1f'),
    hours: 36,
    project: mongoose.Types.ObjectId('634d73ca260e0ee548943dc3'),
    employee: mongoose.Types.ObjectId('6352b5e596170b594dc07cf2'),
  },
  {
    _id: mongoose.Types.ObjectId('6350b18f2476de78a2f1db96'),
    description: 'knowledge transfer',
    date: '2022/02/24',
    task: mongoose.Types.ObjectId('6352b44de84539c33fd64be7'),
    hours: 36,
    project: mongoose.Types.ObjectId('634d924e260e0ee548943dc7'),
    employee: mongoose.Types.ObjectId('635317372535a3c0f85955eb'),
  },
  {
    _id: mongoose.Types.ObjectId('63570dd6ebbc214f0380909f'),
    description: 'workload division.',
    date: '2022/09/05',
    task: mongoose.Types.ObjectId('63570cde56843ec436619dd8'),
    hours: 13,
    project: mongoose.Types.ObjectId('634f42d0409f09628b8a1479'),
    employee: mongoose.Types.ObjectId('635326e0531b3bfdf5a64ba9'),
  },
];
