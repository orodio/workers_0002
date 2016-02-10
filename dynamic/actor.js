import { guid } from "./guid"

export const createActor = ($$$ = {}) => {
  let __pid, __pre, __post, __typ
  let __$$$ = $$$
  let __fns = {}

  const register     = (type, fn) => __fns[type] = fn
  const registerPre  = fn         => __pre = fn
  const registerPost = fn         => __post = fn

  const stop = pid     => self.postMessage({ type:"@@stop", pid })
  const emit = message => self.postMessage({ type:"@@emit", message, _from:__pid })

  const send = (pid, message) => {
    self.postMessage({ type:"@@send", pid, message, _from:__pid })
  }

  const spawn = (worker, state, opts = {}) => {
    opts = { ...opts, pid:opts.pid || guid() }
    self.postMessage({ type:"@spawn@", worker, state, opts })
    return pid
  }

  register("@@stop", () => self.close())
  register("@@init", ($$$, { pid, worker, state = null }) => {
    __pid = pid
    __typ = worker
    return state != null ? { ...$$$, ...state } : $$$
  })

  self.addEventListener("message", ({ data:event }) => {
    if (!!__pre) __pre(__$$$, event)
    if (__fns[ event.type ]) __$$$ = __fns[ event.type ](__$$$, event)
    if (!!__post) __post(__$$$, event)
  })

  return {
    register,
    registerPre,
    registerPost,
    stop,
    emit,
    send,
    spawn,
  }
}
