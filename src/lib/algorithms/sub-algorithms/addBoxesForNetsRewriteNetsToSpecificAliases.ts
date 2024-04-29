import { Connection } from "../../types"
import { Scene } from "../../scene"
import { BoxWithAscendingIndex } from "../ascending-central-lr-bug-1"

/**
 * This algorithm rewrites nets to placed net aliases, creating net alias
 * symbols (boxes) on the schematic then connecting the traces to them.
 *
 * The algorithm works by going through each "ascending index" on each side,
 * so each row 0, 1, 2, 3 etc. on the left and right sides. It then looks for
 * all the boxes on that row and checks if they have any common nets (where
 * each box shares a net). It will then create a net alias box that represents
 * the shared net, and net alias boxes for any other nets above the element.
 *
 * So sometimes there's a "common net" where we make 1 net alias for e.g. 4 boxes,
 * but sometimes we have to create a net alias for each box because they don't
 * all share the same net.
 */
export function addBoxesForNetsRewriteNetsToPlacedAliases(
  new_boxes: BoxWithAscendingIndex[],
  scene: Scene,
  netSet: Set<string>,
  new_conns: Connection[]
) {
  const highest_ascending_box_index = Math.max(
    ...new_boxes.map((b) => b.ascending_box_index).filter((b) => !isNaN(b))
  )
  for (const side of ["left", "right"] as const) {
    for (let i = 0; i <= highest_ascending_box_index; i++) {
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
            (c) =>
              c.from.startsWith(b.box_id + ".") ||
              c.to.startsWith(b.box_id + ".")
          )
          .map((c) => (c.from.startsWith(b.box_id + ".") ? c.to : c.from))
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
       * [GND]
       */
      const common_net_ids = net_connections.reduce((acc, nets) => {
        return acc.filter((n) => nets.includes(n))
      }, net_connections[0])
      const common_nets = common_net_ids.map(
        (n) => scene.nets.find((net) => net.net_id === n)!
      )

      const minOrMaxFunc = side === "left" ? Math.max : Math.min

      const x = minOrMaxFunc(...boxes_on_same_index.map((b) => b.x))

      for (const common_net of common_nets) {
        const y = i + (common_net?.is_ground ? -1 : 1)
        const box_id = `${common_net?.net_id}_${side === "left" ? "L" : "R"}_${i}`
        const port_id = common_net?.is_ground
          ? `${box_id}.top`
          : `${box_id}.bottom`
        const net_box: BoxWithAscendingIndex = {
          box_id,
          x,
          y,
          side,
          ascending_port_index: 0,
          ascending_box_index: i,
          width: 0,
          ports: [
            {
              port_id,
              rx: 0,
              ry: common_net?.is_ground ? 0.1 : -0.1,
            },
          ],
        }
        new_boxes.push(net_box)

        // Replace the $NET connection with a "$box_id.top" connection
        for (const box of boxes_on_same_index) {
          const box_conns = new_conns.filter(
            (c) =>
              c.from.startsWith(box.box_id + ".") ||
              c.to.startsWith(box.box_id + ".")
          )
          for (const conn of box_conns) {
            if (conn.from === common_net.net_id) {
              conn.from = port_id
            }
            if (conn.to === common_net.net_id) {
              conn.to = port_id
            }
          }
        }
      }

      // Some of the boxes may still not have a box representing their net, so
      // let's add those
      for (let bi = 0; bi < boxes_on_same_index.length; bi++) {
        const box = boxes_on_same_index[bi]
        const hanging_net_connections_for_box = net_connections[bi].filter(
          (c) => !common_net_ids.includes(c)
        )

        // introduce a box and connection directly above the port/box
        for (const hanging_net_id of hanging_net_connections_for_box) {
          const net = scene.nets.find((n) => n.net_id === hanging_net_id)!
          const box_id = `${hanging_net_id}_${box.ascending_box_index}_${side === "left" ? "L" : "R"}_${bi}`
          const port_id = `${box_id}.${net.is_ground ? "top" : "bottom"}`

          const net_box: BoxWithAscendingIndex = {
            x: box.x,
            y: box.y + (net.is_ground ? -1 : 1),
            side,
            ascending_port_index: 0,
            ascending_box_index: box.ascending_box_index,
            box_id,
            ports: [
              {
                port_id,
                rx: 0,
                ry: net.is_ground ? 0.1 : -0.1,
              },
            ],
          }
          new_boxes.push(net_box)

          const conn = new_conns.find(
            (c) =>
              (c.from === hanging_net_id && c.to.startsWith(box.box_id)) ||
              (c.to === hanging_net_id && c.from.startsWith(box.box_id))
          )!
          if (conn.from === hanging_net_id) conn.from = port_id
          if (conn.to === hanging_net_id) conn.to = port_id
        }
      }
    }
  }
  return highest_ascending_box_index
}
