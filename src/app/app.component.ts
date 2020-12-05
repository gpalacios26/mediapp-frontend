import { Component, OnInit } from '@angular/core';
import { Menu } from './_model/menu';
import { LoginService } from './_service/login.service';
import { MenuService } from './_service/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus: Menu[];

  constructor(
    private menuService : MenuService,
    public loginService: LoginService
  ) { }

  ngOnInit() {
    this.menuService.getMenuCambio().subscribe(data => {
      this.menus = data;
    });
  }

}
