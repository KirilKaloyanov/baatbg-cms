import { Component } from "@angular/core";
import { DbService } from "../../../shared/services/db.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { Post } from './../post.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ToasterService } from "../../../shared/services/toaster.service";
import { LoaderService } from "../../../shared/services/loader.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'edit-post',
    templateUrl: "post.component.html",
    imports: [ CommonModule, ReactiveFormsModule ]
})
export class PostComponent {

    postForm!: FormGroup;
    post$!: Observable<Post | string>;
    saveButtonDisabled: boolean = false;

    constructor(
        private dbService: DbService, 
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService,
        private loader: LoaderService
    ) {
        this.post$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                const id = params.get('id');
                console.log('postComponent switchMap', id)
                if (id) {
                    return this.dbService.getDocument<Post>('posts', id)
                } else {
                    return of('new item')
                }
            }),
            catchError((err) => {
                return throwError(() => err)
            })
        )

        this.postForm = this.initForm();

        this.post$.subscribe({

            next: (post) => {
                if (typeof post !== 'string') {
                    this.postForm.patchValue(post)
                }
            },
            error: err => console.log(err)
        })
    }

    initForm() {
        return new FormGroup({
            id: new FormControl('', Validators.required),
            content: new FormControl('', Validators.required),
            menuPath: new FormControl('', Validators.required),
            subMenuPath: new FormControl('', Validators.required)
        })
    }

    savePost() {
        this.saveButtonDisabled = true;
        const payload = this.postForm.value;
        this.dbService.saveDocument('posts', payload).subscribe({
            complete: () => {
                this.toaster.showSuccess('Saved successfully', () => this.returnToParent())
            },
            error: (err) => {
                this.toaster.showError(err.message, () => {
                    this.saveButtonDisabled = false;
                }
            )
            }
        })
    }

    returnToParent() {
        this.router.navigate(['/dashboard/posts'])
    }

}