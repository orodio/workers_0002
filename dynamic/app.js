import { spawn, send, listen } from "./pool"

// spawn a single logger actor, it will keep track of the total count
const total = spawn("total")
const $total = document.getElementById("total")
// listen for the total count to be emitted and render it in the dom
listen(total, count => $total.innerText = count)

const winner = spawn("winner")
const $winner = document.getElementById("winner")
listen(winner, name => $winner.innerText = name)


// where we will put our counters
const $counters = document.getElementById("counters")

const row = (key) => {
  // spawn our counter actor for the given key
  const pid = spawn("counter", { name:key })
  // we want to send the current state of our counter to the total and winner processes so they can do their thing
  send(pid, { type:"send count on change", pid:total })
  send(pid, { type:"send count on change", pid:winner })

  // build out the row in the dom
  const $el        = document.createElement("div")
  const $name      = document.createElement("strong")
  const $dec       = document.createElement("button")
  const $count     = document.createElement("span")
  const $inc       = document.createElement("button")

  $name.innerText  = key
  $dec.innerText   = "-1"
  $count.innerText = 0
  $inc.innerText   = "+1"

  $name.classList.add("name")
  $dec.classList.add("button")
  $count.classList.add("count")
  $inc.classList.add("button")

  $el.appendChild($name)
  $el.appendChild($dec)
  $el.appendChild($count)
  $el.appendChild($inc)
  $counters.appendChild($el)

  // when our counter emits the count we want to update the count in the dom
  listen(pid, count => $count.innerText = count)

  // when we click the inc and dec buttons we want to send an inc and dec action to
  // our counter
  $inc.addEventListener("click", e => send(pid, { type:"inc" }))
  $dec.addEventListener("click", e => send(pid, { type:"dec" }))

  // return our pid so we can use it later if we feel like it
  return pid
}

// build our initial two rows
let cat = row("cat")
let dog = row("dog")

const $newCounterInput = document.getElementById("new_counter")
const $newCounterSubmit = document.getElementById("new_counter_submit")

$newCounterSubmit.addEventListener("click", e => {
  if (!$newCounterInput.value.length) return
  row($newCounterInput.value)
  $newCounterInput.value = ""
})
