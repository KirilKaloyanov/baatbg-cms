import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DbService } from '@shared/services/db.service';
import { Member } from '../member.model';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class MemberComponent {
  members$!: Observable<Member[]>;
  constructor(private dbService: DbService, private router: Router) {}

  ngOnInit() {
    this.members$ = this.dbService.getMembersCollection();
  }

  addNewItem() {
    this.router.navigate(['/dashboard/members/create']);
  }
}
