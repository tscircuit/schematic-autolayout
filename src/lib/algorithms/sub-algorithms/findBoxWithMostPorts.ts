import { Box, Connection } from "../../types"

export const findBoxWithMostPorts = (
  boxes: Array<Box>,
  connections: Array<Connection> = []
) => {
  const getConnectionCount = (boxId: string) =>
    connections.filter(
      (c) =>
        c.from === boxId ||
        c.to === boxId ||
        c.from.startsWith(boxId + ".") ||
        c.to.startsWith(boxId + ".")
    ).length

  let max = boxes[0]
  for (const box of boxes) {
    if (box.ports.length > max.ports.length) {
      max = box
    } else if (
      box.ports.length === max.ports.length &&
      connections.length > 0 &&
      getConnectionCount(box.box_id) > getConnectionCount(max.box_id)
    ) {
      max = box
    }
  }
  return max
}

