# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal portfolio for Simon Köck built as a documentation site using Mintlify. The concept: a portfolio disguised as developer documentation, exposing work through versioned docs and planned API endpoints.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build all apps
pnpm lint         # Run linters
pnpm format       # Format code with Prettier
pnpm check-types  # Type check all apps
```

All commands run through Turbo for monorepo orchestration.

## Architecture

**Monorepo Structure:**
- `apps/docs/` - Main Mintlify documentation site (MDX content)
- `packages/` - Reserved for shared utilities (currently empty)

**Tech Stack:**
- Mintlify for documentation framework
- Turbo for build orchestration
- pnpm 9.0.0 as package manager
- TypeScript 5.9.2

**Mintlify Configuration:**
- Config file: `apps/docs/docs.json`
- Content pages are MDX files in `apps/docs/`
- Theme color: #8b5cf6 (purple)
- Logos in `apps/docs/logo/` (light/dark variants)
