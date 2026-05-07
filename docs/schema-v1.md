# Schema v1 (Value Coordinate System)

This document describes the **v1 export schemas** produced by the unified Value Engine:

- **`app/utility.js`**: single source of truth for math
- **`app/schemas.js`**: single source of truth for serialization

All exported objects MUST include:

- `schemaVersion: "v1"`
- `kind: <string>`

## Common conventions

- **Value dimension order**: always matches `valueDimensions` in `app/constants.js`
  - `self_direction`
  - `stimulation`
  - `hedonism`
  - `achievement`
  - `power`
  - `security`
  - `conformity`
  - `tradition`
  - `benevolence`
  - `universalism`
- **`w_i`**: a length-10 array of numbers (centered PVQ weights).
- **`v`**: a length-10 array of numbers (choice value vector, currently 1..10 by UI convention).
- **`effort`**: number (currently 1..10 by UI convention).

---

## `value_profile`

### Purpose

Represents the user's stable parameters for utility evaluation:

- `w_i` value weight vector (Schwartz PVQ-40 centered weights)
- metadata about where the vector came from (`source`)

### Fields

- `schemaVersion` (`"v1"`)
- `kind` (`"value_profile"`)
- `source` (`"pvq40"` | `"manual_w_i"`)
- `createdAt` (ISO string)
- `valueDimensions` (string[10], dimension IDs in canonical order)
- `w_i` (number[10])
- `grandMean` (number, optional; only for PVQ source)
- `topDimensionIds` (string[], optional; PVQ-derived)
- `bottomDimensionIds` (string[], optional; PVQ-derived)
- `dimensions` (object[], optional; PVQ per-dimension stats)
- `answers` (object, optional; PVQ raw answers by question id)
- `pvqPayloadVersion` (number, optional; PVQ internal payload version)

### Example

```json
{
  "schemaVersion": "v1",
  "kind": "value_profile",
  "source": "pvq40",
  "createdAt": "2026-05-07T02:31:12.123Z",
  "valueDimensions": [
    "self_direction",
    "stimulation",
    "hedonism",
    "achievement",
    "power",
    "security",
    "conformity",
    "tradition",
    "benevolence",
    "universalism"
  ],
  "w_i": [0.55, 0.12, 0.08, 0.41, -0.33, 0.02, -0.62, -0.40, 0.10, 0.07],
  "grandMean": 3.825,
  "topDimensionIds": ["self_direction", "achievement", "stimulation"],
  "bottomDimensionIds": ["conformity", "tradition"]
}
```

---

## `choice`

### Purpose

Represents a single evaluable option \(x\) with its value vector and effort.

### Fields

- `schemaVersion` (`"v1"`)
- `kind` (`"choice"`)
- `id` (string, stable within a session/export)
- `name` (string)
- `tag` (string, optional label/category)
- `v` (number[10])
- `effort` (number)

### Example

```json
{
  "schemaVersion": "v1",
  "kind": "choice",
  "id": "calc_item_3",
  "name": "读一本专业书",
  "tag": "学习·成长",
  "v": [7, 3, 2, 7, 2, 4, 3, 3, 2, 5],
  "effort": 6
}
```

---

## `compare_session`

### Purpose

An export produced by **Compare** (`compare.html`). Contains:

- the user's `value_profile`
- utility parameters (`c_i`, mode, formula)
- edited choices
- rankings (computed results and top contributors)

### Fields

- `schemaVersion` (`"v1"`)
- `kind` (`"compare_session"`)
- `exportedAt` (ISO string)
- `profile` (`value_profile`)
- `utilityParams` (object)
  - `c_i` (number)
  - `c_i_mode` (`"continuous_0_1"` currently)
  - `formula` (string)
- `choices` (`choice[]`)
- `rankings` (array)
  - `rank` (number)
  - `choiceId` (string)
  - `name` (string)
  - `tag` (string)
  - `utility` (object)
    - `U_i` (number)
    - `benefit` (number)
    - `cost` (number)
  - `topContributors` (array)
    - `rank` (number)
    - `dimensionId` (string)
    - `contribution` (number)

### Example

```json
{
  "schemaVersion": "v1",
  "kind": "compare_session",
  "exportedAt": "2026-05-07T03:01:00.000Z",
  "profile": {
    "schemaVersion": "v1",
    "kind": "value_profile",
    "source": "pvq40",
    "createdAt": "2026-05-07T02:31:12.123Z",
    "valueDimensions": ["self_direction","stimulation","hedonism","achievement","power","security","conformity","tradition","benevolence","universalism"],
    "w_i": [0.55,0.12,0.08,0.41,-0.33,0.02,-0.62,-0.40,0.10,0.07]
  },
  "utilityParams": {
    "c_i": 0.45,
    "c_i_mode": "continuous_0_1",
    "formula": "U_i(x)=dot(w_i,v(x))-c_i*effort(x)"
  },
  "choices": [
    {
      "schemaVersion": "v1",
      "kind": "choice",
      "id": "compare_preset_0",
      "name": "换一份更有挑战的工作",
      "tag": "career",
      "v": [7,7,3,8,5,4,3,2,2,3],
      "effort": 8
    }
  ],
  "rankings": [
    {
      "rank": 1,
      "choiceId": "compare_preset_0",
      "name": "换一份更有挑战的工作",
      "tag": "career",
      "utility": { "U_i": 4.1234, "benefit": 7.7234, "cost": 3.6000 },
      "topContributors": [
        { "rank": 1, "dimensionId": "self_direction", "contribution": 3.85 },
        { "rank": 2, "dimensionId": "achievement", "contribution": 3.28 },
        { "rank": 3, "dimensionId": "stimulation", "contribution": 0.84 }
      ]
    }
  ]
}
```

---

## `calculator_session`

### Purpose

An export produced by **Calculator** (`ui_calculator.html`). Same structure as `compare_session`, but utility params include how `c_i` was derived.

### Fields

- `schemaVersion` (`"v1"`)
- `kind` (`"calculator_session"`)
- `exportedAt` (ISO string)
- `profile` (`value_profile`)
- `utilityParams` (object)
  - `c_i` (number)
  - `c_i_mode` (`"likert_willingness_1_10"` currently)
  - `willingness_likert` (number | null)
  - `mapping_formula` (string)
- `choices` (`choice[]`)
- `rankings` (same as `compare_session`)

### Example

```json
{
  "schemaVersion": "v1",
  "kind": "calculator_session",
  "exportedAt": "2026-05-07T03:05:00.000Z",
  "profile": {
    "schemaVersion": "v1",
    "kind": "value_profile",
    "source": "manual_w_i",
    "createdAt": "2026-05-07T03:04:59.000Z",
    "valueDimensions": ["self_direction","stimulation","hedonism","achievement","power","security","conformity","tradition","benevolence","universalism"],
    "w_i": [0.55,0.12,0.08,0.41,-0.33,0.02,-0.62,-0.40,0.10,0.07]
  },
  "utilityParams": {
    "c_i": 0.333,
    "c_i_mode": "likert_willingness_1_10",
    "willingness_likert": 7,
    "mapping_formula": "c_i = (10 - willingness) / 9"
  },
  "choices": [],
  "rankings": []
}
```

---

## `value_profile_snapshot`

### Purpose

A snapshot export of the current `value_profile` (produced by Results page). This is the preferred “portable identity” export for downstream tools.

### Fields

- `schemaVersion` (`"v1"`)
- `kind` (`"value_profile_snapshot"`)
- `exportedAt` (ISO string)
- `profile` (`value_profile`)

### Example

```json
{
  "schemaVersion": "v1",
  "kind": "value_profile_snapshot",
  "exportedAt": "2026-05-07T03:10:00.000Z",
  "profile": {
    "schemaVersion": "v1",
    "kind": "value_profile",
    "source": "pvq40",
    "createdAt": "2026-05-07T02:31:12.123Z",
    "valueDimensions": ["self_direction","stimulation","hedonism","achievement","power","security","conformity","tradition","benevolence","universalism"],
    "w_i": [0.55,0.12,0.08,0.41,-0.33,0.02,-0.62,-0.40,0.10,0.07]
  }
}
```

---

## Breaking changes (deprecated old exports)

The **old flat exports are deprecated**.

Previously, exports were often a flat object such as:

- `{ createdAt, w_i, grandMean, top, bottom, ... }`

In v1, all exports are **enveloped** and include:

- `{ schemaVersion, kind, exportedAt, ... }`

Downstream consumers MUST branch on `kind` and read the documented shapes above.

