---
layout: post
title:  "Onboarding"
date:   2022-08-03 08:57:42 +0100
categories: engineering
published: false
---

One of the demands of a contract software engineer is to onboard onto new codebases and get up to speed as quickly as possible.

Most perm engineers will likely only move onto a new codebase every 3 years. As a contractor you're likely moving to a new 
codebase every 3 to 6 months.

When starting a new contract I have two ASAP aims:
- Get up to speed.
- Add significant value.

Here I'm going to focus on what I do to get up to speed as quickly as possible.

We usually seem to think it takes someone 3-6 months to get up to speed and meaningfully contribute. I aim for two weeks.

The main thing to keep in mind it that learning a new codebase is like effectively learning anything new. Start at 30,000 ft and gradually increase the fidelity gradually scratching deeper layer by layer.

1. **Read the system tests**. All test libraries I've used have some form of documentation mode that outputs all of the test, context and assertion expectations in
an easy-to-read format. If they're well crafted, these should give you a good insight into how the system works. One of the purposes of a good test suite is to act as documentation for the system. Start at the system test level, don't concern yourself with low-level unit tests for now. 
2. **Read documentation.** Don't just read anything and everything. Find the high level overviews and start with those. You're probably best off asking other team members for recommendations on what to read (and what's missing).
3. **Document everything.** Learnings, questions and ideas for improvement. I keep an A1 pad next to my laptop at all times to scribble quick notes down in realtime. Then at the end of each day I sit and write up all of the notes in long form. You will only have this beginner/newbie mindset once, don't waste it.
4. **Document the data model**. This is one place I'd recommend spending a little more time and digging a little deeper. That said you still start at 30,000 ft, understanding the domain models and their associations. Once you have that down you can walk through the data model table-by-table documenting what each one does. Data tells the story of what the system does.
5. **Ask questions.** As devs we like to try and answer most questions we have ourselves by digging in but if speed is the focus then asking good questions is a must. Batch them up so you can sit down with people and ask them all in one go. You might also want to figure out who is the best person to ask.
6. **Build a dashboard.** Get access to data and analytics. Understand what they track, what's important to them and maybe start to answer 
your own questions. I like to create my own dashboard with things that don't already exist, it's usually a nice excuse to write SQL against the domain model and really start to understand how it all fits together.
7. **Get to know your teammates.** Building good relationships with your teammates is necessary for working well as part of a team but it also gives you a great opportunity to ask lots of questions about the system and wider organisation.

This list is not exhaustive, and will undoubtedly vary based on the size of the organisation, maturity and sheer scale of the systems you're working with. This list is by no means complete, it will evolve over time as I move to new contracts and refine my approach.
