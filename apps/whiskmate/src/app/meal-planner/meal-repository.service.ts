import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalStorage } from '../shared/local-storage';
import { Recipe } from '@whiskmate/recipe-core';

export interface MealRepositoryDef {
  addMeal(recipe: Recipe): Observable<void>;

  getMeals(): Observable<Recipe[]>;

  removeMeal(mealId: string): Observable<void>;
}

@Injectable({
  providedIn: 'root',
})
export class MealRepository implements MealRepositoryDef {
  private _localStorage = inject(LocalStorage);
  private _meals: Recipe[] = [];

  constructor() {
    this._meals = this._loadMeals();
  }

  addMeal(meal: Recipe): Observable<void> {
    this._updateMeals([...this._meals, meal]);
    return of(undefined);
  }

  getMeals(): Observable<Recipe[]> {
    return of(this._meals);
  }

  removeMeal(mealId: string): Observable<void> {
    this._updateMeals(this._meals.filter(({ id }) => id !== mealId));
    return of(undefined);
  }

  private _loadMeals(): Recipe[] {
    const rawValue = this._localStorage.getItem(LOCAL_STORAGE_KEY);

    if (rawValue == null) {
      return [];
    }

    try {
      return JSON.parse(rawValue);
    } catch (error) {
      return [];
    }
  }

  private _updateMeals(meals: Recipe[]) {
    this._meals = meals;
    this._localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(meals));
  }
}

const LOCAL_STORAGE_KEY = 'meals';
