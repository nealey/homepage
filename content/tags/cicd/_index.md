---
title: CI/CD
description: Having the server do things for you
---

Continuous Integration / Continuous Deployment (CI/CD)
is the practice of beginning some automated process
when a developer requests it.

This is typically integrated into Version Control:
when you're working on something,
you will periodically think "this is a good place to take a snapshot."
So you'll commit your changes and push them up to the server.
CI/CD sees this push,
and then starts running a bunch of pre-defined rules on what you submitted.

These rules can consist of tests,
publication (releasing a new version),
deployments (cause the new version to start running somewhere),
or a combination of all three.
