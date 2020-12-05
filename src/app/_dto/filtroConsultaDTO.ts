export class FiltroConsultaDTO {
    dni: string;
    nombreCompleto: string;
    fechaConsulta: string;

    constructor(dni: string, nombreCompleto: string, fechaConsulta: string) {
        this.dni = dni;
        this.nombreCompleto = nombreCompleto;
        this.fechaConsulta = fechaConsulta;
    }
}