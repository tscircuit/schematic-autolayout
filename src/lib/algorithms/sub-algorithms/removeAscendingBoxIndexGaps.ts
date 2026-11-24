export function removeAscendingBoxIndexGaps(
  highest_ascending_box_index: number,
  new_boxes: { ascending_box_index: number }[],
) {
  let highestIndex = highest_ascending_box_index
  for (let i = 0; i < highestIndex; i++) {
    let boxes_with_index = 0
    for (const box of new_boxes) {
      if (box.ascending_box_index === i) {
        boxes_with_index += 1
      }
    }
    if (boxes_with_index === 0) {
      highestIndex -= 1
      for (const box of new_boxes) {
        if (box.ascending_box_index > i) {
          box.ascending_box_index -= 1
        }
      }
      i -= 1
    }
  }
  return highestIndex
}
