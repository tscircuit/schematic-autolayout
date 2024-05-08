import { Scene } from "../scene"
import { Box, Port } from "../types"
import { applyToPoint, rotate } from "transformation-matrix"

type ExtendedPort = Port & {
  x: number
  y: number
  connected_port: { x: number; y: number }
  connected_ports: Array<{ x: number; y: number }>
}

type ExtendedBox = Box & {
  applied_rotation_deg: 0 | 90 | 180 | 270
  natural_offset_sum_deg: number
  ports: ExtendedPort[]
}

const rotateBox = (box: Box, angle: 0 | 90 | 180 | 270) => {
  const mat = rotate(angle * (Math.PI / 180))
  box.ports.forEach((port) => {
    const np = applyToPoint(mat, { x: port.rx, y: port.ry })
    port.rx = np.x
    port.ry = np.y
  })
}

const normalizeVec = (vec: { x: number; y: number }) => {
  const mag = Math.sqrt(vec.x ** 2 + vec.y ** 2)
  return { x: vec.x / mag, y: vec.y / mag }
}

const getAllPossibleBoxRotations = (box: Box) => {
  const rotations = [0, 90, 180, 270] as const
  return rotations.map((rotation) => {
    const newBox = { ...box, ports: box.ports.map((p) => ({ ...p })) }
    rotateBox(newBox, rotation)
    // @ts-expect-error
    newBox.applied_rotation_deg = rotation
    return newBox
  })
}

// Examine the direction that each box's port is being pulled in
export const autoRotateTwoPortBoxes = (scene: Scene) => {
  // sort boxes by y position ascending- start from the bottom and work up
  const boxes = scene.boxes.sort((a, b) => a.y - b.y)

  for (const box of boxes) {
    if (box.ports.length === 2) {
      // Each port has it's position relative to the box, and the port it
      // connects to.
      const ports: ExtendedPort[] = box.ports
        .map((port) => {
          const connected_port_ids = scene.connections
            .filter((c) => c.from === port.port_id || c.to === port.port_id)
            .map((c) => (c.from === port.port_id ? c.to : c.from))

          if (connected_port_ids.length === 0) return null
          const connected_port_boxes = boxes.filter((b) =>
            connected_port_ids.some((id) => id.startsWith(b.box_id + "."))
          )!
          const connected_ports = connected_port_boxes
            .flatMap((cpb) => cpb.ports)
            ?.filter((p) => connected_port_ids.includes(p.port_id)) as Array<
            Port & { x: number; y: number }
          >

          for (const connected_port of connected_ports) {
            const connected_port_box = connected_port_boxes.find(
              (b) => b.box_id === connected_port.port_id.split(".")[0]
            )!
            connected_port.x = connected_port_box.x + connected_port.rx
            connected_port.y = connected_port_box.y + connected_port.ry
          }

          return {
            ...port,
            connected_port: connected_ports[0],
            connected_ports,
          } as any
        })
        .filter(Boolean)

      // No ports with connections
      if (ports.length === 0) {
        continue
      }

      // get the pull vector of each port for each rotation
      const possible_box_rotations: ExtendedBox[] = getAllPossibleBoxRotations({
        ...box,
        ports,
      }) as any

      for (const box of possible_box_rotations) {
        box.natural_offset_sum_deg = 0
        for (const port of box.ports) {
          for (const connected_port of port.connected_ports) {
            const pull_vector = normalizeVec({
              x: connected_port.x - (box.x + port.rx),
              y: connected_port.y - (box.y + port.ry),
            })
            const natural_vector = normalizeVec({
              x: port.rx,
              y: port.ry,
            })
            const dist = Math.sqrt(
              (pull_vector.x - natural_vector.x) ** 2 +
                (pull_vector.y - natural_vector.y) ** 2
            )
            // calculate the angle between the pull vector and the natural vector
            const dot =
              pull_vector.x * natural_vector.x +
              pull_vector.y * natural_vector.y
            const det =
              pull_vector.x * natural_vector.y -
              pull_vector.y * natural_vector.x
            const angle = Math.atan2(det, dot) * (180 / Math.PI)
            box.natural_offset_sum_deg += Math.abs(angle) / dist
          }
        }
      }

      // find the rotation with the smallest sum of angles
      const best_rotation = possible_box_rotations.reduce((a, b) =>
        a.natural_offset_sum_deg < b.natural_offset_sum_deg ? a : b
      )

      rotateBox(box, best_rotation.applied_rotation_deg)
    }
  }

  return scene
}
