import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { AnimationBuilder, animate, style } from '@angular/animations';
import { SplashScreenService } from 'src/app/services/splash-screen.service';
import { UserService } from 'src/app/services/user.service';
import { takeUntil, Subject, catchError, EMPTY } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements AfterViewInit, OnDestroy {
  @ViewChild('splashScreen', { static: false }) splashScreen: ElementRef;

  fastTransition = false;
  isAnimationComplete = true;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private animationBuilder: AnimationBuilder,
    private splashScreenService: SplashScreenService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.splashScreenService
      .isVisible$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isVisible => {
        if (isVisible) {
          this.show();
          const auth = JSON.parse(localStorage.getItem('auth') ?? '{}');
          if (auth.accessToken) {
            this.isAnimationComplete = false;
            this.userService
              .getUserByToken()
              .pipe(
                takeUntil(this.destroy$),
                catchError(() => {
                  localStorage.removeItem('auth');
                  /*
                  this.alertService.setAlert({
                    code: 500,
                    title: 'Erro do Servidor',
                    message:
                      'Erro na validação do Token:: Transição In Abortada',
                  });
                  */
                  this.fastTransition = true;
                  this.userService.forceExit();
                  //this.router.navigate(['/libertario/entrar']);
                  return EMPTY;
                })
              )
              .subscribe({
                next: response => {
                  if (response) {
                    console.log('PERDI-ME ', response);
                    localStorage.removeItem('auth');
                    /*this.alertService.setAlert({
                      code: 500,
                      title: 'Erro do Servidor',
                      message: 'Erro na validação do Token:: ' + response,
                    }); */

                    //this.router.navigate(['/libertario/entrar']);
                  }
                  this.isAnimationComplete = false;
                  this.fastTransition = true;
                  this.hide();
                },
              });
          }
        } else if (!this.fastTransition) {
          const auth = JSON.parse(localStorage.getItem('auth') ?? '{}');
          if (auth.accessToken) {
            this.isAnimationComplete = false;

            this.userService
              .getUserByToken()
              .pipe(
                takeUntil(this.destroy$),
                catchError(() => {
                  localStorage.removeItem('auth');
                  /*
                  this.alertService.setAlert({
                    code: 500,
                    title: 'Erro do Servidor',
                    message:
                      'Erro na validação do Token:: Transição Out Abortada',
                  });
                  //this.router.navigate(['/libertario/entrar']); */
                  this.userService.forceExit();
                  return EMPTY;
                })
              )
              .subscribe({
                next: response => {
                  if (response) {
                    localStorage.removeItem('auth');
                    console.log('PERDI-ME2 ', response);
                    /*this.alertService.setAlert({
                      code: 500,
                      title: 'Erro do Servidor',
                      message: 'Erro na validação do Token:: ' + response,
                    });*/
                    //this.router.navigate(['/libertario/entrar']);
                  }
                  this.isAnimationComplete = false;
                  this.hide();
                },
              });
          } else {
            this.fastTransition = false;
            this.hide();
          }
        }
      });
  }

  hide() {
    if (!this.isAnimationComplete && !this.splashScreen) {
      return;
    }

    this.isAnimationComplete = false;
    const player = this.animationBuilder
      .build([style({ opacity: '1' }), animate(800, style({ opacity: '0' }))])
      .create(this.splashScreen.nativeElement);

    player.onDone(() => {
      this.splashScreen.nativeElement.style.display = 'none';
      this.isAnimationComplete = true;
    });

    setTimeout(() => player.play(), 100);
  }

  /**
   * Show
   */
  show() {
    if (!this.isAnimationComplete && !this.splashScreen) {
      return;
    }
    this.isAnimationComplete = false;

    const player = this.animationBuilder
      .build([
        style({ opacity: '0', display: 'inline-flex' }),
        animate(800, style({ opacity: '1' })),
      ])
      .create(this.splashScreen.nativeElement);

    player.onDone(() => {
      this.isAnimationComplete = true;
    });

    setTimeout(() => player.play(), 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
