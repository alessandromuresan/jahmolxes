/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <!-- Navigation -->
    <nav id="mainNav" class="navbar fixed-top navbar-toggleable-md navbar-light">
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarExample" aria-controls="navbarExample" aria-expanded="false" aria-label="Toggle navigation">
            Menu <i class="fa fa-bars"></i>
        </button>
        <div class="container">
            <a class="navbar-brand" href="https://jahmolxes.bandcamp.com/" target="_blank">_ Jahmolxes</a>
            <div class="collapse navbar-collapse" id="navbarExample">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item" *ngFor="let item of navigation">
                        <a class="nav-link" [routerLink]="[item.routerLink]" routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">{{item.text}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  public navigation: any[];

  constructor() {

    this.navigation = [
      {
        routerLink: './home',
        text: '_ Home'
      },
      {
        routerLink: './codex',
        text: '_ Codex'
      }
    ]
  }

  public ngOnInit() {
    
  }
}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
