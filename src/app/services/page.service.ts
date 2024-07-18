import { Injectable } from '@angular/core';
import { SplashScreenService } from './splash-screen.service';
import { IAppBreadcrumb } from '../interfaces/breadcrumbs';
import { BreadcrumbsService } from './breadcrumbs.service';
import { IAppAlert } from '../interfaces/app-alert';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(
    private splashScreenService: SplashScreenService,
    private breadcrumbService: BreadcrumbsService,
    private alertService: AlertService
  ) {}

  /**
   * Hide splash screen
   * @deprecated
   */
  hideSplashScreen(): void {
    this.splashScreenService.hide();
  }

  setAlert(alert: IAppAlert): void {
    this.alertService.setAlert(alert);
  }

  setBreadcrumb(breadcrumb: IAppBreadcrumb | null): void {
    this.breadcrumbService.setBreadcrumb(breadcrumb);
  }
}
