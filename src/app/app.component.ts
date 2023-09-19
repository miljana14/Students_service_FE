import { Component, HostListener, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Miljana-Andric-FE';
  showMenu = false;
  showSettingsMenu = false;
  private isMenuOpen = false;
  private isMenuToggleClicked = false;
  isRouteChanging = false;

  @ViewChild(HeaderComponent)
  private headerComponentRef!: HeaderComponent;
  @HostListener('document:click', ['$event'])
  
  onMenuOpen() {
    this.isMenuOpen = true;
    this.isMenuToggleClicked = true;
    this.showSettingsMenu = true; 
    this.showMenu = true; 
  }

  onMenuClose() {
    this.isMenuOpen = false;
    this.isMenuToggleClicked = false;
    this.showSettingsMenu = false; 
    this.showMenu = false; 
  }

  onMenuToggle() {
    if (this.isMenuOpen) {
      this.headerComponentRef.hideSettingsMenu();
      this.headerComponentRef.hideMenu();
    } else {
      this.isMenuToggleClicked = true;
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    
    const targetElement = event.target as HTMLElement;
    const isInsideSettingsMenu = targetElement.closest('.settings-dropdown');
    const isInsideMenu = targetElement.closest('.settings-dropdown-right');

    if (!isInsideSettingsMenu && this.isMenuOpen && !this.isMenuToggleClicked) {
      this.headerComponentRef.hideSettingsMenu();
    }
    
    if (!isInsideMenu && this.isMenuOpen && !this.isMenuToggleClicked) {
      this.headerComponentRef.hideMenu();
    }
    
    this.isMenuToggleClicked = false;
  }

  constructor(private translateService: TranslateService, private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isRouteChanging = true;
      } else if (event instanceof NavigationEnd) {
          this.isRouteChanging = false;

      }
    });
  }

  onLangugaeChange(newLangugae: string) {
    this.translateService.use(newLangugae);
  }

  onSettingsMenuClosed() {
    this.showSettingsMenu = false;
  }

  hideSettingsMenu() {
    this.headerComponentRef.hideSettingsMenu();
  }

  onMenuClosed() {
    this.showMenu = false;
  }

  hideMenu() {
    this.headerComponentRef.hideMenu();
  }
  
}
