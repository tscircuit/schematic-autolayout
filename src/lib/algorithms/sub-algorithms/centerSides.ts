import { BoxWithAscendingIndex } from "../ascending-central-lr-bug-1"

/**
 * Looks at the ascending indexes on each side, then centers the boxes
 */
export function centerSides(
  new_boxes: BoxWithAscendingIndex[],
  center_box: { box_id: string }
) {
  for (const side of ["left", "right"]) {
    const side_boxes = new_boxes.filter((b) => b.side === side)
    const side_boxes_ascending_indices = side_boxes
      .map((b) => b.ascending_box_index)
      .filter((b) => !isNaN(b))
    const max_ascending_index = Math.max(...side_boxes_ascending_indices)

    for (const box of side_boxes) {
      if (box.box_id === center_box.box_id) continue
      box.y -= (max_ascending_index / 2) * 1.25
    }
  }
}
