---
layout: post
title:  "Concurrency in Ruby"
date:   2023-06-27 08:32:42 +0100
categories: ruby concurrency software
published: false
---

MRI Ruby does in fact support native threads.

Prior to 1.9, only green threads used to be supported - since then Ruby started to leverage real OS-level threads.

While all of this sounds great in theory, parallelism isn’t possible in practice due the Global Interpreter Lock. The GIL is mechanism built into the interpreter to ensure that two threads belonging the same Ruby process can never be executed in parallel. The GIL is just a mutex, that wraps execution of Ruby code. 

There are three reasons that the GIL exists:
- To protect MRI internals from race conditions.
- To facilitate the C extension API.
- To reduce the likelihood of race conditions in your Ruby code.

## Thread Statuses:

Every thread has a status, accessible from Thread#status.

It's probably most common for one thread to check the status of some other thread, but it is possible for a thread to check its own status using `Thread.current.status`. Ruby defines several possible values for Thread#status.
- `run`: Threads currently running have this status.
- `sleep`: Threads currently sleeping, blocked waiting for a mutex, or waiting on IO, have this status. Sleeping threads are outside the thread scheduler's responsibility.
- `false`: Threads that finished executing their block of code, or were successfully killed, have this status.
- `nil`: Threads that raised an unhandled exception have this status.
- `aborting`: Threads that are currently running, yet dying, have this status.

## The Timing Thread:

In cooperative models, once a thread is given control it continues to run until it explicitly yields control or it blocks. In a preemptive model, the virtual machine is allowed to step in and hand control from one thread to another at any time. Both models have their advantages and disadvantages.

Ruby’s threading model is cooperative, even though it behaves as if it were preemptive from the developer's point of view. As it turns out, a preemptive model wouldn't be possible – yet another consequence of the GIL.

Whenever the interpreter decides to context-switch between threads, the following three steps must all happen (in the given order):

- The current thread has to release the GIL.
- The scheduler has to select the next thread.
- The new thread has to acquire the GIL.

All three of these steps are happening behind scenes and cannot be influenced by your Ruby code. The interesting thing here is, that the GIL has to be released voluntarily by the current thread (which is what makes the threading model cooperative). This implies that the context-switch has to be initiated by the current thread. But how does the current thread decide when a context-switch should happen?

While the interpreter is executing your Ruby code, it’s continuously checking a boolean flag indicating whether a context-switch should happen or not. If the flag is true, it’s initiating the context-switch after which the flag is reset to false.

Setting the flag to true is the responsibility of that extra thread – known as the timer thread. Its implementation is actually really simple and can be summarized as follows:
1) Wait for a fixed period of time.
2) Set the flag to true.
3) Repeat.

The entire purpose of the timer thread is to make context-switch decisions as efficient as possible. As pointed out already, the interpreter only has to check a boolean flag to make its decision (opposed to a more complex algorithm). This is a significant win, if you consider that the interpreter has to make that context-switch decision over and over.

## Ruby 3

> It's multi-core age today. Concurrency is very important. With Ractor, along with Async Fiber, Ruby will be a real concurrent language. — Matz

### Ractor:

- https://scoutapm.com/blog/ruby-ractor
- https://www.fullstackruby.dev/ruby-3-fundamentals/2021/01/27/ractors-multi-core-parallel-processing-in-ruby-3/
- https://github.com/ruby/ruby/blob/master/doc/ractor.md

Ractor is an Actor-model like concurrent abstraction designed to provide a parallel execution feature without thread-safety concerns.

You can make multiple ractors and you can run them in parallel. Ractor enables you to make thread-safe parallel programs because ractors can not share normal objects. Communication between ractors is supported by exchanging messages.

To limit the sharing of objects, Ractor introduces several restrictions to Ruby’s syntax (without multiple Ractors, there is no restriction).

The specification and implementation are not matured and may be changed in the future, so this feature is marked as experimental and shows the “experimental feature” warning when the first Ractor.new occurs.

### Fiber Scheduler

- https://brunosutic.com/blog/ruby-fiber-scheduler
- https://www.youtube.com/watch?v=Y29SSOS4UOc
- https://blog.saeloun.com/2022/03/01/ruby-fibers-101.html

## Wrap Up

The safest path to concurrency is:

1. Don't do it.
2. If you must do it, don't share data across threads.
3. If you must share data across threads, don't share mutable data.
4. If you must share mutable data across threads, synchronize access to that data.

## Useful Links:

- https://workingwithruby.com/wwrt/intro/
