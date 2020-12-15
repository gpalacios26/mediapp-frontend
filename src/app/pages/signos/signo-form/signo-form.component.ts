import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Paciente } from 'src/app/_model/paciente';
import { Signos } from 'src/app/_model/signos';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignosService } from 'src/app/_service/signos.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogPacienteComponent } from '../../dialog-paciente/dialog-paciente.component';

@Component({
  selector: 'app-signo-form',
  templateUrl: './signo-form.component.html',
  styleUrls: ['./signo-form.component.css']
})
export class SignoFormComponent implements OnInit {

  public id: number;
  public edicion: boolean;
  public titulo: string;
  public form: FormGroup;
  public signo: Signos;
  public pacientes: Paciente[];
  public maxFecha: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private signosService: SignosService,
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.getPacientes();

    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.id = params['id'];
        this.edicion = true;
        this.titulo = "Editar Signos Vitales";
        this.getSigno();
      } else {
        this.edicion = false;
        this.titulo = "Agregar Signos Vitales";
      }
    });
  }

  crearFormulario() {
    this.form = this.fb.group({
      idSigno: [0],
      paciente: this.fb.group({
        idPaciente: ['', Validators.required]
      }),
      fecha: ['', Validators.required],
      temperatura: ['', Validators.required],
      pulso: ['', Validators.required],
      ritmo: ['', Validators.required]
    });
  }

  getPacientes() {
    this.pacienteService.listar().subscribe(
      response => {
        this.pacientes = response;

        this.pacientes.unshift({
          idPaciente: null,
          nombres: 'Seleccione',
          apellidos: 'Paciente',
          dni: null,
          direccion: null,
          telefono: null,
          email: null
        });
      },
      error => {
        console.log(error);
        this.router.navigateByUrl('/signos');
        this.snackBar.open('Ocurrio un error en la consulta', 'AVISO', { duration: 2000 });
      }
    );
  }

  getSigno() {
    this.signosService.listarPorId(this.id).subscribe(
      response => {
        this.signo = response;
        this.form.setValue({
          idSigno: this.signo.idSigno,
          paciente: {
            idPaciente: (this.signo.paciente.idPaciente).toString()
          },
          fecha: this.signo.fecha,
          temperatura: this.signo.temperatura,
          pulso: this.signo.pulso,
          ritmo: this.signo.ritmo
        });

        console.log(this.form.value);
      },
      error => {
        console.log(error);
        this.router.navigateByUrl('/signos');
        this.snackBar.open('Ocurrio un error en la consulta', 'AVISO', { duration: 2000 });
      }
    );
  }

  guardar() {
    let formulario = this.form.value;

    let paciente = new Paciente();
    paciente.idPaciente = formulario.paciente.idPaciente;

    let signo = new Signos(formulario.idSigno, paciente, formulario.fecha, formulario.temperatura, formulario.pulso, formulario.ritmo)

    let peticion: Observable<any>;
    let mensaje: string;

    if (this.edicion) {
      peticion = this.signosService.modificar(signo);
      mensaje = 'Signo Vital actualizado';
    } else {
      peticion = this.signosService.registrar(signo);
      mensaje = 'Signo Vital registrado';
    }

    peticion.subscribe(
      response => {
        this.signo = response;
        this.router.navigateByUrl('/signos');
        this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
      }
    );
  }

  agregarPaciente() {
    let paciente = new Paciente();

    const pacienteDialog = this.dialog.open(DialogPacienteComponent, {
      data: {
        titulo: 'Agregar Paciente', paciente: paciente
      }
    });
    pacienteDialog.afterClosed().subscribe(result => {
      if (result != false) {
        paciente.idPaciente = result.idPaciente;
        paciente.nombres = result.nombres;
        paciente.apellidos = result.apellidos;
        paciente.dni = result.dni;
        paciente.telefono = result.telefono;
        paciente.direccion = result.direccion;
        // Validar que tenga datos
        let errors = 0;
        if (paciente.nombres === undefined || paciente.nombres == '') { errors++; }
        if (paciente.apellidos === undefined || paciente.apellidos == '') { errors++; }
        if (paciente.dni === undefined || paciente.dni == '') { errors++; }
        if (paciente.telefono === undefined || paciente.telefono == '') { errors++; }
        if (paciente.direccion === undefined || paciente.direccion == '') { errors++; }
        // Validar que no tenga errores
        if (errors > 0) {
          this.snackBar.open('Debe ingresar los datos de un paciente', 'AVISO', { duration: 2000 });
        } else {
          this.pacienteService.registrar(paciente).subscribe(
            () => {
              this.getPacientes();
              this.snackBar.open('Paciente agregado correctamente', 'AVISO', { duration: 2000 });
              if (this.edicion) {
                this.getSigno();
              }
            }
          );
        }
      }
    });
  }

}