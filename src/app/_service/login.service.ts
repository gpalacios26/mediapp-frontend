import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../_model/menu';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  

  private url: string = `${environment.HOST}/oauth/token`

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(usuario: string, contrasena: string){
    
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

  estaLogueado(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    if(token){
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
        this.router.navigate(['login']);
      });
    }else{
      sessionStorage.clear();
      this.router.navigate(['login']);
    }    
  }

  enviarCorreo(correo: string){
    return this.http.post<number>(`${environment.HOST}/login/enviarCorreo`, correo, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  verificarTokenReset(token: string) {  
    return this.http.get<number>(`${environment.HOST}/login/restablecer/verificar/${token}`);
  }

  restablecer(token: string, clave: string) {
    return this.http.post(`${environment.HOST}/login/restablecer/${token}`, clave, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }
 
}
