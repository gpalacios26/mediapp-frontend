import { DetalleConsulta } from './detalleConsulta';
import { Especialidad } from './especialidad';
import { Medico } from './medico';
import { Paciente } from './paciente';

export class Consulta {
    idConsulta: number;
    paciente: Paciente;
    medico: Medico;
    especialidad: Especialidad;
    fecha: string; //2020-11-07T11:30:05 ISODate || moment.js
    numConsultorio: string;
    detalleConsulta: DetalleConsulta[];
}