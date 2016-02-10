import { guid } from "./guid"

let actors    = {}
let listeners = {}

export const spawn = (worker, state, opts = {}) => {
  var pid = opts.pid || guid()

  actors[pid] = new Worker(worker + ".js")
  listeners[pid] = {}

  actors[pid].addEventListener("message", ({ data }) => {
    switch (data.type) {
      case "@@send":  return send(data.pid, data.message, data._from)
      case "@@spawn": return spawn(data.worker, data.initialState, data.opts)
      case "@@stop":  return stop(data.pid)
      case "@@emit":  return Object
        .keys(listeners[pid])
        .forEach(fnid => listeners[pid][fnid](data.message, data._from))
    }
  }, false)

  send(pid, {
    type:"@@init",
    state,
    pid,
    worker,
  })

  return pid
}

export const send = (pid, message, _from) => {
  let msg = { ...message, _from }
  if (actors[pid] == null) return false
  actors[pid].postMessage(msg)
  return true
}

export const stop = pid => {
  send(pid, { type:"@@stop" })

}

export const listen = (pid, fn) => {
  var fnid = guid()
  listeners[pid][fnid] = fn

  return () => {
    delete listeners[pid][fnid]
  }
}
