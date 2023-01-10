import request from 'supertest';
import app from '../app';
import Admins from '../models/Admins';
import AdminsSeed from '../seeds/admins';

const expectHandler = (response, statusCode) => {
  expect(response.status).toBe(statusCode);
  expect(response.body.data).toBe(statusCode < 400 ? response.body.data : undefined);
  expect(response.body.error).toBe(statusCode >= 400);
};
let adminId;

const mockedAdmin1 = {
  name: 'mohammed',
  lastName: 'el armenio',
  email: 'kebap@gmail.com',
  password: 'tabule55852yuilvfghuil',
};
const mockedAdmin2 = {
  name: 'mohammed',
  email: 'kebap@gmail.com',
  status: true,
};
const mockedAdmin3 = {
  hola: 'chau',
  name: 'mohammed',
  lastName: 'el armenio',
  email: 'kebap@gmail.com',
  password: 'tabule55852yuilvfghuil',
};
const mockedAdmin4 = {
  name: '',
  lastName: '',
  email: 'kebap@gmail.com',
  password: 'tabule55852yuilvfghuil',
};

beforeAll(async () => {
  await Admins.collection.insertMany(AdminsSeed);
});

describe('GET /admins', () => {
  test('Should return status 200, correct message and error false.', async () => {
    const response = await request(app).get('/admins').send();

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.message).toBe('Admins found');
  });
});

describe('POST /admins', () => {
  test('Should return status 201, correct message and error false when all required fields are filled.', async () => {
    const response = await request(app).post('/admins').send(mockedAdmin1);
    // eslint-disable-next-line no-underscore-dangle
    adminId = response.body.data._id;
    expectHandler(response, 201);
    expect(response.body.message).toBe('Admin created successfully');
  });
  test('Should return status 400, data undefined and error true when lack some required key.', async () => {
    const response = await request(app).post('/admins').send(mockedAdmin2);

    expectHandler(response, 400);
  });
  test('Should return status 400, data undefined and error true when an unexpected key is sent.', async () => {
    const response = await request(app).post('/admins').send(mockedAdmin3);

    expectHandler(response, 400);
  });
  test('Should return status 400, data undefined and error true when empty body.', async () => {
    const response = await request(app).post('/admins').send();

    expectHandler(response, 400);
  });
  test('Should return status 400, data undefined and error true when empty required field.', async () => {
    const response = await request(app).post('/admins').send(mockedAdmin4);

    expectHandler(response, 400);
  });
});

describe('GET /admins', () => {
  test('Should return status 200, some data and error false.', async () => {
    const response = await request(app).get(`/admins/${adminId}`).send();

    expectHandler(response, 200);
    expect(Object.keys(response.body.data).length).toBeGreaterThan(0);
  });
  test('Should return status 400, data undefined and error true.', async () => {
    const response = await request(app).get('/admins/cualquiercosa').send();

    expectHandler(response, 400);
  });
});

describe('PUT /admins', () => {
  test('Should return status 200, some data and error false.', async () => {
    const response = await request(app).put(`/admins/${adminId}`).send(mockedAdmin2);
    expect(Object.keys(response.body.data).length).toBeGreaterThan(0);
    expectHandler(response, 200);
  });
  test('Should return status 404, data undefined and error true when ID is not found.', async () => {
    const response = await request(app).put('/admins/63531d3a49c6396544e3dc5e').send(mockedAdmin2);
    expectHandler(response, 404);
  });
  test('Should return status 400, data undefined and error true when invalid ID format.', async () => {
    const response = await request(app).put('/admins/cualquiera').send(mockedAdmin2);
    expectHandler(response, 400);
  });
  test('Should return status 400, data undefined and error true when no body is sent.', async () => {
    const response = await request(app).put(`/admins/${adminId}`).send();
    expectHandler(response, 400);
  });
  test('Should return status 400, data undefined and error true when no body has invalid keys.', async () => {
    const response = await request(app).put(`/admins/${adminId}`).send(mockedAdmin3);
    expectHandler(response, 400);
  });
});

describe('DELETE /admins', () => {
  test('Should return status 200 and error false.', async () => {
    const response = await request(app).delete(`/admins/${adminId}`).send();
    expectHandler(response, 200);
  });

  test('Should return status 404 and data undefined when not found ID.', async () => {
    const response = await request(app).delete('/admins/63531d3a49c6396544e3dc5e').send();
    expectHandler(response, 404);
  });

  test('Should return status 404 and data undefined when invalid ID.', async () => {
    const response = await request(app).delete('/admins/cualquiercosa').send();
    expectHandler(response, 404);
  });
});
