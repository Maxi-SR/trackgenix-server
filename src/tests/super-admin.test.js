import request from 'supertest';
import app from '../app';
import SuperAdmins from '../models/Super-admins';
import superAdminsSeed from '../seeds/superAdmins';

const mockedSuperAdmin = {
  name: 'lucas',
  lastName: 'salame',
  email: 'salamelucas@gmail.com',
  password: 'pacoelflaco123',
};
const mockedSuperAdmin4 = {
  name: 'omar',
  lastName: 'jamon',
};
const mockedSuperAdmin2 = {
  name: 123456,
};

const mockedSuperAdmin3 = {
  list: 'unknow',
};

let superAdminId;

beforeAll(async () => {
  await SuperAdmins.collection.insertMany(superAdminsSeed);
});

describe('GET/superAdmins', () => {
  test('should return status code 200 , should have data inside and response error be false', async () => {
    const response = await request(app).get('/superAdmins').send();
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.error).toBe(false);
  });

  test('should return status code 200 when filter by query params', async () => {
    const response = await request(app).get('/superAdmins?lastName=Salame').send();
    expect(response.status).toBe(200);
  });

  test('should return status code 404 when not found filter data', async () => {
    const response = await request(app).get('/superAdmins?name=elcapo').send();
    expect(response.status).toBe(404);
  });

  test('should return status code 400 when filter invalid params', async () => {
    const response = await request(app).get('/superAdmins?phone=55555555555').send();
    expect(response.status).toBe(404);
  });

  test('should return status code 400', async () => {
    const response = await request(app).get('/').send();
    expect(response.status).toBe(404);
  });
});

describe('POST/superAdmins', () => {
  test('should return status code 200 , should response error be false', async () => {
    const response = await request(app).post('/superAdmins').send(mockedSuperAdmin);

    // eslint-disable-next-line no-underscore-dangle
    superAdminId = response.body.data._id;

    expect(response.status).toBe(201);
    expect(response.body.error).toBe(false);
  });

  test('should return status code 400 and response error be true , when add a empty body', async () => {
    const response = await request(app).post('/superAdmins').send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  test('should return status code 400 , should response error be true ,when try to add a bad params', async () => {
    const response = await request(app).post('/superAdmins').send(mockedSuperAdmin2);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe('GET/superAdmins', () => {
  test('should return status code 200 , should have data inside and response error be false , when filter by id', async () => {
    const response = await request(app).get(`/superAdmins/${superAdminId}`).send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  test('should return status code 400 and response error be true ,when search with invalid id', async () => {
    const response = await request(app).get('/superAdmins/wkvehkwegjhw').send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  test('should return the name of the superadmin required', async () => {
    const response = await request(app).get(`/superAdmins/${superAdminId}`).send();
    expect(response.body.data.name).toBe(mockedSuperAdmin.name);
  });
});

describe('PUT/superAdmins', () => {
  test('should return status code 200 , should response error be false , when update data', async () => {
    const response = await request(app).put(`/superAdmins/${superAdminId}`).send(mockedSuperAdmin4);
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  test('should return status code 404 and response error be true ,when update with invalid id', async () => {
    const response = await request(app).put('/superAdmins/wkvehkwegjhw').send(mockedSuperAdmin4);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe(true);
  });

  test('should return status code 400 and response error be true ,when add empty body', async () => {
    const response = await request(app).put(`/superAdmins/${superAdminId}`).send();
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  test('should return status code 400 and response error be true ,when update with invalid key and value', async () => {
    const response = await request(app).put(`/superAdmins/${superAdminId}`).send(mockedSuperAdmin3);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  test('should return status code 404 and response error be true ,when update with no id', async () => {
    const response = await request(app).put('/superAdmins/').send(mockedSuperAdmin4);
    expect(response.status).toBe(404);
  });
});

describe('DELETE/superAdmins', () => {
  test('should return status code 200 and response error be false', async () => {
    const response = await request(app).delete(`/superAdmins/${superAdminId}`).send();
    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
  });

  test('should return status code 404', async () => {
    const response = await request(app).delete('/superAdmins').send();
    expect(response.status).toBe(404);
    expect(response.body.data).toBe(undefined);
  });
});
