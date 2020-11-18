import expect from 'expect';
import { v4 as uuid } from 'uuid';
import faker from 'faker';
import Alumno from '../../src/models/Alumno';

const alumnoProps = {
  matricula: uuid(),
  nombre: faker.name.firstName(),
  apellidos: faker.name.lastName(),
  escuela: faker.company.companyName(),
  correo: faker.internet.email(),
  semestre: faker.random.number().toString(),
  carrera: faker.random.words(3)
};

function createAlumno(): Alumno {
  return new Alumno(
    alumnoProps.matricula,
    alumnoProps.nombre,
    alumnoProps.apellidos,
    alumnoProps.escuela,
    alumnoProps.correo,
    alumnoProps.semestre,
    alumnoProps.carrera
  );
}

describe('Alumno model tests', () => {
  it('should create instance of Alumno with correct props', () => {
    const alumno = createAlumno();

    expect(alumno.matricula).toBe(alumnoProps.matricula);
    expect(alumno.nombre).toBe(alumnoProps.nombre);
    expect(alumno.apellidos).toBe(alumnoProps.apellidos);
    expect(alumno.escuela).toBe(alumnoProps.escuela);
    expect(alumno.correo).toBe(alumnoProps.correo);
    expect(alumno.semestre).toBe(alumnoProps.semestre);
    expect(alumno.carrera).toBe(alumnoProps.carrera);
  });

  it('should serialize instance of Alumno to a plain JS object', () => {
    const alumno = createAlumno();

    const alumnoJS = alumno.toJS();

    expect(alumnoJS).toEqual(alumnoProps);
  });

  it('should create a new instance of Alumno with factory method', () => {
    const alumno = Alumno.newAlumno(
      alumnoProps.nombre,
      alumnoProps.apellidos,
      alumnoProps.escuela,
      alumnoProps.correo,
      alumnoProps.semestre,
      alumnoProps.carrera
    );

    expect(alumno.matricula).toBeDefined();
    expect(typeof alumno.matricula).toBe('string');
    expect(alumno.matricula.length).toBe(36);
    expect(alumno.nombre).toBe(alumnoProps.nombre);
    expect(alumno.apellidos).toBe(alumnoProps.apellidos);
    expect(alumno.escuela).toBe(alumnoProps.escuela);
    expect(alumno.correo).toBe(alumnoProps.correo);
    expect(alumno.semestre).toBe(alumnoProps.semestre);
    expect(alumno.carrera).toBe(alumnoProps.carrera);
  });
});
