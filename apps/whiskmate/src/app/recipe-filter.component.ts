import { Component, input, model, output } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'wm-recipe-filter',
  template: `
    <mat-form-field class="field">
      <mat-label>Keywords</mat-label>
      <input [(ngModel)]="keywords" matInput role="searchbox" type="text" />
    </mat-form-field>
  `,
  styles: `
    :host {
      display: block;
      margin: 1em;
    }

    .field {
      min-width: 300px;
    }
  `,
  imports: [MatFormField, MatLabel, MatInput, FormsModule],
})
export class RecipeFilter {
  readonly keywords = model<string>();
}
