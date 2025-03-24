import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DbService } from '@shared/services/db.service';
import { Member } from '../member.model';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class MemberComponent {
  members$!: Observable<Member[]>;

  displayedColumns = ['id', 'memberType', 'en', 'bg', 'action'];

  constructor(private dbService: DbService, private router: Router) {}

  ngOnInit() {
    this.members$ = this.dbService.getMembersCollection();
  }

  addNewItem() {
    this.router.navigate(['/dashboard/members/create']);
  }
}
