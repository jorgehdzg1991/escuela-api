import { v4 as uuid } from 'uuid';

export default class Alumno {
  public matricula: string;

  public nombre: string;

  public apellidos: string;

  public escuela: string;

  public correo: string;

  public semestre: string;

  public carrera: string;

  constructor(
    matricula: string,
    nombre: string,
    apellidos: string,
    escuela: string,
    correo: string,
    semestre: string,
    carrera: string
  ) {
    this.matricula = matricula;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.escuela = escuela;
    this.correo = correo;
    this.semestre = semestre;
    this.carrera = carrera;
  }

  toJS(): any {
    return {
      matricula: this.matricula,
      nombre: this.nombre,
      apellidos: this.apellidos,
      escuela: this.escuela,
      correo: this.correo,
      semestre: this.semestre,
      carrera: this.carrera
    };
  }

  static newAlumno(
    nombre: string,
    apellidos: string,
    escuela: string,
    correo: string,
    semestre: string,
    carrera: string
  ): Alumno {
    const matricula = uuid();
    return new Alumno(
      matricula,
      nombre,
      apellidos,
      escuela,
      correo,
      semestre,
      carrera
    );
  }

  static fromPlainObject(result: any): Alumno {
    return new Alumno(
      result.matricula,
      result.nombre,
      result.apellidos,
      result.escuela,
      result.correo,
      result.semestre,
      result.carrera
    );
  }
}
