import { Paciente } from "./paciente";

export class Signos {
    
    constructor(
        public idSigno: number,
        public paciente: Paciente,
        public fecha: string,
        public temperatura: string,
        public pulso: string,
        public ritmo: string
    ) { }
}