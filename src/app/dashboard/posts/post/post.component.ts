import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { Observable, of, switchMap, tap, Subscription } from 'rxjs';

import { DbService } from '../../../shared/services/db.service';
import { ToasterService } from '../../../shared/services/toaster.service';
import { TextEditorComponent } from '../../../shared/components/editor.component';
import { Post } from './../post.model';
import { Menu } from '../../menus/menu.model';

@Component({
  selector: 'edit-post',
  templateUrl: 'post.component.html',
  styleUrl: 'post.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextEditorComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class PostComponent {
  post$!: Observable<Post | string>;
  menuList!: Menu[];
  saveButtonDisabled: boolean = false;
  isCreate!: boolean;

  routeDataSubscription!: Subscription;
  subMenuPathValueChangeSusbsription: Subscription | null = null;

  postForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    linkVideo: new FormControl(''),
    menuPath: new FormControl('', Validators.required),
    position: new FormControl(0, Validators.required),
    subMenuPath: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z-]+$/),
    ]),
    headingBg: new FormControl('', Validators.required),
    headingEn: new FormControl('', Validators.required),
    textBg: new FormControl(''),
    textEn: new FormControl(''),
  });

  constructor(
    private dbService: DbService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService
  ) {
    this.routeDataSubscription = this.route.data.subscribe((data) => {
      this.isCreate = data['isCreate'];
    });

    this.dbService.getMenuCollection().subscribe((menus) => {
      this.menuList = menus;
    });

    this.post$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          return this.dbService.getIfDocument<Post>('posts', id).pipe(
            tap((dbPost) => {
              if (dbPost) {
                const uiPost = {
                  id: dbPost.id,
                  linkVideo: dbPost.linkVideo,
                  menuPath: dbPost.menuPath,
                  position: dbPost.position,
                  subMenuPath: dbPost.subMenuPath,
                  headingBg: dbPost.heading.bg,
                  headingEn: dbPost.heading.en,
                  textBg: dbPost.text.bg,
                  textEn: dbPost.text.en,
                };
                this.postForm.patchValue(uiPost);
              }
            })
          );
        }
        return of('create new post');
      })
    );
  }

  ngOnInit() {
    const idField = this.postForm.get('id');
    idField?.disable();

    const subMenuPathField = this.postForm.get('subMenuPath');

    if (!this.isCreate && subMenuPathField) {
      subMenuPathField.disable();
    }

    this.subMenuPathValueChangeSusbsription =
      subMenuPathField?.valueChanges.subscribe((value) => {
        if (subMenuPathField.valid) {
          idField?.setValue(value);
        }
      }) ?? null;
  }

  ngAfterViewInit() {
    this.post$.subscribe({
      next: (post) => {},
      error: (err) => {
        this.toaster.showError(err, () => {
          this.saveButtonDisabled = false;
        });
        this.returnToParent();
      },
    });
  }

  savePost() {
    if (this.postForm.invalid) return;
    const payload = {
      linkVideo: this.postForm.get('linkVideo')?.value || '',
      menuPath: this.postForm.get('menuPath')?.value,
      position: this.postForm.get('position')?.value,
      subMenuPath: this.postForm.get('subMenuPath')?.value,
      heading: {
        bg: this.postForm.get('headingBg')?.value,
        en: this.postForm.get('headingEn')?.value,
      },
      text: {
        en: this.postForm.get('textEn')?.value,
        bg: this.postForm.get('textBg')?.value,
      },
    };
    const id = this.postForm.get('id')?.value;
    this.saveButtonDisabled = true;
    this.dbService.saveDocument('posts', id, payload).subscribe({
      complete: () => {
        this.toaster.showSuccess('Saved successfully', () =>
          this.returnToParent()
        );
      },
      error: (err) => {
        this.toaster.showError(err.message, () => {
          this.saveButtonDisabled = false;
        });
      },
    });
  }

  returnToParent() {
    this.router.navigate(['/dashboard/posts']);
  }

  ngOnDestroy() {
    this.routeDataSubscription.unsubscribe();
    this.subMenuPathValueChangeSusbsription?.unsubscribe();
  }
}
