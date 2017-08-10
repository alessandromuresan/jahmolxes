import { Component, ViewEncapsulation } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public navigation: any[];
  public menuToggled: boolean;
  public backgroundUrl: string;

  private _appService: AppService;

  constructor(appService: AppService) {

    this._appService = appService;

    this.navigation = [
      {
        routerLink: './home',
        text: 'Home'
      },
      {
        routerLink: './codex',
        text: 'Codex'
      },
      {
        routerLink: './_',
        text: '?'
      }
    ];

    this.backgroundUrl = this._appService.getDefaultBackgroundUrl();
  }

  public ngOnInit() {
    
  }

  public onMenuClick(e: Event): void {

    e.preventDefault();

    console.log('click');

    this.menuToggled = !this.menuToggled;
  }

  public onMobileMenuItemClick(e: Event, menuItem: any): void {

    e.preventDefault();

    console.log('click menu item');

    this.menuToggled = false;
  }
}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
