import { Express, Request, Response } from 'express';
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK
} from 'http-status-codes';
import BaseApi from './BaseApi';
import AlumnoRepository from '../persistence/AlumnoRepository';
import respond from '../utils/response';
import Alumno from '../models/Alumno';

export default class AlumnoApi extends BaseApi {
  static BASE_PATH = '/api/alumnos';

  static mount(app: Express): AlumnoApi {
    return new AlumnoApi(app);
  }

  initializeRoutes(): void {
    this.app.get(AlumnoApi.BASE_PATH, AlumnoApi.getList);
    this.app.get(`${AlumnoApi.BASE_PATH}/:matricula`, AlumnoApi.getByMatricula);
    this.app.post(AlumnoApi.BASE_PATH, AlumnoApi.create);
    this.app.put(`${AlumnoApi.BASE_PATH}/:matricula`, AlumnoApi.update);
    this.app.delete(`${AlumnoApi.BASE_PATH}/:matricula`, AlumnoApi.delete);
  }

  private static validateAlumnoRequestBody(body: any): boolean {
    const { nombre, apellidos, escuela, correo, semestre, carrera } = body;
    return nombre && apellidos && escuela && correo && semestre && carrera;
  }

  static async getList(req: Request, res: Response): Promise<void> {
    try {
      const alumnoRepository = new AlumnoRepository();
      const alumnos = await alumnoRepository.get();
      respond(
        res,
        OK,
        alumnos.map(a => a.toJS())
      );
    } catch (e) {
      console.error(e);
      respond(res, INTERNAL_SERVER_ERROR);
    }
  }

  static async getByMatricula(
    req: Request<{ matricula: string }>,
    res: Response
  ): Promise<void> {
    try {
      const alumnoRepository = new AlumnoRepository();
      const alumno = await alumnoRepository.getById(req.params.matricula);
      if (!alumno) {
        respond(res, NOT_FOUND);
        return;
      }
      respond(res, OK, alumno.toJS());
    } catch (e) {
      console.error(e);
      respond(res, INTERNAL_SERVER_ERROR);
    }
  }

  static async create(
    req: Request<
      {},
      any,
      {
        nombre: string;
        apellidos: string;
        escuela: string;
        correo: string;
        semestre: string;
        carrera: string;
      }
    >,
    res: Response
  ): Promise<void> {
    try {
      if (!AlumnoApi.validateAlumnoRequestBody(req.body)) {
        respond(res, BAD_REQUEST);
        return;
      }

      const alumno = Alumno.newAlumno(
        req.body.nombre,
        req.body.apellidos,
        req.body.escuela,
        req.body.correo,
        req.body.semestre,
        req.body.carrera
      );

      const alumnoRepository = new AlumnoRepository();
      await alumnoRepository.create(alumno);

      respond(res, OK, alumno.toJS());
    } catch (e) {
      console.error(e);
      respond(res, INTERNAL_SERVER_ERROR);
    }
  }

  static async update(
    req: Request<
      { matricula: string },
      any,
      {
        nombre: string;
        apellidos: string;
        escuela: string;
        correo: string;
        semestre: string;
        carrera: string;
      }
    >,
    res: Response
  ): Promise<void> {
    try {
      if (!AlumnoApi.validateAlumnoRequestBody(req.body)) {
        respond(res, BAD_REQUEST);
        return;
      }

      const alumnoRepository = new AlumnoRepository();
      const alumno = await alumnoRepository.getById(req.params.matricula);

      if (!alumno) {
        respond(res, NOT_FOUND);
        return;
      }

      alumno.nombre = req.body.nombre;
      alumno.apellidos = req.body.apellidos;
      alumno.escuela = req.body.escuela;
      alumno.correo = req.body.correo;
      alumno.semestre = req.body.semestre;
      alumno.carrera = req.body.carrera;

      await alumnoRepository.update(alumno);

      respond(res, OK, alumno.toJS());
    } catch (e) {
      console.error(e);
      respond(res, INTERNAL_SERVER_ERROR);
    }
  }

  static async delete(
    req: Request<{ matricula: string }>,
    res: Response
  ): Promise<void> {
    try {
      const alumnoRepository = new AlumnoRepository();
      const alumno = await alumnoRepository.getById(req.params.matricula);

      if (!alumno) {
        respond(res, NOT_FOUND);
        return;
      }

      await alumnoRepository.delete(alumno);

      respond(res, OK, alumno.toJS());
    } catch (e) {
      console.error(e);
      respond(res, INTERNAL_SERVER_ERROR);
    }
  }
}
