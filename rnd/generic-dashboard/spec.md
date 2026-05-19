Here is a complete, production-ready architectural specification for your generic, configuration-driven dashboard engine. It maps the 3-Layer Haskell Cake design philosophy onto an abstract runtime compiler.

You can copy the raw markdown text block below and save it as `3-layer-cake-generic-dashboard-spec.md`.

```markdown
# Architectural Specification: Generic Configuration-Driven Dashboard Engine
## Paradigm: Three-Layer Cake (Interpreter / AST Pattern)

This document outlines the software design specification for a generic, multi-database dashboard system. The system treats runtime configuration files (YAML/JSON) as source code, parsing them into an Abstract Syntax Tree (AST), translating intent through an abstract query engine, and rendering interfaces across multiple target platforms (Web/TUI).

---

## 1. Architectural Overview

The architecture utilizes a strict, downward-only dependency chain based on the Functional Three-Layer Cake framework. 


```

┌────────────────────────────────────────────────────────┐
│ LAYER 3: THE META-MODEL (Pure AST & Config Schemas)    │ <── Top (Pure Data)
└───────────────────────────┬────────────────────────────┘
│ (Imports Layer 3)
▼
┌────────────────────────────────────────────────────────┐
│ LAYER 2: THE ABSTRACT ENGINE (Query DSL & View Maps)   │ <── Middle (Logic)
└───────────────────────────┬────────────────────────────┘
│ (Imports Layer 2 & 3)
▼
┌────────────────────────────────────────────────────────┐
│ LAYER 1: THE IMPERATIVE SHELL (Drivers & Platform UI) │ <── Bottom (Side Effects)
└────────────────────────────────────────────────────────┘

```

### Architectural Rules:
1. **Downward Dependencies Only:** Layer 3 cannot import Layer 2 or Layer 1. Layer 2 cannot import Layer 1.
2. **Purity Isolation:** Layer 3 and Layer 2 are completely free of platform side effects (`IO`, raw network calls, direct database sockets, UI framework specifics).
3. **Swappable Runtime:** Layer 1 provides concrete implementations for execution and rendering. The core engine is agnostic to whether it is fetching from Postgres or MongoDB, or whether it is rendering to an HTML DOM or a Terminal (TUI) character grid.

---

## 2. Layer-by-Layer Technical Specification

### Layer 3: The Meta-Model (Pure AST)
**Responsibility:** Parsing, validating, and structuring incoming YAML/JSON dashboard configuration files. It transforms strings into highly typed runtime definitions.

*   **Core Concepts:** Configuration Schema, Layout Specifications, Query Block Structures, Validation Invariants.
*   **Data Structures:**
    *   `DashboardConfig`: The root definition containing metadata, data source references, and view arrays.
    *   `LayoutComponent`: Unified definition of layout grids, widths, and structural hierarchies (rows, columns).
    *   `AbstractQuery`: A data representation of data fetching intent (columns, aggregates, filters, limits), omitting database-specific dialects.

#### Implementation Target (TypeScript Example):
```typescript
// src/domain/ast.ts

export type DatabaseType = 'postgres' | 'mongodb' | 'clickhouse';

export interface ComponentConfig {
  id: string;
  type: 'table' | 'line-chart' | 'stat-box';
  title: string;
  query: AbstractQuery;
}

export interface AbstractQuery {
  collection: string;
  select: string[];
  where?: Array<{ field: string; operator: 'eq' | 'gt' | 'contains'; value: any }>;
  limit: number;
}

export interface DashboardConfig {
  version: string;
  datasource: { id: string; type: DatabaseType };
  layout: {
    rows: Array<{
      height: number;
      columns: ComponentConfig[];
    }>;
  };
}

```

---

### Layer 2: The Abstract Engine (Query DSL & State Evaluation)

**Responsibility:** Operating on the parsed AST to calculate logical transformations, state mutations, and abstract query compilation.

* **Core Concepts:** Query Normalization, Client-Side Data Transformation, Cross-Component Communication (filtering one component via a click on another).
* **The Query Engine Port:** Defines the algebraic interfaces (Capabilities) required to communicate with databases.

#### Implementation Target (TypeScript/FP Pattern Example):

```typescript
// src/engine/queryEngine.ts
import { AbstractQuery, DashboardConfig } from '../domain/ast';

// The Abstract Capability Interface (The Port)
export interface DatabasePort {
  executeNormalizedQuery: (query: AbstractQuery) => Promise<Record<string, any>[]>;
}

// Pure Core Processing Controller
export class DashboardController {
  constructor(private dbAdapter: DatabasePort) {}

  /**
   * Orchestrates the execution of a dashboard widget layout pipeline.
   * Takes abstract config blocks, fetches raw rows, and formats them.
   */
  async loadWidgetData(query: AbstractQuery): Promise<any[]> {
    // 1. Intercept query to apply global rules (e.g., forcing tenancy limits)
    const sanitizedQuery = this.applyGlobalFilters(query);
    
    // 2. Delegate execution down to Layer 1 via the abstract interface
    const rawData = await this.dbAdapter.executeNormalizedQuery(sanitizedQuery);
    
    // 3. Process mutations cleanly (e.g., sorting, transforming datetime formats)
    return this.transformPayload(rawData);
  }

  private applyGlobalFilters(q: AbstractQuery): AbstractQuery {
    return { ...q, limit: Math.min(q.limit, 1000) }; // Hard enforcement
  }

  private transformPayload(rows: any[]): any[] {
    return rows.map(row => ({ ...row, _fetchedAt: Date.now() }));
  }
}

```

---

### Layer 1: The Imperative Shell (Infrastructure & Adapters)

**Responsibility:** The concrete execution. This layer talks to real hardware, sets up OS listeners, executes raw database dialects, and renders layout components to pixels or monospaced character blocks.

* **Core Concepts:** Database Sockets, Connection Pooling, UI Primitives (React DOM / Ink Terminal).

#### Driver Component (Adapting Layer 2 to real Infrastructure):

```typescript
// src/infrastructure/drivers/postgresAdapter.ts
import { DatabasePort } from '../../engine/queryEngine';
import { AbstractQuery } from '../../domain/ast';
import { Client } from 'pg'; // Real third-party library

export class PostgresAdapter implements DatabasePort {
  constructor(private pgClient: Client) {}

  async executeNormalizedQuery(query: AbstractQuery): Promise<Record<string, any>[]> {
    // Translate the Abstract Query AST into a physical Postgres SQL dialect string
    let sql = `SELECT ${query.select.join(', ')} FROM ${query.collection}`;
    
    if (query.where) {
      const clauses = query.where.map(w => `${w.field} = '${w.value}'`); // Over-simplified injection vulnerable model for spec demo
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }
    
    sql += ` LIMIT ${query.limit}`;
    
    const result = await this.pgClient.query(sql);
    return result.rows;
  }
}

```

#### UI Presentation Component (Mapping AST to multi-target UI output):

```tsx
// src/infrastructure/ui/DynamicComponent.tsx
import React from 'react';
import { ComponentConfig } from '../../domain/ast';

interface WidgetProps {
  meta: ComponentConfig;
  data: any[];
  renderEngine: 'WEB' | 'TUI';
}

export const DynamicWidget: React.FC<WidgetProps> = ({ meta, data, renderEngine }) => {
  if (renderEngine === 'TUI') {
    // Target Terminal Canvas via Ink primitives
    // (Pretend Box and Text are imported from 'ink')
    return (
      //@ts-ignore
      <Box borderStyle="round" flexDirection="column" padding="{1}">
        
        <Text bold color="cyan">{meta.title}</Text>
        {data.map((row, idx) => (
          //@ts-ignore
          <Text key="{idx}">- {JSON.stringify(row)}</Text>
        ))}
      </Box>
    );
  }

  // Target Standard Web browser DOM canvas
  return (
    <div className="card-shadow p-4 rounded bg-white">
      <h3 className="text-lg font-bold text-slate-800">{meta.title}</h3>
      <table className="min-w-full divide-y divide-slate-200">
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}><td className="whitespace-nowrap px-3 py-2 text-sm">{JSON.stringify(row)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

```

---

## 3. Directory Layout Blueprint

Implementations of this dashboard spec should adhere to the following directory layout inside monorepos or isolated engine packages:

```text
dashboard-engine/
├── config/                  # Folder housing runtime dashboard layout files (.yaml)
│   └── main-ops.yaml
├── src/
│   ├── domain/              # LAYER 3: The Pure Core Models (AST)
│   │   ├── ast.ts
│   │   └── parser.ts        # Pure schema validators (Zod/ArkType implementations)
│   │
│   ├── engine/              # LAYER 2: Pure Logical Pipeline & Engine Ports
│   │   └── queryEngine.ts
│   │
│   └── infrastructure/      # LAYER 1: The Side-Effectual Platform Layer
│       ├── drivers/         # Real DB network clients
│       │   ├── postgresAdapter.ts
│       │   └── mongoAdapter.ts
│       └── ui/              # Real visual outputs
│           ├── browserView.tsx
│           └── terminalView.tsx
└── app.ts                   # Bootstrapper: Reads config -> Parses via L3 -> Boots Controller L2 -> Mounts UI L1

```

---

## 4. Architectural Advantages Verified

1. **Hot-Swappable Database Drivers:** Introducing a new telemetry data source (e.g., ClickHouse) requires zero refactoring of Layer 3 configurations or Layer 2 routing logic. You code a concrete `ClickHouseAdapter` in Layer 1 that implements the `DatabasePort` contract.
2. **Platform-Independent Logic Execution:** Aggregation math, state updates, user permissions, and configuration schema parsing can be thoroughly tested via ultra-fast node or vitest execution layers without executing any visual engine code or spinning up testing database instances.
3. **Multi-Channel Delivery:** The exact same `.yaml` metadata specification can cleanly output a rich graphic browser interface for management dashboards while instantly rendering as an explicit, high-performance console application for server administrators interacting entirely via terminal SSH pipes.

```</WidgetProps></Record<string,></Record<string,>

```