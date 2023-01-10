import mongoose from 'mongoose';

export default [
  {
    _id: mongoose.Types.ObjectId('634d73ca260e0ee548943dc3'),
    name: 'Trying mockaroo populate',
    description: 'Saving new dummy data to begin testing',
    startDate: '2020-01-01T00:00:00.000+00:00',
    endDate: '2020-01-02T00:00:00.000+00:00',
    clientName: 'Graves Braum',
    employees: [{
      employeeId: mongoose.Types.ObjectId('634f281aca551819ef903f75'),
      rate: 20,
      role: 'QA',
    }],
    status: true,
  },
  {
    _id: mongoose.Types.ObjectId('634d924e260e0ee548943dc7'),
    name: 'Sharing mockaroo data',
    description: 'Typing with collegues new seeds for the team',
    startDate: '2021-02-02T00:00:00.000+00:00',
    endDate: '2021-02-03T00:00:00.000+00:00',
    clientName: 'Katarina Soraka',
    employees: [{
      employeeId: mongoose.Types.ObjectId('6353177e414b58f4591599e0'),
      rate: 12,
      role: 'DEV',
    }],
    status: false,
  },
  {
    _id: mongoose.Types.ObjectId('634f42d0409f09628b8a1479'),
    name: 'Updating seeds',
    description: 'Sharing with the team mockaroo data',
    startDate: '2022-03-03T00:00:00.000+00:00',
    endDate: '2022-03-04T00:00:00.000+00:00',
    clientName: 'Garen Nautilus',
    employees: [{
      employeeId: mongoose.Types.ObjectId('634d795e0e4d452e827183e6'),
      rate: 10,
      role: 'TL',
    }],
    status: true,
  },
];
