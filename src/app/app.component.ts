import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading.component';
import { ToasterComponent } from './shared/components/toaster.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, LoadingComponent, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'baatbg-cms';

  isDarkMode = false;
  

  constructor(private renderer: Renderer2){
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.renderer.addClass(document.body, 'dark-mode')
    }
  }

  
  toggleDarkMode(){
    this.isDarkMode = !this.isDarkMode;
    
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
}
