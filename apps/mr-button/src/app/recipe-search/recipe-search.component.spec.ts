import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { firstValueFrom } from 'rxjs';
import { RecipeRepository } from '../recipe-repository/recipe-repository.service';
import { RecipeRepositoryFake } from './../recipe-repository/recipe-repository.fake';
import { recipeMother } from './../testing/recipe-mother';
import { MealPlanner } from './meal-planner.service';
import { RecipeSearchComponent } from './recipe-search.component';

describe(RecipeSearchComponent.name, () => {
  it('should add recipe to meal planner when clicked', async () => {
    const { clickFirstAddButton, getMealPlannerRecipes } =
      await renderRecipeSearch();

    clickFirstAddButton();

    const recipes = await getMealPlannerRecipes();
    expect(recipes).toEqual([
      expect.objectContaining({
        name: '🍔 Burger',
      }),
    ]);
  });

  async function renderRecipeSearch() {
    const fakeRepo = new RecipeRepositoryFake();

    fakeRepo.setRecipes([
      recipeMother.withBasicInfo('🍔 Burger').build(),
      recipeMother.withBasicInfo('🍕 Pizza').build(),
      recipeMother.withBasicInfo('🥗 Salad').build(),
    ]);

    await render(RecipeSearchComponent, {
      providers: [{ provide: RecipeRepository, useValue: fakeRepo }],
    });

    const mealPlanner = TestBed.inject(MealPlanner);

    return {
      clickFirstAddButton() {
        return screen.getAllByTestId('add-recipe')[0].click();
      },
      async getMealPlannerRecipes() {
        return await firstValueFrom(mealPlanner.recipes$);
      },
    };
  }
});
