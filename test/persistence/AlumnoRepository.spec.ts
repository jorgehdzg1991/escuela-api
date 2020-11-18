import sinon, { SinonSandbox } from 'sinon';
import expect from 'expect';
import faker from 'faker';
import { v4 as uuid } from 'uuid';
import DynamooseStub from '../stubs/DynamooseStub';
import Alumno from '../../src/models/Alumno';
import AlumnoRepository from '../../src/persistence/AlumnoRepository';

function createAlumno(): Alumno {
  return new Alumno(
    uuid(),
    faker.name.firstName(),
    faker.name.lastName(),
    faker.company.companyName(),
    faker.internet.email(),
    faker.random.number().toString(),
    faker.random.words(3)
  );
}

describe('AlumnoRepository tests', () => {
  let sandbox: SinonSandbox;
  let dynamooseStub: DynamooseStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    dynamooseStub = new DynamooseStub(sandbox);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create an Alumno', async () => {
    const alumno = createAlumno();
    const repo = new AlumnoRepository();

    const result = await repo.create(alumno);

    expect(result).toEqual(alumno);
    expect(dynamooseStub.stub.callCount).toBe(1);
    expect(dynamooseStub.fakes.create.callCount).toBe(1);

    // obtenemos la primera llamada al stub de "create"
    const call = dynamooseStub.fakes.create.getCall(0);

    // esperamos que el primer argumento (y unico) sea el alumno convertido a JS plain object
    expect(call.args[0]).toEqual(alumno.toJS());
  });

  it('should update an Alumno', async () => {
    const alumno = createAlumno();
    const repo = new AlumnoRepository();

    const result = await repo.update(alumno);

    expect(result).toEqual(alumno);
    expect(dynamooseStub.fakes.update.callCount).toBe(1);

    const call = dynamooseStub.fakes.update.getCall(0);

    expect(call.args[0]).toEqual(alumno.toJS());
  });

  it('should delete an Alumno', async () => {
    const alumno = createAlumno();
    const repo = new AlumnoRepository();

    await repo.delete(alumno);

    expect(dynamooseStub.fakes.delete.callCount).toBe(1);

    const call = dynamooseStub.fakes.delete.getCall(0);

    expect(call.args[0]).toEqual(alumno.matricula);
  });

  it('should get all Alumnos', async () => {
    const alumnos = [createAlumno(), createAlumno(), createAlumno()];
    dynamooseStub.setScanToReturn(alumnos);

    const repo = new AlumnoRepository();

    const result = await repo.get();

    expect(result).toEqual(alumnos);
    expect(dynamooseStub.fakes.scan.callCount).toBe(1);
  });

  it('should return an alumno by matricula', async () => {
    const alumno = createAlumno();
    dynamooseStub.setGetToReturn(alumno, alumno.matricula);

    const repo = new AlumnoRepository();

    const result = await repo.getById(alumno.matricula);

    expect(result).toEqual(alumno);
    expect(dynamooseStub.fakes.get.callCount).toBe(1);

    const call = dynamooseStub.fakes.get.getCall(0);

    expect(call.args[0]).toBe(alumno.matricula);
  });

  it('should return null when alumno is not found', async () => {
    const alumno = createAlumno();
    dynamooseStub.setGetToReturn(alumno, 'wrong-matricula');

    const repo = new AlumnoRepository();

    const result = await repo.getById(alumno.matricula);

    expect(result).toBeNull();
  });
});
