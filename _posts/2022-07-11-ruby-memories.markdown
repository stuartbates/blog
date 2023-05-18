---
layout: post
title:  "Ruby Memories"
date:   2023-07-11 20:54:42 +0100
categories: ruby memory
published: false
---

**Intro:**

Memory management is abstracted away to the extent that most Ruby developers are ignorant of the mechanics.

In Ruby, all the memory usage and allocation is done inside the Heap.

> **What is Heap memory?**
> 
> The portion of memory where dynamically allocated memory resides (i.e. memory allocated via malloc). Memory allocated from the heap will remain allocated until the memory is free'd or the program terminates.

**Ruby Space:**

There are two different sets of memory in Ruby. 

The first is the malloc heap. Everything in your program is included in this section of memory. It's not released back to the operating system unless the memory is known to be unused by Ruby at the end of a garbage collection. Examples of objects that live in this heap include byte arrays and data structures managed by a C extension.

The second is the Ruby object heap. This is a subset of the malloc heap and is where most Ruby objects live. If they are large, they may point to the malloc heap. The Ruby heap is what the Ruby garbage collector monitors and cleans up.

The Ruby Object Heap organizes objects into segments called heap pages.

**Heap Pages:**

A heap page consists of a header and a number of slots which are simply small memory locations.

Heap pages are containers of 16kb memory region, accordingly, each Heap page has 408 slots and all the slots on the same heap page are contiguous, with no gaps in between.

A single slot in a heap page holds an RVALUE, which is a representation of an in-memory Ruby object.

The RVALUE comprises 40 bytes and a container for objects of all types (Array, String, Class). Out of these 40 bytes, the initial 8 bytes are reserved for a flag, followed by 8 bytes of Klass pointer. The remaining 24 bytes are reserved for object-specific fields.

**Allocating:**

Initially, when the Heap page is created, all the slots are filled with the special RVALUE type T_NONE. This represents an empty slot and contains only a flag, and a Klass pointer value known as next. This can be further pointed to another RVALUE.

It is evident that not all kinds of data would fit in them, so to deal with this issue, Ruby stores any overflowing information in a different location outside the heap page, and stores a pointer in the slot that can be used to locate the external information.

When the Heap page is initialized, Ruby sets a pointer called freelist pointer to the address of the first slot, and then it starts visiting each of these slots. As it gradually gets to each slot, it sets the freelist pointer to the address of the current slot and the current slot's next pointer to the address of the previous slot. It derives the address of the previous slot from its last visit by creating a LinkedList of the empty slots called FreeList.

When it needs to allocate an object, Ruby asks for an address of an empty slot from a Heap page. Not to mention, the Heap page always returns a freelist pointer that has an address to the empty slot, updates a freelist pointer with the address of the next empty slot and also unlinks the current empty slot from the freelist. This allows Ruby to put data into it. The use of freelist keeps the object allocation operation constant-time, so each time Ruby asks for an empty slot, the Heap page just checks a value of the freelist pointer and returns the address to Ruby.

The heap space is divided into used (Eden) and empty (Tomb) heap pages. When trying to create new objects, Ruby looks for free space in the Eden pages first; if no space is found empty, only then does it take a page from the Tomb.

**Eager Allocation:**

Most objects in Ruby can have an inline shape and a regular shape.

The inline shape is when the object can fit into the remaining space of the 40 byte memory slot. For an array this is usually 3 elements.

Up to 3 elements in an array and the memory allocated to that slot will always be 40 bytes.

After this point, there is no more room in the slot and so a separate C array is allocated in memory to keeps pointers to each array element.

Up until now we've been discussing how much space is used when an array is pre-created with some number of elements.

However, if you append elements to the end of an inlined array past the inline limit, the array's memory allocation will jump in size.

This is because the process of creating a new, larger array to fit the elements, copying over the contents and appending the extra element is expensive.

Ruby tries to avoid these expensive operations by eagerly allocating a little extra memory.

The same process happens when removing elements from an array, Ruby won't necessarily free up that extra memory immediately.

You can however, force Ruby to right-size an array by calling `compact` on the array.

## Garbage Collection

Ruby uses the Mark-Sweep-Compact garbage collection algorithm, also when GC is active, the ruby code does not get executed - it actually stops the entire application to clean the memory! Let us look into each of the GC phases:

**Marking:**

It is the phase where we determine which objects are alive and which can be freed. First, we mark the root-like global variables, classes, etc. along with their children until the mark stack is empty.

**Sweeping:**

It is the phase where all the unmarked objects can be reclaimed by the garbage collector.

**Compaction:**

Compaction moves objects within the heap page to the start of the heap page and it results in various benefits including reduced memory usage, faster garbage collection, and better write performance.
