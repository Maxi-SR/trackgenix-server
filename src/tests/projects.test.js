import request from 'supertest';
import app from '../app';

import Projects from '../models/Projects';
import Employees from '../models/Employees';

import projectsSeed from '../seeds/projects';
import employeesSeed from '../seeds/employees';

beforeAll(async () => {
  await Projects.collection.insertMany(projectsSeed);
  await Employees.collection.insertMany(employeesSeed);
});

const msg200 = 'SUCCESS - 200 status code - successfull request';
const msg201 = 'SUCCESS - 201 status cude - written data in DB';
const msg204 = 'SUCCESS - 204 status cude - deleted data from DB';
const msg400 = 'ERROR - 400 status code - bad request';
const msg404 = 'ERROR - 404 status code - nonexistent on DB';

const projectOK = {
  name: 'Trying to post a project',
  description: 'Posting a project with superjet',
  startDate: '2020-01-01T00:00:00.000+00:00',
  endDate: '2020-01-02T00:00:00.000+00:00',
  clientName: 'Graves Braum',
};

const projectMissingRequieredKey = {
  name: 'Trying to post a project',
  description: 'Posting a project with superjet',
  startDate: '2020-01-01T00:00:00.000+00:00',
  endDate: '2020-01-02T00:00:00.000+00:00',
};

const projectFullFutureDate = {
  name: 'Trying to post a project',
  description: 'Posting a project with superjet',
  startDate: '2020-01-01T00:00:00.000+00:00',
  endDate: '2025-01-02T00:00:00.000+00:00',
  clientName: 'Graves Braum',
};

const projectUndefinedKey = {
  fakeKey1234: 'This is a fake value',
  name: 'Trying to post a project',
  description: 'Posting a project with superjet',
  startDate: '2020-01-01T00:00:00.000+00:00',
  endDate: '2020-01-02T00:00:00.000+00:00',
  clientName: 'Graves Braum',
};

const projectFullEmptyValue = {
  name: '',
  description: 'Posting a project with superjet',
  startDate: '2020-01-01T00:00:00.000+00:00',
  endDate: '2020-01-02T00:00:00.000+00:00',
  clientName: 'Graves Braum',
};

const projectName1Char = {
  name: 'a',
  description: 'Posting a project with superjet',
  startDate: '2020-01-01T00:00:00.000+00:00',
  endDate: '2020-01-02T00:00:00.000+00:00',
  clientName: 'Graves Braum',
};

const projectName51Char = {
  name: '123456789012345678901234567890123456789012345678901',
  description: 'Posting a project with superjet',
  startDate: '2020-01-01T00:00:00.000+00:00',
  endDate: '2020-01-02T00:00:00.000+00:00',
  clientName: 'Graves Braum',
};

const projectArray = [projectOK, projectOK];

const arrayInsteadOfStringKeyValue = {
  name: projectOK,
  description: 'Posting a project with superjet',
  startDate: '2020-01-01T00:00:00.000+00:00',
  endDate: '2020-01-02T00:00:00.000+00:00',
  clientName: 'Graves Braum',
};

const stringInsteadOfDate = {
  name: 'Trying to post a project',
  description: 'Posting a project with superjet',
  startDate: 'abcd1234',
  endDate: '2020-01-02T00:00:00.000+00:00',
  clientName: 'Graves Braum',
};

const updateOnlyName = {
  name: 'Updated name',
};

const validId = '634d924e260e0ee548943dc7';

let projectId;

const employeeOK = {
  employeeId: '6353177e414b58f4591599e0',
};

const employeeNonexistentID = {
  employeeId: '634f281aca551819ef903f76',
};

describe('GET All /projects', () => {
  describe(msg200, () => {
    test('getAll with a non empty DB', async () => {
      const response = await request(app).get('/projects').send();
      expect(response.status).toBe(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.message).toBe('Projects found');
    });
  });
  describe(msg400, () => {
    test('getAll with an invalid key query param', async () => {
      const response = await request(app).get('/projects/?fakeKey1234=fake').send();
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
      expect(response.body.message).toBe('Parameters are incorrect');
    });
  });
  describe(msg404, () => {
    test('getAll with valid key query param but nonexistent value on DB', async () => {
      const response = await request(app).get('/projects/?name=inexistent name').send();
      expect(response.status).toBe(404);
      expect(response.body.error).toBeTruthy();
      expect(response.body.message).toBe('Project not found');
    });
  });
});

describe('GET ById /projects/:id', () => {
  describe(msg200, () => {
    test('getById with an existent ID on DB', async () => {
      const response = await request(app).get(`/projects/${validId}`).send();
      expect(response.status).toBe(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.message).toBe('Project found');
    });
  });
  describe(msg400, () => {
    test('getById with invalid ID', async () => {
      const response = await request(app).get('/projects/1').send();
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
      expect(response.body.message).toBe('Invalid ID');
    });
  });
  describe(msg404, () => {
    test('getById with valid but inexistent ID', async () => {
      const response = await request(app).get('/projects/634d73ca260e0ee548943dc4').send();
      expect(response.status).toBe(404);
      expect(response.body.error).toBeTruthy();
      expect(response.body.message).toBe('Project ID not found on database');
    });
  });
});

describe('POST /projects', () => {
  describe(msg201, () => {
    test('valid body req', async () => {
      const response = await request(app).post('/projects').send(projectOK);
      // eslint-disable-next-line no-underscore-dangle
      projectId = response.body.data._id;
      expect(response.status).toBe(201);
      expect(response.body.error).toBeFalsy();
    });
  });
  describe(msg400, () => {
    test('missing requiered key in body req', async () => {
      const response = await request(app).post('/projects').send(projectMissingRequieredKey);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('future date in body req', async () => {
      const response = await request(app).post('/projects').send(projectFullFutureDate);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('key in body req not defined on schema', async () => {
      const response = await request(app).post('/projects').send(projectUndefinedKey);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('empty name value on body req', async () => {
      const response = await request(app).post('/projects').send(projectFullEmptyValue);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('name value shorter than 3 characters', async () => {
      const response = await request(app).post('/projects').send(projectName1Char);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('name value longer than 50 characters', async () => {
      const response = await request(app).post('/projects').send(projectName51Char);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('array of two objects as body req', async () => {
      const response = await request(app).post('/projects').send(projectArray);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('array on name value instead of string', async () => {
      const response = await request(app).post('/projects').send(arrayInsteadOfStringKeyValue);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('string instead of date on startDate key value', async () => {
      const response = await request(app).post('/projects').send(stringInsteadOfDate);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });
});

describe('DELETE /projects', () => {
  describe(msg204, () => {
    test('existent ID on DB', async () => {
      const response = await request(app).delete(`/projects/${projectId}`).send();
      expect(response.status).toBe(204);
      expect(response.body.error).toBeFalsy();
    });
  });
  describe(msg400, () => {
    test('invalid ID format on route request', async () => {
      const response = await request(app).delete('/projects/1').send();
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });
  describe(msg404, () => {
    test('already erased ID from DB', async () => {
      const response = await request(app).delete(`/projects/${projectId}`).send();
      expect(response.status).toBe(404);
      expect(response.body.error).toBeTruthy();
    });
    test('inexistent ID on DB', async () => {
      const response = await request(app).delete('/projects/634d73ca260e0ee548943df1').send();
      expect(response.status).toBe(404);
      expect(response.body.error).toBeTruthy();
    });
  });
});

describe('PUT /projects', () => {
  describe(msg200, () => {
    test('update only name in a valid ID on DB', async () => {
      const response = await request(app).put(`/projects/${validId}`).send(updateOnlyName);
      expect(response.status).toBe(200);
      expect(response.body.error).toBeFalsy();
      expect(response.body.message).toBe('Project has been changed');
    });
  });
  describe(msg400, () => {
    test('trying to update a key nonexistent on Schema', async () => {
      const response = await request(app).put(`/projects/${validId}`).send(projectUndefinedKey);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('empty key value', async () => {
      const response = await request(app).put(`/projects/${validId}`).send(projectFullEmptyValue);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('invalid ID', async () => {
      const response = await request(app).put('/projects/1').send();
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });
  describe(msg404, () => {
    test('inexistent ID on DB', async () => {
      const response = await request(app).put('/projects/634d73ca260e0ee548943df1').send(updateOnlyName);
      expect(response.status).toBe(404);
      expect(response.body.error).toBeTruthy();
    });
  });
});

describe('PUT /projects/:id/assignEmployee', () => {
  describe(msg201, () => {
    test('assign a valid employee', async () => {
      const response = await request(app).put('/projects/634d924e260e0ee548943dc7/assignEmployee').send(employeeOK);
      expect(response.status).toBe(201);
      expect(response.body.error).toBeFalsy();
      expect(response.body.message).toBe('Employee has been added');
    });
  });
  describe(msg400, () => {
    test('empty ID project', async () => {
      const response = await request(app).put('/projects//assignEmployee').send(employeeOK);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('invalid ID project', async () => {
      const response = await request(app).put('/projects/6/assignEmployee').send(employeeOK);
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('empty employee ID', async () => {
      const response = await request(app).put('/projects/634f42d0409f09628b8a1479/assignEmployee').send('');
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
    test('invalid employee ID', async () => {
      const response = await request(app).put('/projects/634f42d0409f09628b8a1479/assignEmployee').send('1');
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });
  describe(msg404, () => {
    test('nonexistent ID project', async () => {
      const response = await request(app).put('/projects/634f42d0409f09628b8a1471/assignEmployee').send(employeeOK);
      expect(response.status).toBe(404);
      expect(response.body.error).toBeTruthy();
    });
    test('nonexistent employee ID', async () => {
      const response = await request(app).put('/projects/634f42d0409f09628b8a1479/assignEmployee').send(employeeNonexistentID);
      expect(response.status).toBe(404);
      expect(response.body.error).toBeTruthy();
    });
  });
});
