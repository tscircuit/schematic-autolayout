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
      if (boxes_on_same_index.length === 0) continue

      /**
       * Connections on each box e.g.
       * [
       *  [A.1, GND, A.2, PWR],
       *  [B.1, GND, B.2, U1.4],
       * ]
       */
      const connections_on_index: string[][] = boxes_on_same_index.map((b) =>
        scene.connections
          .filter(
            (c) => c.from.startsWith(b.box_id) || c.to.startsWith(b.box_id)
          )
          .map((c) => (c.from.startsWith(b.box_id) ? c.to : c.from))
      )

      /**
       * Net connections for each box (or maybe just is_power or is_ground)
       * [
       *   [GND, PWR],
       *   [GND],
       * ]
       */
      const net_connections = connections_on_index.map((clist) =>
        clist.filter((c) => netSet.has(c))
      )

      /**
       * Common nets between all boxes on this ascending index
       * [{GND}]
       */
      const common_nets = net_connections
        .reduce((acc, nets) => {
          return acc.filter((n) => nets.includes(n))
        }, net_connections[0])
        .map((n) => scene.nets.find((net) => net.net_id === n))

      const minOrMaxFunc = side === "left" ? Math.max : Math.min

      const x = minOrMaxFunc(...boxes_on_same_index.map((b) => b.x))

      for (const common_net of common_nets) {
        // const y = i + (common_net?.is_ground ? -1 : 1)
        const y = i - 1
        const box_id = `net_${i}`
        const net_box: BoxWithAscendingIndex = {
          box_id,
          x,
          y,
          side: "left",
          ascending_port_index: 0,
          ascending_box_index: i,
          ports: [
            {
              port_id: `net_${i}.top`,
              rx: 0,
              ry: 0.1,
            },
          ],
        }
        new_boxes.push(net_box)
      }
    }
  }

  centerSides(new_boxes, center_box)

  const new_scene = {
    ...scene,
    boxes: new_boxes,
  }

  return new_scene
  // return alignTbBoxesWithNetConnection(new_scene)
}
