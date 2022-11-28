import {
  _addRunnerPlugin,
  devices,
  expect as baseExpect,
  Locator,
  Page,
  PlaywrightTestConfig as BasePlaywrightTestConfig,
  test as baseTest,
} from '@playwright/test';
import { fixtures as mountFixtures } from '@playwright/test/lib/mount';
import * as path from 'path';
import { Type } from '@angular/core';
import { InlineConfig } from 'vite';
import { Observable } from 'rxjs';
import { fn, MockedFunction } from 'jest-mock';

_addRunnerPlugin(() => {
  /* Only fetch upon request to avoid resolution in workers. */
  const { createPlugin } = require('@playwright/test/lib/plugins/vitePlugin');
  return createPlugin(path.join(__dirname, 'register-source.mjs'), () => {});
});

const mountTest = baseTest.extend(mountFixtures);
export const test = mountTest.extend<{
  mount: ComponentFixtures['mount'];
}>({
  /* Override mount to return output spies and enjoy type inference.
   * This allows this:
   *
   * const { spies } = mount(..., {outputs: {citySelect: jest.fn()}})
   *
   * instead of this:
   *
   * const citySelectSpy: jest.MockedFunction<(city: string) => void> = jest.fn();
   * mount(..., {outputs: {citySelect: citySelectSpy}}); */
  async mount({ mount, page }: { mount: Function; page: Page }, use: Function) {
    await use((component: any, options: MountOptions<any, any>) => {
      /* 1. Create a spy for each output in `spyOutputs`... */
      const spies =
        options.spyOutputs?.reduce((acc, key) => {
          return {
            ...acc,
            [key]: fn(),
          };
        }, {}) ?? {};

      return {
        ...mount(component, {
          ...options,
          outputs: {
            ...options.outputs,
            /* 2. ...then use it as an output... */
            ...spies,
          },
        }),
        /* 3. ... and return it in spies object. */
        spies,
      };
    });
  },
});

export const expect = baseExpect;

export { devices };

export interface ComponentFixtures {
  mount<COMPONENT, SPIED_OUTPUT extends keyof COMPONENT>(
    component: Type<COMPONENT>,
    options: MountOptions<COMPONENT, SPIED_OUTPUT>
  ): Promise<MountResult<COMPONENT, SPIED_OUTPUT>>;
}

export interface MountOptions<COMPONENT, SPIED_OUTPUT> {
  inputs?: Partial<COMPONENT>;
  outputs?: Outputs<COMPONENT>;
  spyOutputs?: Array<SPIED_OUTPUT>;
}

export type Outputs<COMPONENT> = Partial<{
  /* For each field or method... is this an observable? */
  [K in keyof COMPONENT]: COMPONENT[K] extends Observable<unknown>
    ? /* It's an observable, so let's change the return type. */
      (value: Emitted<COMPONENT[K]>) => void
    : /* It's something else. */
      COMPONENT[K];
}>;

export interface MountResult<COMPONENT, SPIED_OUTPUT extends keyof COMPONENT>
  extends Locator {
  unmount(): Promise<void>;

  spies: Spies<COMPONENT, SPIED_OUTPUT>;
}

export type Spies<COMPONENT, SPIED_OUTPUT extends keyof COMPONENT> = Partial<{
  /* For each field or method... is this an observable? */
  [K in SPIED_OUTPUT]: COMPONENT[K] extends Observable<unknown>
    ? /* It's an observable, so let's change the return type. */
      MockedFunction<(value: Emitted<COMPONENT[K]>) => void>
    : /* It's something else. */
      COMPONENT[K];
}>;

export type PlaywrightTestConfig = Omit<BasePlaywrightTestConfig, 'use'> & {
  use?: BasePlaywrightTestConfig['use'] & {
    ctPort?: number;
    ctTemplateDir?: string;
    ctCacheDir?: string;
    ctViteConfig?: InlineConfig;
  };
};

type Emitted<OBSERVABLE> = OBSERVABLE extends Observable<infer EMITTED>
  ? EMITTED
  : OBSERVABLE;

/*
 * Fixing matchers typing to add Jest spy matchers.
 */
declare global {
  export namespace PlaywrightTest {
    export interface Matchers<R, T = unknown> {
      lastCalledWith(...args: Array<unknown>): R;

      lastReturnedWith(value: unknown): R;

      not: Matchers<R>;

      nthCalledWith(nthCall: number, ...args: Array<unknown>): R;

      nthReturnedWith(n: number, value: unknown): R;

      toBeCalled(): R;

      toBeCalledTimes(expected: number): R;

      toBeCalledWith(...args: Array<unknown>): R;

      toHaveBeenCalled(): R;

      toHaveBeenCalledTimes(expected: number): R;

      toHaveBeenCalledWith(...args: Array<unknown>): R;

      toHaveBeenNthCalledWith(nthCall: number, ...args: Array<unknown>): R;

      toHaveBeenLastCalledWith(...args: Array<unknown>): R;

      toHaveLastReturnedWith(expected: unknown): R;

      toHaveNthReturnedWith(nthCall: number, expected: unknown): R;

      toHaveReturned(): R;

      toHaveReturnedTimes(expected: number): R;

      toHaveReturnedWith(expected: unknown): R;

      toReturn(): R;

      toReturnTimes(count: number): R;

      toReturnWith(value: unknown): R;
    }
  }
}
