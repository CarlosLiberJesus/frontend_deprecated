import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IAppBreadcrumb } from 'src/app/interfaces/breadcrumbs';
import { BreadcrumbsService } from 'src/app/services/breadcrumbs.service';
import { EEvent } from 'src/modules/elements/elements';
import { IMenu } from 'src/modules/elements/navigation/menu/menu';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  menu: IMenu = {
    name: 'frontend-mobile-menu',
    cssMenuClass: [
      'menu-primary',
      'menu-hover-bg-light-primary',
      'menu-rounded',
      'menu-gray-600',
      'menu-active-bg-primary',
      'menu-hover-bg-light-primary',
      'menu-here-bg-light-primary',
      'menu-show-bg-light-primary',
      'fw-semibold',
      'menu-hide-arrow-layer-1',
    ],
    items: [
      {
        iconLast: {
          library: 'socicon',
          value: 'socicon-rss',
          css: ['fs-6', 'ms-2', 'text-primary'],
        },
        event: EEvent.CLICK,
        cssMenuItemClass: ['position-relative'],
        cssSubMenuClass: [
          'menu-sub-dropdown w-100px',
          'position-absolute',
          'top-100',
          'start-0',
        ],
        items: [
          {
            title: 'Recursos',
            event: EEvent.HOVER,
            cssMenuItemClass: ['position-relative'],
            cssSubMenuClass: [
              'menu-sub-dropdown w-100px',
              'position-absolute',
              'top-0',
              'start-100',
            ],
            button: {
              css: ['p-0', 'ps-2'],
              iconFirst: {
                library: 'bi',
                value: 'bi-chevron-right',
                cssContainer: ['rotate'],
                css: ['rotate-180'],
              },
            },
            items: [
              {
                title: 'Documenção',
                slug: '/documentacao',
              },
              {
                title: 'Biblioteca',
                slug: '/biblioteca',
              },
              {
                title: 'Blogs',
                slug: '/blogs',
              },
            ],
          },
        ],
      },
    ],
  };

  constructor(
    private breadcrumbService: BreadcrumbsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumb$
      .pipe(takeUntil(this.destroy$))
      .subscribe((breadcrumb: IAppBreadcrumb | null) => {
        const cleanedMenu = {
          ...this.menu,
          items: this.menu.items.map(item => ({
            ...item,
            cssMenuItemClass: item.cssMenuItemClass?.filter(
              cssClass => cssClass !== 'here'
            ),
            items: item.items?.map(subItem => ({
              ...subItem,
              cssMenuItemLinkClass: subItem.cssMenuItemLinkClass?.filter(
                cssClass => cssClass !== 'active'
              ),
            })),
          })),
        };

        if (breadcrumb) {
          console.log(breadcrumb);
          cleanedMenu.items[0].items?.map(item => {
            if (item.title === breadcrumb.title) {
              item.cssMenuItemClass = [
                ...(item.cssMenuItemLinkClass ?? []),
                'active',
              ];
            }
            item.items?.map(subItem => {
              if (subItem.title === breadcrumb.title) {
                item.cssMenuItemClass = [
                  ...(item.cssMenuItemClass ?? []),
                  'here',
                ];
                subItem.cssMenuItemLinkClass = [
                  ...(subItem.cssMenuItemLinkClass ?? []),
                  'active',
                ];
              }
            });
          });
        }
        this.menu = cleanedMenu;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
