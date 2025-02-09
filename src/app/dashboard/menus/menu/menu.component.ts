import { Component } from "@angular/core";
import { Observable, of, switchMap } from "rxjs";
import { DbService } from "../../../shared/services/db.service";
import { ActivatedRoute, ParamMap, Route, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { ToasterService } from "../../../shared/services/toaster.service";
import { Menu } from "../menu.model";
import { LoaderService } from './../../../shared/services/loader.service';
@Component({
    selector: "edit-menu",
    templateUrl: "menu.component.html",
    imports: [ CommonModule, ReactiveFormsModule ]
})

export class MenuComponent {
      menu$!: Observable<Menu | string>;
      menuForm!: FormGroup;
      saveButtonDisabled: boolean = false;
    
      constructor(
        private dbService: DbService, 
        private route: ActivatedRoute, 
        private router: Router,
        private toaster: ToasterService,
        private loader: LoaderService
    ) {
        this.menu$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>{
                const id = params.get('id');
                if (id) {
                    return this.dbService.getDocument<Menu>("menu", id)
                } 
                return of("new item")
            })
        )

        this.menuForm = this.initForm();

        this.menu$.subscribe((menu) => {
            if (typeof menu !== "string") {
                this.menuForm.patchValue(menu);
            }
        })
      }
      
    initForm() {
        return new FormGroup({
            id: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            path: new FormControl('', Validators.required),
            position: new FormControl(0, Validators.required)
        })
    }

    saveMenu(){
        this.saveButtonDisabled = true;
        const payload = this.menuForm.value;
        this.dbService.saveDocument('menu', payload).subscribe({
            complete:() => {
                this.toaster.showSuccess("Saved successufully", () => this.returnToParent())
            },
            error: (err) => {
                this.toaster.showError(err.message, () => {
                this.saveButtonDisabled = false;
            })}
        })
    }

    returnToParent(){
        this.router.navigate(['/dashboard/menus']);
    }
}