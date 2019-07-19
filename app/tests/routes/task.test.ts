import chai from 'chai';
import chaiHttp from 'chai-http';
import { ITaskModel } from "../../core/types/models";

const expect = chai.expect;
chai.use(chaiHttp);

import server from '../../index';

describe('Tasks endpoints', () => {
  // this.timeout(5000); // How long to wait for a response (ms)
  const taskData: ITaskModel = {
    title: 'Test task',
    description: 'A description of the test task',
    date: '2019-06-03 15:02:11',
    status: 'Pending',
    is_important: true,
    user: '5cee861d04d9f4214dc8dce6',
  };

  beforeEach(() => {

  });

  afterEach(() => {

  });

  // POST - Fail to create a task
  it('should fail to create the task', () => {
    return chai.request(server)
      .post('/v1/tasks/create')
      .send({})
      .then((res) => {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('errors');
      });
  });

  // POST - Create a task
  it('should create a task', () => {
    return chai.request(server)
      .post('/v1/tasks/create')
      .send(taskData)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title', taskData.title);
        taskData.id = res.body._id;
      });
  });

  // PUT - Update a task
  it('should update a task', () => {
    taskData.title = 'Test task update';
    taskData.is_important = false;
    taskData.status = 'Done';
    return chai.request(server)
      .put(`/v1/tasks/${taskData.id}`)
      .send(taskData)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title', taskData.title);
      });
  });

  // GET - List all tasks
  it('should return all tasks', () => {
    return chai.request(server)
      .get('/v1/tasks')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });

  // GET - Invalid path
  it('should return Not Found', () => {
    return chai.request(server)
      .get('/v1/invalid/path')
      .then((res) => {
        expect(res).to.have.status(404);
      })
      .catch((err) => {
        expect(err).to.have.status(404);
      });
  });

  // GET - Get one task
  it('should get one task', () => {
    return chai.request(server)
      .get(`/v1/tasks/${taskData.id}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title');
      });
  });

  // DELETE - Delete a task
  it('should delete a task', () => {
    return chai.request(server)
      .delete(`/v1/tasks/${taskData.id}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
      });
  });
});

