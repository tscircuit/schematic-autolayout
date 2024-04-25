import { Scene } from "../../scene"
import { BoxWithAscendingIndex } from "../ascending-central-lr-bug-1"

/**
 * Slide boxes connected to the same net, bringing them into alignment.
 */
export function slideBoxesConnectedToSameNet(
  new_boxes: BoxWithAscendingIndex[],
  connMap: Record<string, string>,
  netSet: Set<string>,
  scene: Scene
) {
  for (const side of ["left", "right"]) {
    const sorted_side_boxes = new_boxes
      .filter((b) => b.side === side)
      .sort((a, b) => a.ascending_box_index - b.ascending_box_index)

    for (let i = 0; i < sorted_side_boxes.length - 1; i++) {
      const [A, B] = [sorted_side_boxes[i], sorted_side_boxes[i + 1]]
      if (A.ports.length === 2 && B.ports.length === 2) {
        const [A1, A2] = A.ports
        const [B1, B2] = B.ports
        const [A1_conn, A2_conn] = [A1, A2].map((p) => connMap[p.port_id])
        const [B1_conn, B2_conn] = [B1, B2].map((p) => connMap[p.port_id])

        // Find if A & B are connected to the same NET on one side
        let shared_net_id: string | null = null
        if (
          (A1_conn === B1_conn || A1_conn === B2_conn) &&
          netSet.has(A1_conn)
        ) {
          shared_net_id = A1_conn
        } else if (
          (A2_conn === B1_conn || A2_conn === B2_conn) &&
          netSet.has(A2_conn)
        ) {
          shared_net_id = A2_conn
        }

        if (!shared_net_id) continue
        const shared_net = scene.nets.find((n) => n.net_id === shared_net_id)!

        if (!shared_net.is_ground && !shared_net.is_power) continue

        if (shared_net.is_ground) {
          // all greater than i move down by 1
          sorted_side_boxes.slice(i + 1).forEach((b) => {
            b.ascending_box_index -= 1
            b.y -= 1
          })
        }

        if (shared_net.is_power) {
          // all greater than i down by 1
          sorted_side_boxes.slice(i + 1).forEach((b) => {
            b.ascending_box_index -= 1
            b.y -= 1
          })
        }

        // Shared net
        // TODO rotate component if the shared side isn't in the same direction
        // Is the shared net
      }
    }
  }
}
