import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paciente } from 'src/app/_model/paciente';

@Component({
  selector: 'app-dialog-paciente',
  templateUrl: './dialog-paciente.component.html',
  styleUrls: ['./dialog-paciente.component.css']
})
export class DialogPacienteComponent implements OnInit {

  public paciente: Paciente;

  constructor(
    public dialogRef: MatDialogRef<DialogPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.paciente = new Paciente();
    this.paciente.idPaciente = 0;
    this.paciente.nombres = this.data.paciente.nombres;
    this.paciente.apellidos = this.data.paciente.apellidos;
    this.paciente.dni = this.data.paciente.dni;
    this.paciente.telefono = this.data.paciente.telefono;
    this.paciente.direccion = this.data.paciente.direccion;
  }

}
