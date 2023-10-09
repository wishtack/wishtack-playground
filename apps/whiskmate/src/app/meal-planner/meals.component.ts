import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { RecipeListComponent } from '../recipe/recipe-list.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { MealPlanner } from './meal-planner.service';
import { Recipe } from '../recipe/recipe';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MessageComponent } from '../shared/message.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  selector: 'wm-meals',
  imports: [RecipeListComponent, MatButtonModule, NgIf, MessageComponent],
  template: `
    <wm-message *ngIf="recipes().length === 0">😬 No meals yet</wm-message>

    <wm-recipe-list [recipes]="recipes()">
      <ng-template #actions let-recipe>
        <button (click)="removeMeal(recipe)" color="warn" mat-stroked-button>
          REMOVE
        </button>
      </ng-template>
    </wm-recipe-list>
  `,
})
export class MealsComponent {
  recipes: Signal<Recipe[]>;

  private _mealPlanner = inject(MealPlanner);

  constructor() {
    this.recipes = toSignal(this._mealPlanner.recipes$, { initialValue: [] });
  }

  removeMeal(recipe: Recipe) {
    this._mealPlanner.removeMeal(recipe.id);
  }
}

export default MealsComponent;