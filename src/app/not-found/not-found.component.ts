import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'not-found',
  templateUrl: 'not-found.component.html'
})
export class NotFoundComponent {

  public title: string;
  public text: string;
  public backgroundUrl: string;

  private _appService: AppService;

  constructor(appService: AppService) {

      this._appService = appService;

      this.title = '404';
      this.text = 'You seem to be lost, friend';
      this.backgroundUrl = this._appService.getDefaultBackgroundUrl();
  }
}
