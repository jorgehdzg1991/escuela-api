import { SinonSandbox, SinonStub } from 'sinon';
import Alumno from '../../src/models/Alumno';
import AlumnoRepository from '../../src/persistence/AlumnoRepository';

export default class AlumnoRepositoryStub {
  fakes: {
    create: SinonStub;
    update: SinonStub;
    delete: SinonStub;
    get: SinonStub;
    getById: SinonStub;
  };

  constructor(sandbox: SinonSandbox) {
    this.fakes = {
      create: sandbox.stub(AlumnoRepository.prototype, 'create'),
      update: sandbox.stub(AlumnoRepository.prototype, 'update'),
      delete: sandbox.stub(AlumnoRepository.prototype, 'delete'),
      get: sandbox.stub(AlumnoRepository.prototype, 'get'),
      getById: sandbox.stub(AlumnoRepository.prototype, 'getById')
    };
  }

  setGetToReturn(alumnos: Alumno[]): void {
    this.fakes.get.returns(Promise.resolve(alumnos));
  }

  setGetToFailWith(error: Error): void {
    this.fakes.get.returns(Promise.reject(error));
  }

  setGetByIdToReturn(alumno: Alumno): void {
    this.fakes.getById.returns(Promise.resolve(alumno));
  }

  setGetByIdToReturnNull(): void {
    this.fakes.getById.returns(Promise.resolve(null));
  }

  setGetByIdToFailWith(error: Error): void {
    this.fakes.getById.returns(Promise.reject(error));
  }

  setCreateToSucceed(): void {
    this.fakes.create.callsFake((alumno: Alumno) => Promise.resolve(alumno));
  }

  setCreateToFailWith(error: Error): void {
    this.fakes.create.returns(Promise.reject(error));
  }

  setUpdateToSucceed(): void {
    this.fakes.update.callsFake((alumno: Alumno) => Promise.resolve(alumno));
  }

  setUpdateToReturnNull(): void {
    this.fakes.update.returns(Promise.resolve(null));
  }

  setUpdateToFailWith(error: Error): void {
    this.fakes.update.returns(Promise.reject(error));
  }

  setDeleteToSucceed(): void {
    this.fakes.delete.returns(Promise.resolve());
  }

  setDeleteToFailWith(error: Error): void {
    this.fakes.delete.returns(Promise.reject(error));
  }
}
