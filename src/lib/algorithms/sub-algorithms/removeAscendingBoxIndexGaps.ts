import { BoxWithAscendingIndex } from "../ascending-central-lr-bug-1"

export function removeAscendingBoxIndexGaps(
  highest_ascending_box_index: number,
  new_boxes: BoxWithAscendingIndex[]
) {
  for (let i = 0; i < highest_ascending_box_index; i++) {
    let boxes_with_index = 0
    for (const box of new_boxes) {
      if (box.ascending_box_index === i) {
        boxes_with_index += 1
      }
    }
    if (boxes_with_index === 0) {
      highest_ascending_box_index -= 1
      for (const box of new_boxes) {
        if (box.ascending_box_index > i) {
          box.ascending_box_index -= 1
        }
      }
    }
  }
  return highest_ascending_box_index
}
