import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DbService } from '../../shared/services/db.service';
import { Router, RouterModule } from '@angular/router';
import { Menu } from './menu.model';


@Component({
  selector: 'app-menus',
  templateUrl: 'menus.component.html', 
  imports: [CommonModule, RouterModule],
})
export class MenusComponent {
    menu$!: Observable<Menu[]>;

  constructor(private dbService: DbService, private router: Router) {}

  ngOnInit() {
    this.menu$ = this.dbService.getMenuCollection();
  }

  
addNewItem(){
  this.router.navigate(['/dashboard/menus/create']);
}

editItem(itemId: string) {
  this.router.navigate(['/dashboard/menus/edit', itemId]);
}

}
