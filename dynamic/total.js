import { createActor } from "./actor"

const {
  register,
  emit,
} = createActor({})



const calcTotal = counters =>
  Object
    .keys(counters)
    .reduce((acc, key) => acc + counters[key], 0)



register("update", ($$$, { count, _from }) => {
  const $$1 = {
    ...$$$,
    [_from]:count,
  }

  emit(calcTotal($$1))

  return $$1
})
