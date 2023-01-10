import request from 'supertest';
import app from '../app';
import Projects from '../models/Projects';
import Employees from '../models/Employees';
import projectsSeed from '../seeds/projects';
import employeesSeed from '../seeds/employees';

const mockedEmployees = {
  name: 'rodrigo',
  lastName: 'perez',
  phone: '1234567880',
  email: 'emailrandom@adinet.com',
  password: 'password12234',
  projects: ['634f42d0409f09628b8a1479'],
};

const SameEmailMockedEmployees = {
  name: 'rodrigo',
  lastName: 'perez',
  phone: '1234567880',
  email: 'laucan@furl.net',
  password: 'password1234',
};

const incompleteMockedEmployees = {
  name: 'Rodrigo',
  lastName: 'Perez',
  email: 'createemployee@furl.net',
  password: 'contraseña123',
};

const incorrectMockedEmployees = {
  name: 'rodrigo',
  age: 19,
  phone: '1234567880',
  email: 'emailrandom@adinet.com',
  password: 'password12234',
};

const editedMockedEmployees = {
  name: 'luis',
  lastName: 'miguel',
  phone: '2123212320',
};

const emptyMocked = {

};

let employeeId;
const notFoundId = '63576051fc13ae37e7000091';
const invalidId = '123';

function expectStatErrMsgHelper(response, statusCode, message) {
  expect(response.status).toBe(statusCode);
  expect(response.body.error).toBe(statusCode >= 400);
  expect(response.body.message).toBe(message);
}

beforeAll(async () => {
  await Employees.collection.insertMany(employeesSeed);
  await Projects.collection.insertMany(projectsSeed);
});

describe('POST /employees', () => {
  test('Should create an employee and show msg, error and data', async () => {
    const response = await request(app).post('/employees').send(mockedEmployees);

    expectStatErrMsgHelper(response, 201, 'Employee successfully created');
    // eslint-disable-next-line no-underscore-dangle
    expect(response.body.data).toMatchObject(mockedEmployees);
    // eslint-disable-next-line no-underscore-dangle
    employeeId = response.body.data._id;
  });

  test('Empty employee should be bad request (400)', async () => {
    const response = await request(app).post('/employees').send(emptyMocked);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });

  test('Should status 400 incomplete employee', async () => {
    const response = await request(app).post('/employees').send(incompleteMockedEmployees);

    // eslint-disable-next-line no-useless-escape
    expectStatErrMsgHelper(response, 400, 'There was an error: \"phone\" is required');
  });

  test('Status of an employee with an existing email should be 400', async () => {
    const response = await request(app).post('/employees').send(SameEmailMockedEmployees);

    expectStatErrMsgHelper(response, 400, 'Email already exists');
  });

  test('Incorrect key on employee should be bad request (400)', async () => {
    const response = await request(app).post('/employees').send(incorrectMockedEmployees);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
  });
});

describe('GET /employees', () => {
  describe('GET all', () => {
    test('Status, error and message tests - Successful', async () => {
      const response = await request(app).get('/employees').send();

      expectStatErrMsgHelper(response, 200, 'Employees found');
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET query filter', () => {
    test('Query param must be correct', async () => {
      const response = await request(app).get('/employees?asd=Pedro').send();

      expect(response.status).toBe(400);
      expectStatErrMsgHelper(response, 400, 'An error occurred');
    });

    test('Name query param must be correct and message be: "Employee found" - Status 200', async () => {
      const response = await request(app).get('/employees?name=lucas').send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Employee found');
    });

    test('Last name query param must be correct - Status 200', async () => {
      const response = await request(app).get('/employees?lastName=salchichon').send();

      expect(response.status).toBe(200);
    });

    test('Phone query param must be correct - Status 200', async () => {
      const response = await request(app).get('/employees?phone=555555555').send();

      expect(response.status).toBe(200);
    });

    test('Email query param must be correct - Status 200', async () => {
      const response = await request(app).get('/employees?email=pepepecas@gmail.com').send();

      expect(response.status).toBe(200);
    });

    test('Name query param must be correct - Status 404', async () => {
      const response = await request(app).get('/employees?name=a').send();

      expect(response.status).toBe(404);
    });

    test('Last name query param must be correct - Status 404', async () => {
      const response = await request(app).get('/employees?lastName=b').send();

      expect(response.status).toBe(404);
    });

    test('Phone query param must be correct - Status 404', async () => {
      const response = await request(app).get('/employees?phone=2').send();

      expect(response.status).toBe(404);
    });

    test('Email query param must be correct - Status 404', async () => {
      const response = await request(app).get('/employees?email=lorlaor0@furl.net').send();

      expect(response.status).toBe(404);
    });
  });
});

describe('GET /employees/:id', () => {
  test('Status, error and message tests - Successful', async () => {
    const response = await request(app).get(`/employees/${employeeId}`).send();

    expectStatErrMsgHelper(response, 200, 'Employee found');
  });

  test('Employee not found', async () => {
    const response = await request(app).get(`/employees/${notFoundId}`).send();

    expectStatErrMsgHelper(response, 404, 'Employee not found');
  });

  test('Employee invalid ID', async () => {
    const response = await request(app).get(`/employees/${invalidId}`).send();

    expectStatErrMsgHelper(response, 400, 'Invalid ID');
  });
});

describe('PUT /employees', () => {
  test('Should change the employee - Status, msg and error', async () => {
    const response = await request(app).put(`/employees/${employeeId}`).send(editedMockedEmployees);

    expectStatErrMsgHelper(response, 200, `Employee widh id ${employeeId} edited`);
  });

  test('Empty data should response status 400 - msg', async () => {
    const response = await request(app).put(`/employees/${employeeId}`).send(emptyMocked);

    expectStatErrMsgHelper(response, 400, 'You must edit at least one field');
  });

  test('Not found id should return 404', async () => {
    const response = await request(app).put(`/employees/${notFoundId}`).send(editedMockedEmployees);

    expectStatErrMsgHelper(response, 404, 'Employee does not exist');
  });

  test('Invalid ID should return 400', async () => {
    const response = await request(app).put('/employees/1').send(editedMockedEmployees);

    expectStatErrMsgHelper(response, 400, 'Invalid ID');
  });
});

describe('DELETE /employees', () => {
  test('Should delete an employee', async () => {
    const response = await request(app).delete(`/employees/${employeeId}`).send();

    expect(response.status).toBe(200);
  });

  test('Succesfull delete => data must be undefined', async () => {
    const response = await request(app).delete(`/employees/${employeeId}`).send();

    expect(response.body.data).toBe(undefined);
  });

  test('Invalid id => status 400, error true and msg', async () => {
    const response = await request(app).delete('/employees/1').send(employeeId);

    expectStatErrMsgHelper(response, 400, 'Invalid ID');
  });
});
