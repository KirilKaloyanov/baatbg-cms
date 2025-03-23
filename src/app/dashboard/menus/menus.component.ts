import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { DbService } from '@shared/services/db.service';
import { Menu } from './menu.model';


@Component({
  selector: 'app-menus',
  templateUrl: 'menus.component.html', 
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
})
export class MenusComponent {

  @ViewChild(MatTable) table!: MatTable<Menu>;

  menu$!: Observable<Menu[]>;

  displayedColumns = [ 'id', 'path', 'position', 'en', 'bg', 'action' ];

  constructor(private dbService: DbService, private router: Router) {}

  ngOnInit() {
    this.menu$ = this.dbService.getMenuCollection();
    this.menu$.subscribe((menuItems) => this.table.dataSource = menuItems);
  }

  
addNewItem(){
  this.router.navigate(['/dashboard/menus/create']);
}

editItem(itemId: string) {
  this.router.navigate(['/dashboard/menus/edit', itemId]);
}

}
