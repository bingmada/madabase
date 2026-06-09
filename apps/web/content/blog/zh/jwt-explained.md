---
title: JWT 解释
description: 理解 JWT 是什么、它的结构，以及为什么需要解码查看。
slug: jwt-explained
date: 2026-06-08
---
# JWT 解释

JWT 是 JSON Web Token 的缩写，是认证系统中常见的一种紧凑型 token 格式。

## JWT 的组成部分

JWT 通常由三部分组成：

- Header
- Payload
- Signature

## 为什么开发者会解码 JWT

解码可以帮助你查看过期时间、签发方、主题以及自定义 claims。

## 一个重要提醒

解码不等于校验签名。解码器只能帮助你读取 token 内容，不能证明它是可信的。

## 最后总结

JWT 在现代认证系统里很常见，学会查看它会很有帮助。
