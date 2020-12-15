import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public user_name: string;
  public roles: any[];
  public role: string;

  constructor() { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let access_token = sessionStorage.getItem(environment.TOKEN_NAME);
    let decodedToken = helper.decodeToken(access_token);
    this.user_name = decodedToken.user_name;
    this.roles = decodedToken.authorities;

    let role = '';
    this.roles.forEach(r => {
      role += r + ',';
    });

    if (this.roles.length > 1) {
      this.role = 'Roles de Usuario: ' + role.slice(0, -1);
    } else {
      this.role = 'Rol de Usuario: ' + role.slice(0, -1);
    }
  }

}
