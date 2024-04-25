import { getCcwPosition } from "./get-ccw-position"
import { Box, Connection } from "./types"
/**
 * Build a scene with a chained builder
 *
 * scene()
 *  .addCcwBox("A", { x: 0, y: 0, leftPorts: 3, rightPorts: 2 })
 *  .addLRBox("B", { x: 0, y: 0 })
 *  .connect("A.1", "B.left")
 *  .build()
 */
export const scene = () => new SceneBuilder()

export type Scene = {
  boxes: Array<Box>
  connections: Array<Connection>
}

class SceneBuilder {
  boxes: Array<Box>
  connections: Array<Connection>

  constructor() {
    this.boxes = []
    this.connections = []
  }

  addCcwBox(
    box_id: string,
    opts: { x: number; y: number; leftPorts: number; rightPorts: number }
  ) {
    const box: Box = {
      box_id,
      x: opts.x,
      y: opts.y,
      ports: [],
    }

    for (let i = 0; i < opts.leftPorts + opts.rightPorts; i++) {
      const ccwPos = getCcwPosition(i, {
        left_side_size: opts.leftPorts,
        right_size_size: opts.rightPorts,
        centered_around: { x: 0, y: 0 },
        pitch: 0.5,
        space_between_sides: 1,
      })

      box.ports.push({
        port_id: `${box_id}.${i + 1}`,
        rx: ccwPos.x,
        ry: ccwPos.y,
      })
    }

    this.boxes.push(box)
    return this
  }

  addLRBox(box_id: string, opts: { x: number; y: number }) {
    this.boxes.push({
      box_id,
      x: opts.x,
      y: opts.y,
      ports: [
        {
          port_id: `${box_id}.left`,
          rx: -0.5,
          ry: 0,
        },
        {
          port_id: `${box_id}.right`,
          rx: 0.5,
          ry: 0,
        },
      ],
    })
    return this
  }

  connect(from: string, to: string) {
    this.connections.push({ from, to })
    return this
  }

  build() {
    return {
      boxes: this.boxes,
      connections: this.connections,
    }
  }
}
