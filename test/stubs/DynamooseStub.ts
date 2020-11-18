import { SinonSandbox, SinonStub } from 'sinon';
import dynamoose from 'dynamoose';
import Alumno from '../../src/models/Alumno';

export default class DynamooseStub {
  fakes: {
    create: SinonStub;
    update: SinonStub;
    delete: SinonStub;
    scan: SinonStub;
    get: SinonStub;
  };

  stub: SinonStub;

  constructor(sandbox: SinonSandbox) {
    this.fakes = {
      create: sandbox.stub(),
      update: sandbox.stub(),
      delete: sandbox.stub(),
      scan: sandbox.stub(),
      get: sandbox.stub()
    };

    this.stub = sandbox.stub(dynamoose, 'model');
    this.stub.returns(this.fakes);
  }

  setScanToReturn(alumnos: Alumno[]): void {
    this.fakes.scan.returns({
      exec: () => Promise.resolve(alumnos)
    });
  }

  setGetToReturn(alumno: Alumno, expectedMatricula: string): void {
    this.fakes.get.callsFake((matricula: string) => {
      if (matricula === expectedMatricula) {
        return Promise.resolve(alumno);
      }
      return Promise.resolve(null);
    });
  }
}
