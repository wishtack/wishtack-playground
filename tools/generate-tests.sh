#!/usr/bin/env sh

TEST_MODULE_COUNT=$1
if [ -z "$TEST_MODULE_COUNT" ]; then
  TEST_MODULE_COUNT=100
fi

BENCHMARK_FOLDER=apps/demo/src/app/benchmark
rm -rf $BENCHMARK_FOLDER
mkdir -p $BENCHMARK_FOLDER
for i in $(seq 1 $TEST_MODULE_COUNT); do
  cat apps/demo/src/app/app.component.spec.ts | sed "s/app.component/app.component.$i/g" > $BENCHMARK_FOLDER/app.component.$i.spec.ts
  cat apps/demo/src/app/app.component.ts | sed "s/app.component/app.component.$i/g" | sed "s|\./recipe|../recipe|g" > $BENCHMARK_FOLDER/app.component.$i.ts
  cp apps/demo/src/app/app.component.html $BENCHMARK_FOLDER/app.component.$i.html
done