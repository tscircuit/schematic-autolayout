# @tscircuit/schematic-autolayout

[Visual Examples](https://autolayout.tscircuit.com)

Algorithms for automatic layout PCBs and Schematics

For routing algorithms, see [@tscircuit/routing](https://github.com/tscircuit/routing)

## Usage

To use this library in your project:

1. Install the package:

```bash
npm install @tscircuit/schematic-autolayout
```

2. Import the necessary functions:

```typescript
import { scene, ascendingCentralLrBug1 } from "@tscircuit/schematic-autolayout"
```

3. Create a scene and apply the layout algorithm:

```typescript
const myScene = scene()
  .addCcwBox("U1", { x: 0, y: 0, leftPorts: 3, rightPorts: 3 })
  .addLrBox("R1", { x: -2, y: 0 })
  .connect("U1.1", "R1.right")
  .build()

const layoutedScene = ascendingCentralLrBug1(myScene)
```

4. Use the layouted scene in your application, for example with a renderer:

```typescript
import { PlaygroundScene } from "@tscircuit/schematic-autolayout"

function MyComponent() {
  return <PlaygroundScene scene={layoutedScene} />
}
```

## Main Layout

The main autolayout algorithm we're working on currently focuses on schematic
layout and determines which of the following scenarios is the best fit:

1. Row layout (a simple row, e.g. multiple passives)
2. Column layout (a simple column, e.g. multiple passives)
3. Central LR bug with ascending columns

![](./docs/2024-04-24-22-36-58.png)

## Post-layout Processing

In this stage, ports are aligned for the layout is adjusted for general orderly-ness.

1. Port alignment
2. Central LR Bug Only: Shift columns downward where the adjacent colum has the
   same bottom net

![](./docs/2024-04-24-22-39-24.png)
