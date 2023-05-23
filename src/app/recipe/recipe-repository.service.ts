import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createRecipe, Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RecipeRepositoryDef {
  search(filter: RecipeFilter): Observable<Recipe[]>;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeRepository implements RecipeRepositoryDef {
  private _httpClient = inject(HttpClient);

  search({ keywords, maxIngredientCount }: RecipeFilter = {}): Observable<
    Recipe[]
  > {
    const params: ResponseListQueryParams = {
      embed: 'ingredients',
      ...(keywords ? { q: keywords } : {}),
    };

    return this._httpClient
      .get<RecipeListResponseDto>('https://recipe-api.marmicode.io/recipes', {
        params,
      })
      .pipe(
        map((response) =>
          response.items
            .map((item) =>
              createRecipe({
                id: item.id,
                name: item.name,
                description: null,
                pictureUri: item.picture_uri,
                ingredients: item.ingredients ?? [],
                steps: [],
              })
            )
            /* Filter max ingredients locally meanwhile it is implemented server-side. */
            .filter((recipe) =>
              maxIngredientCount != null
                ? recipe.ingredients.length <= maxIngredientCount
                : true
            )
        )
      );
  }

  getRecipe(recipeId: string) {
    return this._httpClient
      .get<RecipeDto>(
        `https://recipe-api.marmicode.io/recipes/${encodeURIComponent(
          recipeId
        )}`
      )
      .pipe(
        map((item) =>
          createRecipe({
            id: item.id,
            name: item.name,
            description: null,
            pictureUri: item.picture_uri,
            ingredients: item.ingredients ?? [],
            steps: [],
          })
        )
      );
  }
}

type ResponseListQueryParams = {
  embed: 'ingredients' | 'steps' | 'ingredients,steps';
  q?: string;
};

interface RecipeListResponseDto {
  items: RecipeDto[];
}

interface RecipeDto {
  id: string;
  created_at: string;
  name: string;
  picture_uri: string;
  ingredients?: IngredientDto[];
}

interface IngredientDto {
  id: string;
  name: string;
}
