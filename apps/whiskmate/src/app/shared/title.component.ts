import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-title',
  template: `<h1><ng-content></ng-content></h1>`,
  styles: [
    `
      :host {
        display: block;
        padding-top: 1em;
        text-align: center;

        background: #380030;
        border-bottom: solid 1px #ddd;
        color: #fff;
      }
    `,
  ],
})
export class TitleComponent {}
