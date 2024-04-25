import { Box } from "../../types"

export const findBoxWithMostPorts = (boxes: Array<Box>) => {
  let max = boxes[0]
  for (const box of boxes) {
    if (box.ports.length > max.ports.length) {
      max = box
    }
  }
  return max
}
