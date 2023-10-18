import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-card',
  imports: [NgIf],
  template: ` <img *ngIf="pictureUri" class="picture" [src]="pictureUri" />
    <div class="content">
      <ng-content></ng-content>
    </div>`,
  styles: [
    `
      :host {
        display: block;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        text-align: left;
        width: 300px;
      }

      .picture {
        object-fit: cover;
        height: 300px;
        width: 100%;
      }

      .content {
        margin: 10px;
      }
    `,
  ],
})
export class CardComponent {
  @Input() pictureUri?: string;
}