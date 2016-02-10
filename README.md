# An extremely rough proof of concept for an actor model style concurrent front end.

> *NOTE* The dom manipulation was hastily done, I am working on getting this concept to work with react/virtual-dom, but yeah, not right now

## Goals
- [x] all actors are in their own process
- [x] all actors are spawned off the main thread
- [x] all actors can send messages to each other
- [x] interface for creating an actor and sending a message is the same for both the main thread and other actors
- [ ] hook into react with a redux `connect` like decorator
