import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { LoaderService } from "../services/loader.service";

@Component({
    selector: 'app-loading',
    template: `
    <div class="loader-overlay" *ngIf="loaderService.loading$ | async">
      <div class="spinner"></div>
    </div>
    `,
    styleUrl: 'loading.component.scss',
    imports: [ CommonModule ]
})
export class LoadingComponent {
    constructor(public loaderService: LoaderService){}
}