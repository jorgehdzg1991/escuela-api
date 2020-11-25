import dynamoose from 'dynamoose';
import Repository from './Repository';
import Alumno from '../models/Alumno';

const alumnoSchema = new dynamoose.Schema({
  matricula: {
    type: String,
    hashKey: true
  },
  nombre: String,
  apellidos: String,
  escuela: String,
  correo: String,
  semestre: String,
  carrera: String
});

export default class AlumnoRepository implements Repository<Alumno> {
  // eslint-disable-next-line class-methods-use-this
  get db(): any {
    return dynamoose.model(process.env.ALUMNOS_TABLE || '', alumnoSchema, {
      create: false
    });
  }

  async create(alumno: Alumno): Promise<Alumno> {
    await this.db.create(alumno.toJS());
    return alumno;
  }

  async update(alumno: Alumno): Promise<Alumno> {
    await this.db.update(alumno.toJS());
    return alumno;
  }

  async delete(alumno: Alumno): Promise<void> {
    await this.db.delete(alumno.matricula);
  }

  async get(): Promise<Alumno[]> {
    const results = await this.db.scan().exec();
    return results.map((r: any) => Alumno.fromPlainObject(r));
  }

  async getById(matricula: string): Promise<Alumno | null> {
    const result = await this.db.get(matricula);
    if (!result) {
      return null;
    }
    return Alumno.fromPlainObject(result);
  }
}
