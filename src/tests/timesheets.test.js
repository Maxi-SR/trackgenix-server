import request from 'supertest';
import app from '../app';
import Timesheets from '../models/Timesheets';
import timesheetsSeed from '../seeds/timesheets';
import Tasks from '../models/Tasks';
import tasksSeed from '../seeds/tasks';
import Projects from '../models/Projects';
import projectsSeed from '../seeds/projects';
import Employees from '../models/Employees';
import employeesSeed from '../seeds/employees';

const timesheetId = '6350b1792476de78a2f1db94';
const idNotFound = '6389b1754576de78a2f1db63';
const invalidId = 'lalala';

beforeAll(async () => {
  await Timesheets.collection.insertMany(timesheetsSeed);
  await Employees.collection.insertMany(employeesSeed);
  await Projects.collection.insertMany(projectsSeed);
  await Tasks.collection.insertMany(tasksSeed);
});

const mockedTimehseets = {
  description: 'training',
  date: '2020-01-01',
  task: '6352b44de84539c33fd64be7',
  hours: 36,
  project: '634d73ca260e0ee548943dc3',
  employee: '6352b5e596170b594dc07cf2',
};
const mockedErrorTimehseets = {
  description: 'training',
  date: '2020-01-01',
  rate: 500,
  task: '6352b44de84539c33fd64be7',
  hours: 36,
  project: '634d73ca260e0ee548943dc3',
  employee: '6352b5e596170b594dc07cf2',
};

const editedMockedTimehseets = {
  description: 'knowledge transfer',
  hours: 44,
};

const EmptyMockedTimehseets = {};

describe('POST /timesheet', () => {
  test('should return status code 201', async () => {
    const response = await request(app).post('/timesheets').send(mockedTimehseets);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Timesheet created');
  });
  test('should return status code 400', async () => {
    const response = await request(app).post('/timesheets').send(mockedErrorTimehseets);

    expect(response.status).toBe(400);
  });
});

describe('GET /timesheet', () => {
  describe('Get all Timesheets', () => {
    test('should return status code 200 and Timesheets found', async () => {
      const response = await request(app).get('/timesheets').send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Timesheets found');
    });
    test('should return status code 404', async () => {
      const response = await request(app).get('/').send();

      expect(response.status).toBe(404);
    });
  });
  describe('Get all filtered Timesheets', () => {
    test('should return status code 200 and Timehseet/s found', async () => {
      const response = await request(app).get('/timesheets?description=knowledge transfer').send();

      expect(response.status).toBe(200);
    });
    test('should return status code 400 and Parameters are incorrect', async () => {
      const response = await request(app).get('/timesheets?alfajor=portezuelo').send();

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Parameters are incorrect');
    });
    test('should return status code 404 and No matches + server error', async () => {
      const response = await request(app).get('/timesheets?description=random').send();

      expect(response.status).toBe(404);
    });
  });
});

describe('Get timesheets/:id', () => {
  test('should return 200', async () => {
    const response = await request(app).get(`/timesheets/${timesheetId}`).send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Timesheet found');
  });
  test('should return 400', async () => {
    const response = await request(app).get(`/timesheets/${invalidId}`).send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid ID');
  });
  test('should return 404', async () => {
    const response = await request(app).get(`/timesheets/${idNotFound}`).send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Timesheet ID not found on database');
  });
});

describe('PUT /timesheets', () => {
  test('should return 200', async () => {
    const response = await request(app).put(`/timesheets/${timesheetId}`).send(editedMockedTimehseets);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Timesheet edited');
  });
  test('should return 404', async () => {
    const response = await request(app).put(`/timesheets/${idNotFound}`).send(editedMockedTimehseets);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Timesheet ID not found on database');
  });
  test('should return 404', async () => {
    const response = await request(app).put(`/timesheets/${invalidId}`).send(editedMockedTimehseets);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Invalid ID');
  });
  test('should return 400', async () => {
    const response = await request(app).put(`/timesheets/${timesheetId}`).send(EmptyMockedTimehseets);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Edited timesheet is empty');
  });
});

describe('DELETE /timesheets', () => {
  test('should return 204', async () => {
    const response = await request(app).delete(`/timesheets/${timesheetId}`).send();

    expect(response.status).toBe(204);
  });
  test('should return 404', async () => {
    const response = await request(app).delete(`/timesheets/${invalidId}`).send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Invalid ID');
  });
  test('should return 404', async () => {
    const response = await request(app).delete(`/timesheets/${idNotFound}`).send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Timesheet does not exist');
  });
});
