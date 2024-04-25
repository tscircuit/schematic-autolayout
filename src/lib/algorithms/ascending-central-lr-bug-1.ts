import { Box, Port } from "../types"
import { LayoutAlgorithm } from "./type"

const findBoxWithMostPorts = (boxes: Array<Box>) => {
  let max = boxes[0]
  for (const box of boxes) {
    if (box.ports.length > max.ports.length) {
      max = box
    }
  }
  return max
}

export const ascendingCentralLrBug1: LayoutAlgorithm = (scene) => {
  // TODO remove reset in prod
  const new_boxes: Array<
    Box & {
      side: "left"
      /**
       * How high from the bottom w.r.t. port connections
       */
      ascending_port_index: number
      /**
       * How high from the bottom this box should be ordered
       */
      ascending_box_index: number
    }
  > = JSON.parse(JSON.stringify(scene.boxes))

  for (const box of new_boxes) {
    box.x = 0
    box.y = 0

    box.side = "left" // TODO
  }

  // 1. Identify central box
  const center_box: Omit<Box, "ports"> & {
    ports: Array<Port & { side: "left"; ascending_port_index: number }>
  } = findBoxWithMostPorts(new_boxes) as any

  // 2. Get the ascending indices of the boxes
  // for (const box of new_boxes) {
  //   // TODO only use ports on same side as box
  //   const relevant_side_ports = box.ports
  // }

  for (const side of ["left", "right"]) {
    if (side === "right") continue // TODO
    const side_ports = center_box.ports // TODO
    side_ports.sort((a, b) => a.ry - b.ry)
    for (const port of side_ports) {
      port.ascending_port_index = side_ports.indexOf(port)
    }
  }

  for (const box of new_boxes) {
    if (box.box_id === center_box.box_id) continue
    const box_connections = scene.connections
      .filter(
        (connection) =>
          connection.from.startsWith(box.box_id + ".") ||
          connection.to.startsWith(box.box_id + ".")
      )
      .map((connection) =>
        connection.from.startsWith(box.box_id + ".")
          ? connection.to
          : connection.from
      )
    const ports_box_is_connected_to = center_box.ports.filter((p) =>
      box_connections.includes(p.port_id)
    )

    if (ports_box_is_connected_to.length === 0) {
      continue
    }

    box.ascending_port_index = Math.min(
      ...ports_box_is_connected_to.map((p: any) => p.ascending_port_index)
    )
    box.ascending_box_index = box.ascending_port_index
  }

  let highest_ascending_box_index = Math.max(
    ...new_boxes.map((b) => b.ascending_box_index).filter((bi) => !isNaN(bi))
  )
  for (const box of new_boxes) {
    if (box.box_id === center_box.box_id) continue
    if (box.ascending_box_index === undefined) {
      highest_ascending_box_index += 1
      box.ascending_box_index = highest_ascending_box_index
    }
  }

  for (const box of new_boxes) {
    if (box.box_id === center_box.box_id) continue
    box.y = -3 + box.ascending_box_index
    box.x = -1.5 - box.ascending_box_index
  }

  return {
    ...scene,
    boxes: new_boxes,
  }
}
