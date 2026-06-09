---
title: JWT explained
description: Understand what JWT tokens are, how they are structured, and when to decode them.
slug: jwt-explained
date: 2026-06-08
---
# JWT explained

JWT stands for JSON Web Token. It is a compact token format commonly used in authentication systems.

## JWT parts

A JWT usually contains three parts:

- Header
- Payload
- Signature

## Why developers decode JWTs

Decoding helps you inspect claims like expiration, issuer, subject, and custom fields.

## Important note

Decoding is not the same as verifying a signature. A decoder helps you read the token, not prove it is trustworthy.

## Final takeaway

JWTs are common in modern auth stacks, so knowing how to inspect them is useful.
