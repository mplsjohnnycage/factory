# How data models are built into Convex components

Research for Johnny Cage / Factory Project. Official Convex documentation only (Context7 + [docs.convex.dev/llms.txt](https://docs.convex.dev/llms.txt) and linked pages). No master-spec edits.

**Sources used**

| Kind | Path / URL |
|------|------------|
| Index | [https://docs.convex.dev/llms.txt](https://docs.convex.dev/llms.txt) → `components/*` |
| Docs | [Components overview](https://docs.convex.dev/components/overview), [Understanding](https://docs.convex.dev/components/understanding), [Using](https://docs.convex.dev/components/using), [Authoring](https://docs.convex.dev/components/authoring) |
| Config | [schema.ts](https://docs.convex.dev/config/schema.ts.md) |
| Context7 | `/websites/convex_dev`, `/llmstxt/convex_dev_llms_txt` (same official pages) |

---

## 1. Do components ship with their own data model definitions?

**Yes.** A Convex component is a mini self-contained backend with its own schema, tables, validators, and isolated storage—not just shared library code.

> “Convex Components are self-contained backend modules that bundle functions, schemas, and data together.”  
> — [Understanding Components](https://docs.convex.dev/components/understanding)

> “Once installed, they have their own database tables and isolated function execution environment.”  
> — [Components overview](https://docs.convex.dev/components/overview)

Authoring docs describe the component folder as parallel to a normal `convex/` tree, including an explicit schema file:

```text
component/
 ├── _generated/        # Generated code for the component's API and data model.
 ├── convex.config.ts   # Defines the component and its child components.
 ├── schema.ts          # Defines a schema only accessible by the component
 └-- …folders/files.ts  # Queries, mutations, and actions for the component.
```

— [Authoring Components](https://docs.convex.dev/components/authoring)

Components can store data as:

- “Database tables with their own schema validation definitions”
- “File storage, independent of the main app's file storage”
- “Durable functions via the built-in function scheduler”

— [Understanding Components → Data](https://docs.convex.dev/components/understanding#data)

Building as a component (vs a plain library) lets you “Persist data to tables where you control the schema” and “Isolate access to data behind an API boundary.”  
— [Authoring Components](https://docs.convex.dev/components/authoring)

Schema shape matches the host app: `defineSchema` / `defineTable` with `v.*` validators (as in normal Convex schemas).  
— [schema.ts](https://docs.convex.dev/config/schema.ts.md); Context7 `/websites/convex_dev` → `defineSchema` / `defineTable`

---

## 2. How are component data models defined and exposed?

### Defined (component-internal)

- Each component owns a **`schema.ts`** that “Defines a schema **only accessible by the component**.”  
  — [Authoring Components](https://docs.convex.dev/components/authoring)
- Codegen produces a component-local **`_generated/dataModel.ts`** for that component’s tables.  
  — [Authoring → Generated code](https://docs.convex.dev/components/authoring#generated-code)
- Component functions import builders from **the component’s** `_generated/server`, not the app’s.  
  — same section

### Exposed (component-exported API — not tables)

Host apps do **not** get direct table access. Isolation and encapsulation are explicit:

> “code inside a component can't read data that is not explicitly provided to it. This includes database tables, file storage, environment variables, scheduled functions, etc. Conversely, **the component's data cannot be directly mutated by the main app**, allowing full separation of concerns.”  
> — [Understanding → Isolation](https://docs.convex.dev/components/understanding#isolation)

> “**Components expose an explicit API, not direct database table access.** Data invariants can be enforced in code, within the abstraction boundary.”  
> — [Understanding → Encapsulation](https://docs.convex.dev/components/understanding#encapsulation)

> “Runtime validation ensures all data that cross a component boundary are validated: both arguments and return values.”  
> — same section

Boundary details from authoring docs:

| Concern | Behavior |
|--------|----------|
| Visibility | Only **public** component functions appear on `ComponentApi`; they become **internal** references the host calls via `ctx.runQuery` / `runMutation` / `runAction` (not HTTP/WebSocket clients). |
| IDs | Inside the component, `Id<"tableName">` / `v.id("…")` apply to **that component’s** tables. Across the boundary, **IDs become plain strings** in `ComponentApi`. |
| Cross-component `v.id` | “you cannot currently have a `v.id("table_name")` validator that represents a table in another component / app.” |
| Useful types | “`Id` and `Doc` types [in the component’s `dataModel.ts`] are **not useful outside of the component**, since the API turns all ID types into strings at the boundary.” |

— [Authoring → Component API / Id types / Generated code](https://docs.convex.dev/components/authoring)

Optional client wrappers (classes, re-exports) still call into that API; they do not open the tables.  
— [Authoring → Wrapping the component with client code](https://docs.convex.dev/components/authoring#wrapping-the-component-with-client-code)

---

## 3. How are they composed when multiple components are used together?

Composition is a **tree**: the main app is the root; components (and nested child components) are installed via `use`.

> “Instances of the component are configured when used by the main app or other components in their `convex.config.ts` files, forming a **tree of components, with the main app at the root**.”  
> — [Authoring Components](https://docs.convex.dev/components/authoring)

Host install (can install several components, or the **same** component multiple times under different names):

```ts
import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config.js";

const app = defineApp();
app.use(agent);
app.use(agent, { name: "agent2" });
//... Add other components here
export default app;
```

> “Multiple instances of the same component can be installed by calling `use` multiple times with different names. **Each will have their own tables and functions.**”  
> — [Using Components](https://docs.convex.dev/components/using)

Child components mount similarly from a parent component’s `convex.config.ts` (`component.use(workpool)`, optional `{ name }`, optional `httpPrefix`).  
— [Authoring → Anatomy](https://docs.convex.dev/components/authoring)

At runtime:

- Access is through `components.<installName>…` (or client libs that take that reference).  
  — [Using Components](https://docs.convex.dev/components/using)
- Writes across the app and component mutations still commit as **one top-level transaction**; a failed component sub-transaction can be caught without rolling back the whole host mutation.  
  — [Understanding → Isolation](https://docs.convex.dev/components/understanding#isolation); [Using → Transactions](https://docs.convex.dev/components/using#transactions)
- Dashboard shows each component’s data/schema separately via a component dropdown.  
  — [Using → Dashboard](https://docs.convex.dev/components/using#dashboard)

They do **not** merge into one flat shared schema: each install keeps sandboxed tables and an isolated execution environment.  
— [Components overview](https://docs.convex.dev/components/overview); [Using Components](https://docs.convex.dev/components/using)

---

## 4. Can a host app’s data model reference or extend a component’s tables?

### Direct reference / join / `v.id` into component tables — **no (not supported)**

Official constraints:

1. Host cannot directly read or mutate component tables (must go through the component API).  
   — [Understanding → Isolation / Encapsulation](https://docs.convex.dev/components/understanding)
2. `v.id("table_name")` cannot currently point at a table in another component or the main app from the other side. Table number encodings differ per component.  
   — [Authoring → Id types and validation](https://docs.convex.dev/components/authoring#id-types-and-validation)
3. Component `Id` / `Doc` types are not meant for use in the host schema; boundary types are **strings**.  
   — [Authoring → Generated code](https://docs.convex.dev/components/authoring#generated-code)

**Practical host pattern:** store opaque string identifiers returned by the component (or pass host IDs *into* component APIs as strings), and keep relational integrity behind the component’s functions—not foreign keys in the host `schema.ts`.

### “Extend” component tables from the host schema — **not via normal composition**

The host’s `convex/schema.ts` declares **the app’s** tables; it does not merge or subclass a component’s `schema.ts`.  
— [schema.ts](https://docs.convex.dev/config/schema.ts.md); component anatomy in [Authoring](https://docs.convex.dev/components/authoring)

**Hybrid components** are a documented exception pattern: a local component plus shared library code that can give “extra flexibility when users need to **override or extend the schema or functions**.” Docs warn this “introduce[s] a lot of complexity for maintaining and updating the component in backwards-compatible ways” and prefer explicit composition/extension APIs instead.  
— [Authoring → Hybrid components](https://docs.convex.dev/components/authoring#hybrid-components)

That is an authoring/distribution pattern (local schema ownership), **not** “host `schema.ts` extends installed NPM component tables.”

---

## Short answers (checklist)

| # | Question | Answer |
|---|----------|--------|
| 1 | Own data model (schemas, tables, validators)? | **Yes** — per-component `schema.ts`, tables, validation, isolated storage. |
| 2 | Internal vs exported? | **Internal:** tables + `dataModel` only inside the component. **Exported:** public function API with validated args/returns; IDs as strings; no direct DB access. |
| 3 | Multiple components? | Tree via `app.use` / `component.use`; named instances each get **their own** tables; transactional cross-calls. |
| 4 | Host schema reference/extend component tables? | **No direct table/`v.id` references.** Interact via API + string IDs. Hybrid local components can override schema only as a special authoring pattern. |

---

## Primary citations

- [https://docs.convex.dev/llms.txt](https://docs.convex.dev/llms.txt)
- [https://docs.convex.dev/components/overview](https://docs.convex.dev/components/overview)
- [https://docs.convex.dev/components/understanding](https://docs.convex.dev/components/understanding)
- [https://docs.convex.dev/components/using](https://docs.convex.dev/components/using)
- [https://docs.convex.dev/components/authoring](https://docs.convex.dev/components/authoring)
- [https://docs.convex.dev/config/schema.ts.md](https://docs.convex.dev/config/schema.ts.md)
- Context7: `/websites/convex_dev`, `/llmstxt/convex_dev_llms_txt` (queries on component schemas / isolation)
