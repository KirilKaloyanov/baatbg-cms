import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { Member, MemberType } from '../member.model';
import { DbService } from '@shared/services/db.service';
import { StorageService } from '@shared/services/storage.service';
import { ToasterService } from '@shared/services/toaster.service';
import { ImageService, ImageUrl } from '@shared/services/image.service';

@Component({
  selector: 'member-form',
  templateUrl: './member-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class MemberFormComponent {
  member$!: Observable<Member | null>;
  memberTypes!: MemberType[];
  memberForm!: FormGroup;
  fileForUpload!: File;
  uploadedImageURL!: string | null;
  // uploadedImageName!: string | null;
  saveButtonDisabled: boolean = false;
  isCreate!: boolean;

  routeDataSubscription!: Subscription;

  constructor(
    private imageService: ImageService,
    private dbService: DbService,
    private toaster: ToasterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.routeDataSubscription = this.route.data.subscribe((data) => {
      this.isCreate = data['isCreate'];
    });
    this.memberForm = this.initForm();

    this.member$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          return this.dbService.getIfDocument<Member>('members', id);
        }
        return of(null);
      })
    );

    this.dbService
      .getMemberTypeCollection()
      .subscribe((types: MemberType[]) => {
        this.memberTypes = types;
      });

    this.member$
      .pipe(
        map((dbMember) => {
          if (dbMember) {
            const uiMember = {
              id: dbMember.id,
              memberType: dbMember.typeId,
              nameBg: dbMember.name.bg,
              nameEn: dbMember.name.en,
              descriptionBg: dbMember.description.bg,
              descriptionEn: dbMember.description.en,
              addressBg: dbMember.address?.bg || '',
              addressEn: dbMember.address?.en || '',
              website: dbMember.website || '',
              phone: dbMember.phone || '',
              email: dbMember.email || '',
            };
            this.memberForm.patchValue(uiMember);
            this.uploadedImageURL = dbMember.img ?? null;
          }
        })
      )
      .subscribe();
  }
  initForm() {
    return new FormGroup({
      id: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z-]+$/),
      ]),
      memberType: new FormControl('', Validators.required),
      nameBg: new FormControl('', Validators.required),
      nameEn: new FormControl('', Validators.required),
      descriptionBg: new FormControl('', Validators.required),
      descriptionEn: new FormControl('', Validators.required),
      addressBg: new FormControl(''),
      addressEn: new FormControl(''),
      website: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
    });
  }

  ngOnInit() {
    if (!this.isCreate) {
      this.memberForm.get('id')?.disable();
    }
  }

  onFileSelect(e: any) {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.size > 1024 * 1000 * 2) {
      this.saveButtonDisabled = false;
      return this.toaster.showError('Choose file smaller than 2MB');
    }

    this.imageService.getPreparedImageFile(selectedFile).subscribe({
      next: ({ fileToUpload }) => {
        this.fileForUpload = fileToUpload;
      },
      error: (err) => this.toaster.showError(err.message),
    });
  }

  onFileRemove(e: any) {
    e.preventDefault();
    this.uploadedImageURL = '';
  }

  saveMember() {
    if (this.memberForm.invalid) return;

    this.saveButtonDisabled = true;
    const memberId = this.memberForm.get('id')?.value;

    const payload: any = {
      typeId: this.memberForm.get('memberType')?.value,
      name: {
        bg: this.memberForm.get('nameBg')?.value,
        en: this.memberForm.get('nameEn')?.value,
      },
      description: {
        bg: this.memberForm.get('descriptionBg')?.value,
        en: this.memberForm.get('descriptionEn')?.value,
      },
      address: {
        bg: this.memberForm.get('addressBg')?.value,
        en: this.memberForm.get('addressEn')?.value,
      },
      website: this.memberForm.get('website')?.value,
      phone: this.memberForm.get('phone')?.value,
      email: this.memberForm.get('email')?.value,
      img: this.uploadedImageURL ?? '',
    };

    const image$: Observable<ImageUrl | null> = this.fileForUpload
      ? this.imageService.uploadImage(
          this.fileForUpload,
          `members/profiles/${memberId}/`
        )
      : of(null);

    image$
      .pipe(
        switchMap((value) => {
          if (value) {
            payload.img = value.url;
          }
          return this.dbService.saveDocument('members', memberId, payload);
        })
      )
      .subscribe({
        complete: () => {
          this.toaster.showSuccess('Successfully saved member');
          this.returnToParent();
        },
        error: (error) => {
          this.toaster.showError('Error saving member', error);
          this.saveButtonDisabled = false;
        },
      });
  }

  returnToParent() {
    this.router.navigate(['/dashboard/members']);
  }

  ngOnDestroy() {
    this.routeDataSubscription.unsubscribe();
  }
}
