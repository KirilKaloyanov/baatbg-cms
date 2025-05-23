import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { map, Observable, of, Subscription, switchMap } from 'rxjs';

import { DbService } from '../../../shared/services/db.service';
import { ToasterService } from '../../../shared/services/toaster.service';
import { Menu } from '../menu.model';
import { LoaderService } from './../../../shared/services/loader.service';
@Component({
  selector: 'edit-menu',
  templateUrl: 'menu.component.html',
  styleUrl: 'menu.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class MenuComponent {
  menu$!: Observable<Menu | null>;
  menuForm!: FormGroup;
  saveButtonDisabled: boolean = false;
  isCreate!: boolean;

  routeDataSubscription!: Subscription;
  constructor(
    private dbService: DbService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToasterService,
    private loader: LoaderService
  ) {
    this.routeDataSubscription = this.route.data.subscribe((data) => {
      this.isCreate = data['isCreate'];
    });

    this.menuForm = this.initForm();

    this.menu$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          return this.dbService.getIfDocument<Menu>('menu', id);
        }
        return of(null);
      })
    );

    this.menu$.subscribe({
      next: (dbMenu) => {
        if (dbMenu) {
          const uiMenu = {
            id: dbMenu.id,
            path: dbMenu.path,
            position: dbMenu.position,
            en: dbMenu.label.en,
            bg: dbMenu.label.bg,
          };
          this.menuForm.patchValue(uiMenu);
        }
      },
      error: (err) => {
        this.toaster.showError(err, () => {
          this.saveButtonDisabled = false;
        });
        this.returnToParent();
      },
    });
  }

  initForm() {
    return new FormGroup({
      id: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-z-]+$/),
      ]),
      path: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?!en)[a-z-//]+$/),
      ]),
      position: new FormControl(0, [Validators.required, Validators.min(1)]),
      en: new FormControl('', Validators.required),
      bg: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    if (!this.isCreate) {
      this.menuForm.get('id')?.disable();
    }
  }

  saveMenu() {
    if (this.menuForm.invalid) return;
    this.saveButtonDisabled = true;
    const payload = {
      path: this.menuForm.get('path')?.value,
      position: this.menuForm.get('position')?.value,
      label: {
        en: this.menuForm.get('en')?.value,
        bg: this.menuForm.get('bg')?.value,
      },
    };
    const id = this.menuForm.get('id')?.value;
    this.dbService.saveDocument('menu', id, payload).subscribe({
      complete: () => {
        this.toaster.showSuccess('Saved successufully', () =>
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
    this.router.navigate(['/dashboard/menus']);
  }

  ngOnDestroy() {
    this.routeDataSubscription.unsubscribe();
  }
}
