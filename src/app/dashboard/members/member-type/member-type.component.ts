import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MemberService } from '../member/member.service';
import { MemberType } from '../member.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToasterService } from '@shared/services/toaster.service';
import { DbService } from '@shared/services/db.service'

@Component({
  selector: 'member-type',
  templateUrl: './member-type.component.html',
  styles: `
    input {
      display: inline
    }
  `,
  imports: [CommonModule, ReactiveFormsModule, NgTemplateOutlet],
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
      id: new FormControl(''),
      bg: new FormControl(''),
      en: new FormControl(''),
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
    this.mtForm.get('id')?.disable();
    const payload = {
      label: {
        en: this.mtForm.get('en')?.value,
        bg: this.mtForm.get('bg')?.value
      }
    }
    const id = this.mtForm.get('id')?.value;
    this.dbService.saveDocument('memberType', id, payload)
      .subscribe({
        complete: () => {
          this.toasterService.showSuccess("Saved successfully")
          this.mtForm.reset();
          this.itemForEditing = null;
        }, 
        error: (err) => {
          this.toasterService.showError(err.message)
        }
     })
  }
}
