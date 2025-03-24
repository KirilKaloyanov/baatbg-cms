import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Observable } from 'rxjs';

import { MemberService } from '../member/member.service';
import { MemberType } from '../member.model';
import { ToasterService } from '@shared/services/toaster.service';
import { DbService } from '@shared/services/db.service';

@Component({
  selector: 'member-type',
  templateUrl: './member-type.component.html',
  styleUrl: './member-type.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class MemberTypeComponent {
  itemForEditing: null | MemberType = null;
  memberTypes$!: Observable<MemberType[]>;
  mtForm!: FormGroup;

  constructor(
    private memberService: MemberService,
    private dbService: DbService,
    private toasterService: ToasterService
  ) {
    this.memberTypes$ = this.memberService.getAllMemberTypes();
  }

  ngOnInit() {
    this.mtForm = new FormGroup({
      id: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z-]+$/),
      ]),
      bg: new FormControl('', Validators.required),
      en: new FormControl('', Validators.required),
    });
  }

  setItemForEditing(item: MemberType | null) {
    this.itemForEditing = item;
    if (!item) {
      this.mtForm.reset();
    } else {
      this.mtForm.get('id')?.disable();
      this.mtForm.get('id')?.setValue(item.id);
      this.mtForm.get('en')?.setValue(item.label.en);
      this.mtForm.get('bg')?.setValue(item.label.bg);
    }
  }

  createItem() {
    this.mtForm.get('id')?.enable();
    this.itemForEditing = {
      id: '',
      label: {
        bg: '',
        en: '',
      },
    };
  }

  saveItem() {
    if (this.mtForm.invalid) return;
    this.mtForm.get('id')?.disable();
    const payload = {
      label: {
        en: this.mtForm.get('en')?.value,
        bg: this.mtForm.get('bg')?.value,
      },
    };
    const id = this.mtForm.get('id')?.value;
    this.dbService.saveDocument('memberType', id, payload).subscribe({
      complete: () => {
        this.toasterService.showSuccess('Saved successfully');
        this.mtForm.reset();
        this.itemForEditing = null;
      },
      error: (err) => {
        this.toasterService.showError(err.message);
      },
    });
  }
}
