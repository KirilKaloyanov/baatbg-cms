import { Component, ViewChild } from '@angular/core';
import { DbService } from '../../../shared/services/db.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  catchError,
  Observable,
  of,
  switchMap,
  throwError,
  map,
  tap,
  Subscription,
} from 'rxjs';
import { Post } from './../post.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../shared/services/toaster.service';
import { CommonModule } from '@angular/common';
import { TextEditorComponent } from '../../../shared/components/editor.component';

@Component({
  selector: 'edit-post',
  templateUrl: 'post.component.html',
  imports: [CommonModule, ReactiveFormsModule, TextEditorComponent],
})
export class PostComponent {
  @ViewChild(TextEditorComponent) textEditor!: TextEditorComponent;
  post$!: Observable<Post | string>;
  saveButtonDisabled: boolean = false;
  isCreate!: boolean;

  routeDataSubscription!: Subscription;

  postForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    menuPath: new FormControl('', Validators.required),
    subMenuPath: new FormControl('', Validators.required),
  });

  constructor(
    private dbService: DbService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService
  ) {
    this.routeDataSubscription = this.route.data.subscribe((data) => {
      this.isCreate = data['isCreate'];
      console.log('POST: route.data', this.textEditor);
    });

    this.post$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        console.log('POST: switchmap', this.textEditor);
        const id = params.get('id');
        if (id) {
          return this.dbService.getIfDocument<Post>('posts', id).pipe(
            tap((post) => {
              if (post) {
                console.log('POST: observable with post completes');
                if (this.textEditor) {
                  // this.textEditor.initQuilEditor();
                  this.textEditor.retryEditorInit();
                }
                this.postForm.patchValue(post);
              }
            })
          );
        }
        return of('create new post');
      })
    );
  }

  ngOnInit() {
    console.log('POST: ngOninit', this.textEditor);
    if (!this.isCreate) {
      this.postForm.get('id')?.disable();
    }
    // this.post$.subscribe({
    //   next: (post) => {
    //     console.log('post$ subsribed', this.textEditor);
    //     console.log('post$ subsribed', post);
    //   },
    //   error: (err) => {
    //     this.toaster.showError(err, () => {
    //       this.saveButtonDisabled = false;
    //     });
    //     this.returnToParent();
    //   },
    // });
  }

  ngAfterViewInit() {
    console.log('POST: ngAfterviewInit', this.textEditor);
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
    const payload = {
      content: this.postForm.get('content')?.value,
      menuPath: this.postForm.get('menuPath')?.value,
      subMenuPath: this.postForm.get('subMenuPath')?.value,
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
    console.log(this.textEditor);

    this.router.navigate(['/dashboard/posts']);
  }

  ngOnDestroy() {
    this.routeDataSubscription.unsubscribe();
  }
}
