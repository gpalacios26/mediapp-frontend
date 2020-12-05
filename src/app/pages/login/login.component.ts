import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/_service/login.service';
import { MenuService } from 'src/app/_service/menu.service';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";
import '../../../assets/login-animation.js';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: string;
  clave: string;
  mensaje: string;
  error: string;

  constructor(
    private loginService: LoginService,
    private menuService: MenuService,
    private router: Router

  ) { }

  ngOnInit(): void {
  }

  iniciarSesion() {
    this.loginService.login(this.usuario, this.clave).pipe(switchMap((data: any) => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token)
      const helper = new JwtHelperService();

      let decodedToken = helper.decodeToken(data.access_token);
      return this.menuService.listarPorUsuario(decodedToken.user_name);
    })).subscribe(data => {
      //pierde el estado al navegar, asi que mejor un BehaviorSubject
      this.menuService.setMenuCambio(data);
      this.router.navigate(['paciente']);

    });
  }

  //https://stackoverflow.com/questions/43118769/subject-vs-behaviorsubject-vs-replaysubject-in-angular
  //https://www.youtube.com/watch?v=U0Dx5gm6Ylw

  ngAfterViewInit() {
    (window as any).initialize();
  }


}
