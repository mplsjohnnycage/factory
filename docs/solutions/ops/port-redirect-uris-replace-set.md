---
title: Port External Interface redirectUris replaces the entire set
category: ops
pbi: PBI-015
linear: STL-176
verified: 2026-10-29
status: active
---

# Port External Interface redirectUris replaces the entire set

## Problem

Factory External Interface apps accept at most **5** exact redirect URIs. Ephemeral Vercel preview hosts (`factory-developer-<id>-johnnyc.vercel.app`) accumulate and burn the budget. Operators may assume Port **merges** new URIs into the allowlist.

## Why it is not obvious from code

`apps/developer-os` only *emits* a `redirect_uri`. The Port MCP `upsert_external_interface_app` contract replaces the **entire** `redirectUris` array on update — merge is not the live behavior. Missing a backup allowlist before prune permanently drops keepers until restored.

## Durable rule

1. **Dry-run** `list_external_interface_apps` and record the full current allowlist.
2. **Backup** that allowlist before any upsert (rollback payload).
3. Upsert **only** the intended keep set (stable Dev OS + localhost).
4. **Verify** with a second list call.
5. Rollback = upsert the backup allowlist (same `appId`).

## Evidence (2026-10-29)

- App `Factory` / client `tnPUmUX5M0h8CdTZtaEbhhMOX0VFkUc0`
- Pruned temp `https://factory-developer-n5tdoht4l-johnnyc.vercel.app/api/auth/callback`
- Kept: localhost, 127.0.0.1, `https://factory-developer-os.vercel.app/api/auth/callback`
- Rollback payload retained in Project store coding-loop tick

## Do not

- Register rotating preview hosts
- Call upsert without a backup list
- Touch Observatory apps
