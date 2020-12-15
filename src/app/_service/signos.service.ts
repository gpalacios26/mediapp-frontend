import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Signos } from '../_model/signos';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignosService extends GenericService<Signos>{

  private signosCambio = new Subject<Signos[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`);
  }

  getSignosCambio() {
    return this.signosCambio.asObservable();
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setSignosCambio(signos: Signos[]) {
    this.signosCambio.next(signos);
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

}
