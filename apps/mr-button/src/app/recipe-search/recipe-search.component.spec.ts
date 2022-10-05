import { TestBed } from '@angular/core/testing';
import { fireEvent, render, screen } from '@testing-library/angular';
import { debug } from 'jest-preview';
import { firstValueFrom } from 'rxjs';
import { RecipeRepository } from '../recipe-repository/recipe-repository.service';
import { setUpDomTesting } from '../testing/set-up-dom-testing';
import { RecipeRepositoryFake } from './../recipe-repository/recipe-repository.fake';
import { recipeMother } from './../testing/recipe-mother';
import { MealPlanner } from './meal-planner.service';
import { RecipeSearchComponent } from './recipe-search.component';

setUpDomTesting();

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
      recipeMother.withBasicInfo('🥟 Maultaschen').build(),
      recipeMother.withBasicInfo('🍺 Beer').build(),
    ]);

    await render(RecipeSearchComponent, {
      providers: [{ provide: RecipeRepository, useValue: fakeRepo }],
    });

    const mealPlanner = TestBed.inject(MealPlanner);

    return {
      clickFirstAddButton() {
        return fireEvent.click(screen.getAllByTestId('add-recipe')[0]);
      },
      async getMealPlannerRecipes() {
        return await firstValueFrom(mealPlanner.recipes$);
      },
    };
  }
});
