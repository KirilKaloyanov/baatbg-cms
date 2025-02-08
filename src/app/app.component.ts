import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading.component';
import { ToasterComponent } from './shared/components/toaster.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'baatbg-cms';
}
