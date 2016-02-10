import { createActor } from "./actor"

let {
  register,
  registerPost,
  emit,
} = createActor({})



const calc_winner = counters =>
  Object.keys(counters)
    .map(key => counters[key])
    .reduce((a, b) => a.count >= b.count ? a : b)



register("update", ($$$, { name, count, _from }) => ({
  ...$$$,
  [_from]:{
    name,
    count,
  }
}))



registerPost(($$$, { type }) => {
  switch (type) {
    case "update":
      emit(calc_winner($$$).name)
  }
})
