import expect from 'expect';
import sinon, { SinonSandbox } from 'sinon';
import request, { Response } from 'supertest';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK
} from 'http-status-codes';
import faker from 'faker';
import { v4 as uuid } from 'uuid';
import app from '../../src/app';
import AlumnoRepositoryStub from '../stubs/AlumnoRepository';
import Alumno from '../../src/models/Alumno';

function createAlumno(): Alumno {
  return Alumno.newAlumno(
    faker.name.firstName(),
    faker.name.lastName(),
    faker.company.companyName(),
    faker.internet.email(),
    faker.random.number().toString(),
    faker.random.words(3)
  );
}

function createAlumnos(n: number): Alumno[] {
  const alumnos: Alumno[] = [];
  for (let i = 0; i < n; i += 1) {
    alumnos.push(createAlumno());
  }
  return alumnos;
}

describe('AlumnoApi tests', () => {
  let sandbox: SinonSandbox;
  let alumnoRepositoryStub: AlumnoRepositoryStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    alumnoRepositoryStub = new AlumnoRepositoryStub(sandbox);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('GET /api/alumno', () => {
    it('should get a list of Alumnos', done => {
      const alumnos = createAlumnos(3);

      alumnoRepositoryStub.setGetToReturn(alumnos);

      request(app)
        .get('/api/alumnos')
        .expect('Content-Type', /json/)
        .expect(OK)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            expect(body).toEqual(alumnos.map(a => a.toJS()));
            expect(alumnoRepositoryStub.fakes.get.callCount).toBe(1);
            done();
          }
        });
    });

    it('should handle unknown errors', done => {
      const error = new Error('Oh no! Something terrible just happened :(');

      alumnoRepositoryStub.setGetToFailWith(error);

      request(app)
        .get('/api/alumnos')
        .expect('Content-Type', /json/)
        .expect(INTERNAL_SERVER_ERROR)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('GET /api/alumno/:matricula', () => {
    it('should get an alumno by matricula', done => {
      const alumno = createAlumno();

      alumnoRepositoryStub.setGetByIdToReturn(alumno);

      request(app)
        .get(`/api/alumnos/${alumno.matricula}`)
        .expect('Content-Type', /json/)
        .expect(OK)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            expect(body).toEqual(alumno.toJS());
            expect(alumnoRepositoryStub.fakes.getById.callCount).toBe(1);
            const call = alumnoRepositoryStub.fakes.getById.getCall(0);
            expect(call.args[0]).toBe(alumno.matricula);
            done();
          }
        });
    });

    it('should return 404 Not Found if Alumno does not exist', done => {
      const fakeMatricula = uuid();

      alumnoRepositoryStub.setGetByIdToReturnNull();

      request(app)
        .get(`/api/alumnos/${fakeMatricula}`)
        .expect('Content-Type', /json/)
        .expect(NOT_FOUND)
        .end(err => {
          if (err) {
            done(err);
          } else {
            expect(alumnoRepositoryStub.fakes.getById.callCount).toBe(1);
            const call = alumnoRepositoryStub.fakes.getById.getCall(0);
            expect(call.args[0]).toBe(fakeMatricula);
            done();
          }
        });
    });

    it('should handle unknown errors', done => {
      const error = new Error('Oh no! Something terrible just happened :(');

      alumnoRepositoryStub.setGetByIdToFailWith(error);

      request(app)
        .get('/api/alumnos/some-matricula')
        .expect('Content-Type', /json/)
        .expect(INTERNAL_SERVER_ERROR)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('POST /api/alumnos', () => {
    it('should create an Alumno', done => {
      const expectedAlumno = createAlumno();

      alumnoRepositoryStub.setCreateToSucceed();

      request(app)
        .post(`/api/alumnos`)
        .send({
          nombre: expectedAlumno.nombre,
          apellidos: expectedAlumno.apellidos,
          escuela: expectedAlumno.escuela,
          correo: expectedAlumno.correo,
          semestre: expectedAlumno.semestre,
          carrera: expectedAlumno.carrera
        })
        .expect('Content-Type', /json/)
        .expect(OK)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            const alumno = Alumno.fromPlainObject(body);
            expect(alumno.nombre).toBe(expectedAlumno.nombre);
            expect(alumno.apellidos).toBe(expectedAlumno.apellidos);
            expect(alumno.escuela).toBe(expectedAlumno.escuela);
            expect(alumno.correo).toBe(expectedAlumno.correo);
            expect(alumno.semestre).toBe(expectedAlumno.semestre);
            expect(alumno.carrera).toBe(expectedAlumno.carrera);
            expect(alumnoRepositoryStub.fakes.create.callCount).toBe(1);
            const call = alumnoRepositoryStub.fakes.create.getCall(0);
            expect(call.args[0]).toEqual(alumno);
            done();
          }
        });
    });

    it('should return 400 Bad Request if no body is sent', done => {
      alumnoRepositoryStub.setCreateToSucceed();

      request(app)
        .post('/api/alumnos')
        .expect('Content-Type', /json/)
        .expect(BAD_REQUEST)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should return 400 Bad Request if missing data in body', done => {
      const expectedAlumno = createAlumno();

      alumnoRepositoryStub.setCreateToSucceed();

      request(app)
        .post('/api/alumnos')
        .send({
          // property "nombre" is not sent
          apellidos: expectedAlumno.apellidos,
          escuela: expectedAlumno.escuela,
          correo: expectedAlumno.correo,
          semestre: expectedAlumno.semestre,
          carrera: expectedAlumno.carrera
        })
        .expect('Content-Type', /json/)
        .expect(BAD_REQUEST)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should handle unknown errors', done => {
      const expectedAlumno = createAlumno();
      const error = new Error('Oh no! Something terrible just happened :(');

      alumnoRepositoryStub.setCreateToFailWith(error);

      request(app)
        .post('/api/alumnos')
        .send({
          nombre: expectedAlumno.nombre,
          apellidos: expectedAlumno.apellidos,
          escuela: expectedAlumno.escuela,
          correo: expectedAlumno.correo,
          semestre: expectedAlumno.semestre,
          carrera: expectedAlumno.carrera
        })
        .expect('Content-Type', /json/)
        .expect(INTERNAL_SERVER_ERROR)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('PUT /api/alumnos/:matricula', () => {
    const expectedAlumno = createAlumno();

    it('should update an Alumno', done => {
      alumnoRepositoryStub.setGetByIdToReturn(expectedAlumno);
      alumnoRepositoryStub.setUpdateToSucceed();

      request(app)
        .put(`/api/alumnos/${expectedAlumno.matricula}`)
        .send({
          nombre: expectedAlumno.nombre,
          apellidos: expectedAlumno.apellidos,
          escuela: expectedAlumno.escuela,
          correo: expectedAlumno.correo,
          semestre: expectedAlumno.semestre,
          carrera: expectedAlumno.carrera
        })
        .expect('Content-Type', /json/)
        .expect(OK)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            const alumno = Alumno.fromPlainObject(body);
            expect(alumno).toEqual(expectedAlumno);
            expect(alumnoRepositoryStub.fakes.update.callCount).toBe(1);
            const call = alumnoRepositoryStub.fakes.update.getCall(0);
            expect(call.args[0]).toEqual(alumno);
            done();
          }
        });
    });

    it('should return 400 Bad Request if no body is sent', done => {
      alumnoRepositoryStub.setUpdateToSucceed();

      request(app)
        .put(`/api/alumnos/${expectedAlumno.matricula}`)
        .expect('Content-Type', /json/)
        .expect(BAD_REQUEST)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should return 400 Bad Request if missing data in body', done => {
      alumnoRepositoryStub.setUpdateToSucceed();

      request(app)
        .put(`/api/alumnos/${expectedAlumno.matricula}`)
        .send({
          // property "nombre" is not sent
          apellidos: expectedAlumno.apellidos,
          escuela: expectedAlumno.escuela,
          correo: expectedAlumno.correo,
          semestre: expectedAlumno.semestre,
          carrera: expectedAlumno.carrera
        })
        .expect('Content-Type', /json/)
        .expect(BAD_REQUEST)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should return 404 Not Found if Alumno does not exist', done => {
      alumnoRepositoryStub.setGetByIdToReturnNull();
      alumnoRepositoryStub.setUpdateToSucceed();

      request(app)
        .put(`/api/alumnos/${expectedAlumno.matricula}`)
        .send({
          nombre: expectedAlumno.nombre,
          apellidos: expectedAlumno.apellidos,
          escuela: expectedAlumno.escuela,
          correo: expectedAlumno.correo,
          semestre: expectedAlumno.semestre,
          carrera: expectedAlumno.carrera
        })
        .expect('Content-Type', /json/)
        .expect(NOT_FOUND)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should handle unknown errors', done => {
      const error = new Error('Oh no! Something terrible just happened :(');

      alumnoRepositoryStub.setGetByIdToReturn(expectedAlumno);
      alumnoRepositoryStub.setUpdateToFailWith(error);

      request(app)
        .put(`/api/alumnos/${expectedAlumno.matricula}`)
        .send({
          nombre: expectedAlumno.nombre,
          apellidos: expectedAlumno.apellidos,
          escuela: expectedAlumno.escuela,
          correo: expectedAlumno.correo,
          semestre: expectedAlumno.semestre,
          carrera: expectedAlumno.carrera
        })
        .expect('Content-Type', /json/)
        .expect(INTERNAL_SERVER_ERROR)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  describe('DELETE /api/alumno/:matricula', () => {
    const expectedAlumno = createAlumno();

    it('should delete an Alumno', done => {
      alumnoRepositoryStub.setGetByIdToReturn(expectedAlumno);
      alumnoRepositoryStub.setDeleteToSucceed();

      request(app)
        .delete(`/api/alumnos/${expectedAlumno.matricula}`)
        .expect('Content-Type', /json/)
        .expect(OK)
        .end((err, res: Response) => {
          if (err) {
            done(err);
          } else {
            const { body } = res;
            const alumno = Alumno.fromPlainObject(body);
            expect(alumno).toEqual(alumno);
            expect(alumnoRepositoryStub.fakes.delete.callCount).toBe(1);
            const call = alumnoRepositoryStub.fakes.delete.getCall(0);
            expect(call.args[0]).toEqual(alumno);
            done();
          }
        });
    });

    it('should return 404 Not Found if Alumno does not exist', done => {
      alumnoRepositoryStub.setGetByIdToReturnNull();
      alumnoRepositoryStub.setDeleteToSucceed();

      request(app)
        .delete(`/api/alumnos/${expectedAlumno.matricula}`)
        .expect('Content-Type', /json/)
        .expect(NOT_FOUND)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('should handle unknown errors', done => {
      const error = new Error('Oh no! Something terrible just happened :(');

      alumnoRepositoryStub.setGetByIdToReturn(expectedAlumno);
      alumnoRepositoryStub.setDeleteToFailWith(error);

      request(app)
        .delete(`/api/alumnos/${expectedAlumno.matricula}`)
        .expect('Content-Type', /json/)
        .expect(INTERNAL_SERVER_ERROR)
        .end(err => {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });
});
