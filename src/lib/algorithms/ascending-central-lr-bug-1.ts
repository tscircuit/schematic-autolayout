import { Box, Port } from "../types"
import { getConnectionMap } from "./sub-algorithms/getConnectionMap"
import { centerSides } from "./sub-algorithms/centerSides"
import { findBoxWithMostPorts } from "./sub-algorithms/findBoxWithMostPorts"
import { slideBoxesConnectedToSameNet } from "./sub-algorithms/slideBoxesConnectedToSameNet"
import { LayoutAlgorithm } from "./type"
import { removeAscendingBoxIndexGaps } from "./sub-algorithms/removeAscendingBoxIndexGaps"

export type BoxWithAscendingIndex = Box & {
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

export const ascendingCentralLrBug1: LayoutAlgorithm = (scene) => {
  const netSet = new Set(scene.nets.map((n) => n.net_id))
  // Map port_id to whatever port it connects to
  const connMap = getConnectionMap(scene)

  const new_boxes: BoxWithAscendingIndex[] = JSON.parse(
    JSON.stringify(scene.boxes)
  )

  // TODO remove reset in prod
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

  // Remove box_index "gaps", e.g. if no boxes have index 1, then every index >1
  // should be decremented by 1
  // TODO: this is an N^2 algorithm, easily can be made N
  highest_ascending_box_index = removeAscendingBoxIndexGaps(
    highest_ascending_box_index,
    new_boxes
  )

  for (const box of new_boxes) {
    if (box.box_id === center_box.box_id) continue
    box.y = box.ascending_box_index
    box.x = -1.5 - box.ascending_box_index
  }

  slideBoxesConnectedToSameNet(new_boxes, connMap, netSet, scene)

  centerSides(new_boxes, center_box)

  // Add boxes representing the net, anything with the same ascending_box_index
  // can share the same net box
  highest_ascending_box_index = Math.max(
    ...new_boxes.map((b) => b.ascending_box_index).filter((b) => !isNaN(b))
  )
  for (const side of ["left", "right"]) {
    for (let i = 0; i < highest_ascending_box_index; i++) {
      const boxes_on_same_index = new_boxes
        .filter((b) => b.side === side)
        .filter((b) => b.ascending_box_index === i)
      // if (boxes_on_same_index.length === 0) continue
      // const x = -1.5 - i
      // const y = i
      // const box_id = `net_${i}`
      // const net_box: BoxWithAscendingIndex = {
      //   box_id,
      //   x,
      //   y,
      //   side: "left",
      //   ascending_port_index: 0,
      //   ascending_box_index: i,
      //   ports: [],
      // }
      // new_boxes.push(net_box)
    }
  }

  const new_scene = {
    ...scene,
    boxes: new_boxes,
  }

  return new_scene
  // return alignTbBoxesWithNetConnection(new_scene)
}
