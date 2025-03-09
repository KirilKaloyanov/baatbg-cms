import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { Member, MemberType } from '../member.model';
import { DbService } from '@shared/services/db.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MemberService } from '../member/member.service';
import { StorageService } from '@shared/services/storage.service';
import { ToasterService } from '@shared/services/toaster.service';

@Component({
  selector: 'member-form',
  templateUrl: './member-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class MemberFormComponent {
    member$!: Observable<Member | null>;
    memberTypes!: MemberType[];
    memberForm!: FormGroup;
    fileForUpload!: File;
    uploadedImage!: string | null;
    uploadedImageName!: string | null;
    saveButtonDisabled: boolean = false;
    isCreate!: boolean;

    routeDataSubscription!: Subscription;

    constructor(
      private dbService: DbService,
      private storage: StorageService,
      private toaster: ToasterService,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.routeDataSubscription = this.route.data.subscribe((data) => {
        this.isCreate = data['isCreate'];
      })
      this.memberForm = this.initForm();

      this.member$ = this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('id');
          if (id) {
            return this.dbService.getIfDocument<Member>('members', id);
          }
          return of(null);
        })
      )

      this.dbService.getMemberTypeCollection().subscribe((types: MemberType[]) => {
        this.memberTypes = types;
      })

      this.member$.pipe(
        switchMap((dbMember) => {
          const imgFileName = dbMember?.img || null;
          this.uploadedImageName = imgFileName;
          const imageUrl$ = imgFileName 
          ? this.dbService.getFileUrl(imgFileName)
          : of(null);
          return combineLatest([of(dbMember), imageUrl$])
        }),
        map(([dbMember, imageUrl]) => {
          if (imageUrl) this.uploadedImage = imageUrl;
          if (dbMember) {
            const uiMember = {
              id:dbMember.id,
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
            }
            this.memberForm.patchValue(uiMember);
          }
        })
      ).subscribe()
    }
    initForm() {
      return new FormGroup({
        id: new FormControl(""),
        memberType: new FormControl(""),
        nameBg: new FormControl(""),
        nameEn: new FormControl(""),
        descriptionBg: new FormControl(""),
        descriptionEn: new FormControl(""),
        addressBg: new FormControl(""),
        addressEn: new FormControl(""),
        website: new FormControl(""),
        phone: new FormControl(""),
        email: new FormControl(""),
      })
    }

    ngOnInit() {
      if (!this.isCreate) {
        this.memberForm.get("id")?.disable();
      }
    }

    onFileSelect(e: any){
      this.fileForUpload = e.target.files[0]
    }

    onFileRemove(e: any) {
      e.preventDefault(); 
      this.uploadedImage = '';
      this.uploadedImageName = '';
    }

    saveMember(){
      this.saveButtonDisabled = true;
      const id = this.memberForm.get('id')?.value;
      const payload: any = {
        typeId: this.memberForm.get('memberType')?.value,
        name: {
          bg: this.memberForm.get('nameBg')?.value,
          en: this.memberForm.get('nameEn')?.value
        },
        description: {
          bg: this.memberForm.get('descriptionBg')?.value,
          en: this.memberForm.get('descriptionEn')?.value
        },
        address: {
          bg: this.memberForm.get('addressBg')?.value,
          en: this.memberForm.get('addressEn')?.value,
        },
        website: this.memberForm.get('website')?.value,
        phone: this.memberForm.get('phone')?.value,
        email: this.memberForm.get('email')?.value,
        img: this.uploadedImage
      }
      if (this.uploadedImage) payload.img = this.uploadedImageName;
      else if (this.fileForUpload) payload.img = this.fileForUpload.name;
      else payload.img = ''; 
      this.dbService.saveDocument('members', id, payload).subscribe({
        complete: () => {
          this.toaster.showSuccess("Successfully saved member")
          if (this.fileForUpload) this.storage.uploadFile(this.fileForUpload);
          this.returnToParent();
        },
        error: (error) => {
          this.toaster.showError("Error saving member", error);
          this.saveButtonDisabled = false;
        }
      });
    }

    returnToParent() {
      this.router.navigate(['/dashboard/members']);
    }
  
    ngOnDestroy() {
      this.routeDataSubscription.unsubscribe();
    }
}
