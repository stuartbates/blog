---
layout: post
title:  "Mono to Micro"
date:   2023-07-08 13:14:42 +0100
categories: software architecture
published: false
---

## Mono to Micro

As you add more engineers to a monolith it becomes increasingly difficult to deliver in parallel and independently of one another, you begin to step on each others toes and deployments begin to stack up in your CD pipeline. In this scenario microservices may be the answer.

Decomposing a monolith into a series of microservices incrementally can be challenging. I have been involved in a number of these projects, albeit never as the architect leading this project. That said, I have seen and read enough to know there are some good guiding principles that can make this process easier.

Before we start it's important to understand where we're hoping to end up. The end goal is to have a series of microservices that each encapsulate a business capability.  Each microservice will expose an API that developers can discover and use in a self-serve manner. Microservices have independent lifecycle. Developers can build, test and release each microservice independently.

This endeavour is not one to be undertaken lightly, the cost associated with decomposing an existing system to microservices is high and may take many iterations. 

**Start Simple:**

Microservices depend upon having continuous delivery pipelines capable of independently building, testing, and deploying services as well as the ability to secure, debug and monitor a distributed architecture. 

As you develop and refine this capability it makes sense to start with something simple. Ideally identify a capability that is fairly decoupled from the monolith and don’t require changes to many client facing applications that are currently using the monolith and possibly don’t need a data store.

This way you can dip your toe in the water and flesh out your infrastructure before moving onto more complex and deeply embedded capabilities.

**Minimize Dependency on the Monolith:**

A good guiding principle is to minimize dependencies of newly formed microservices back to the monolith. We want to progressively move in a direction that decouples these core capabilities by removing dependencies to the monolith. If the teams follow this principle, what they find is instead, dependencies in the reverse direction, from the monolith to the services. This is a desired dependency direction as it does not slow down the pace of change for new services.

In reality, it will not always be possible to avoid dependencies back to the monolith. In this scenario, try exposing a new API from the monolith. Strive to define the API reflecting the well defined domain concepts and structures, even though the monolith’s internal implementation might be otherwise.

**Split Sticky Capabilities Early:**

Some capabilities within the monolith may be leaky - not well defined as a domain concept and with many of the monolith capabilities depending on it. In order to be able to progress, the developers need to identify these capabilities, deconstruct it into well defined domain concepts and then reify those domain concepts into separate services. This is where Domain Driven Design can be useful.

**Decouple Vertically and Release the Data Early:**

The main driver for decoupling capabilities out of a monolith is to be able to release them independently. 

Most decoupling attempts start with extracting the user facing components or a few facade services to provide developer friendly APIs for the modern UIs but the data remains locked in one schema and storage system. Though this approach gives some quick wins such as changing the UI more frequently, when it comes to core capabilities the delivery teams can only move as fast as the slowest part, the monolith and its monolithic data store. 

Without decoupling the data, the architecture is not microservices. The strategy is to move out capabilities vertically, decouple the core capability with its data and redirect all front-end applications to the new APIs.

Stripe’s four phase data migration strategy is one that applies to many environments that require to incrementally migrate the applications that integrate through the database, while all the systems under change need to run continuously.

**Decouple What is Important to the Business and Changes Frequently:**

Decoupling capabilities from the monolith is hard. I’ve heard Neal Ford use the analogy of a careful organ surgery. In the online retail application, extracting a capability involves carefully extracting the capability’s data, logic, user facing components and redirecting them to the new service. Because this is a non-trivial amount of work, the developers need to continuously evaluate the cost of decoupling against the benefits that they get, e.g. going faster or growing in scale. For example, if the delivery teams' objective is to accelerate the modifications to existing capabilities locked in a monolith, then they must identify the capability that is being modified the most to take out. Decouple parts of the code that are continuously undergoing change and getting a lot of love from the developers and are constraining them most to deliver value fast. The delivery teams can analyse the code commit patterns to find out what has historically changed most, and overlay that with the product roadmap and portfolio to understand the most desired capabilities that will be getting attention in near future. They need to talk to the business and product managers to understand the differentiating capabilities that really matter to them.

**Decouple Capability and not Code:**

Whenever extracting a service, you can either extract code or rewrite capability.

Extracting code may be appealing to the developers who built the existing capabilities owing largely due to the Ikea effect. New engineers to the team may lean towards rebuilding as the cognitive load is lower.

Rewriting gives teams an opportunity to revisit the business capability, initiate a conversation with the business to simplify the legacy process and challenge the old assumption and constraints built over time into the system. It also provides an opportunity for a technology refresh, implementing the new service with a programming language and technology stack that is most suitable for that particular service.

In my experience, in majority of the decomposition scenarios, the teams are better off to rewrite the capability as a new service and retire the old code. Despite the high cost it is very likely that the existing capabilities are not built around clear domain concepts and any long-lived legacy project will have gonethrough many iterations of change could have a high code toxicity level and low value for reuse.

**Go Macro First, then Micro:**

Finding the domain boundaries in a legacy monolith is both an art and science. As a general rule applying domain driven design techniques to find the bounded contexts defining microservices boundaries is a good place to start. It's important that you keep your transactional boundaries intact. 

While there are some heuristics on how big (or small) a microservice should be, e.g: size of the team, time to rewrite the service, how much behavior it must encapsulate, etc... In reality it depends on how many services your teams can independently release, monitor and operate. Start with larger services around a logical domain concept, and break the service down into multiple services when the teams are operationally ready.

**Migrate in Atomic Evolutionary Steps:**

The idea of vanishing a legacy monolith into thin air by decoupling it into beautifully designed microservices is somewhat of a myth and arguably undesirable. Any seasoned engineer can share stories of legacy migration and modernization attempts that got planned and initiated with over optimism of total completion, and at best got abandoned at a good enough point in time. 

With this in mind the aim should be for every new service to be atomic, it either completes or reverts. Every increment must leave us in a better place in terms of the architecture goal.
