import { createActor } from "./actor"

let {
  register,
  registerPost,
  emit,
  send,
} = createActor({ name:"", count:0, loggers:[] })



register("inc", $$$ => ({
  ...$$$,
  count: $$$.count + 1
}))



register("dec", $$$ => ({
  ...$$$,
  count: $$$.count - 1
}))



register("send count on change", ($$$, { pid }) => ({
  ...$$$,
  loggers: [ ...$$$.loggers, pid ]
}))



registerPost(({ count, loggers, name }, { type }) => {
  switch (type) {
    case "inc":
    case "dec":
      emit(count)
      loggers.forEach(pid => send(pid, { type:"update", count, name }))
  }
})
