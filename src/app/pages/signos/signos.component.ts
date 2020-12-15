import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SignosService } from '../../_service/signos.service';
import { Signos } from '../../_model/signos';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  public displayedColumns = ['idSigno', 'nombres', 'apellidos', 'temperatura', 'pulso', 'ritmo', 'acciones'];
  public dataSource: MatTableDataSource<Signos>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    private signosService: SignosService
  ) { }

  ngOnInit(): void {
    this.signosService.getSignosCambio().subscribe(data => {
      this.initTable(data);
    });

    this.signosService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });

    this.signosService.listar().subscribe(data => {
      this.initTable(data);
    });
  }

  initTable(data: Signos[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    const sortState: Sort = { active: 'idSigno', direction: 'desc' };
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    this.sort.sortChange.emit(sortState);
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(signos: Signos) {
    const confirmDialog = this.dialog.open(DialogConfirmComponent, {
      data: {
        titulo: 'Alerta',
        mensaje: 'Deseas eliminar el registro seleccionado?'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.signosService.eliminar(signos.idSigno).pipe(switchMap(() => {
          return this.signosService.listar();
        })).subscribe(data => {
          this.signosService.setSignosCambio(data);
          this.signosService.setMensajeCambio('Se eliminó');
        });
      }
    });
  }

}
