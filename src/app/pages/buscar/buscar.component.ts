import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FiltroConsultaDTO } from 'src/app/_dto/filtroConsultaDTO';
import { ConsultaService } from 'src/app/_service/consulta.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { Consulta } from 'src/app/_model/consulta';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BuscarDialogoComponent } from './buscar-dialogo/buscar-dialogo.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  form: FormGroup;
  maxFecha: Date = new Date();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  displayedColumns = ['paciente', 'medico', 'especialidad', 'fecha', 'acciones'];
  dataSource: MatTableDataSource<Consulta>;

  constructor(
    private consultaService: ConsultaService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl()
    });
  }

  buscar() {

    let fecha = this.form.value['fechaConsulta'];
    fecha = fecha != null ? moment(fecha).format('YYYY-MM-DDTHH:mm:ss') : '';

    let filtro = new FiltroConsultaDTO(this.form.value['dni'], this.form.value['nombreCompleto'], fecha);

    /*
     {
       dni : ''
       nombreCompleto: xxxxx
       fecha: ''
     }

     {       
       nombreCompleto: xxxxx        
     }
   */
  
    if (filtro.fechaConsulta.length === 0) {
      delete filtro.fechaConsulta;
    }

    if (filtro.dni.length === 0) {
      delete filtro.dni;
    }

    if (filtro.nombreCompleto.length === 0) {
      delete filtro.nombreCompleto
    }
  
    if (filtro.fechaConsulta != null) {
      this.consultaService.buscarFecha(filtro.fechaConsulta).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.consultaService.buscarOtros(filtro).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  verDetalle(consulta: Consulta) {
    this.dialog.open(BuscarDialogoComponent, {
      data: consulta
    });
  }
}
