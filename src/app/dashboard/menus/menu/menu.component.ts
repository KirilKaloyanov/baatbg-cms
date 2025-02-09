import { Component } from "@angular/core";
import { Observable, of, switchMap } from "rxjs";
import { DbService } from "../../../shared/services/db.service";
import { ActivatedRoute, ParamMap, Route, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { ToasterService } from "../../../shared/services/toaster.service";
import { Menu } from "../menu.model";

@Component({
    selector: "edit-menu",
    templateUrl: "menu.component.html",
    imports: [ CommonModule, ReactiveFormsModule ]
})
export class MenuComponent {
      menu$!: Observable<Menu | string>;
      menuForm!: FormGroup;
      menuButtonDisabled: boolean = false;
    
      constructor(
        private dbService: DbService, 
        private route: ActivatedRoute, 
        private router: Router,
        private toasterService: ToasterService
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
        this.menuButtonDisabled = true;
        const payload = this.menuForm.value;
        this.dbService.saveDocument('menu', payload).subscribe({
            complete:() => {
                this.toasterService.showMessage("Saved successufully")
                setTimeout(() => {
                    this.router.navigate(["/dashboard/menus"])
                }, 1000)
            },
            error: (err) => {
                this.router.navigate(['/dashboard/menus'])
                this.toasterService.showMessage("my error" + err.message)
            }
        })
    }
    returnToParent(){
        this.router.navigate(['/dashboard/menus']);
    }
}