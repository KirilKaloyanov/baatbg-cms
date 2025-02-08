import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DbService } from '../../shared/services/db.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-menus',
  templateUrl: 'menus.component.html', 
  imports: [CommonModule, RouterModule],
})
export class MenusComponent {
    menu$!: Observable<any>;

  constructor(private dbService: DbService) {}

  ngOnInit() {
    // this.items$.subscribe((i) => console.log(i));

    this.menu$ = this.dbService.getCollection('menu');
    this.menu$.subscribe((i) => console.log(i));
    this.dbService.getDocument("posts", "boQ2ihM0QdlCHrMZasFr").subscribe((doc: any) => {
        console.log(doc)
    })
  }
}
