import { expect, test } from "bun:test"
import { removeAscendingBoxIndexGaps } from "../src/lib/algorithms/sub-algorithms/removeAscendingBoxIndexGaps"

const makeBoxes = (indices: number[]) =>
  indices.map((ascending_box_index, index) => ({
    box_id: `box-${index}`,
    x: 0,
    y: 0,
    ports: [],
    side: "left",
    ascending_port_index: ascending_box_index,
    ascending_box_index,
    width: 1,
  }))

test.each([
  [
    [0, 3],
    [0, 1],
  ],
  [
    [0, 4, 7],
    [0, 1, 2],
  ],
  [
    [3, 3, 6],
    [0, 0, 1],
  ],
  [
    [5, 0, 5, 2],
    [2, 0, 2, 1],
  ],
  [
    [0, 1, 1, 2],
    [0, 1, 1, 2],
  ],
  [[4], [0]],
  [[], []],
])("compacts indices %j to %j", (indices, expected) => {
  const boxes = makeBoxes(indices)
  const highestIndex = removeAscendingBoxIndexGaps(
    Math.max(0, ...indices),
    boxes,
  )

  expect(boxes.map((box) => box.ascending_box_index)).toEqual(expected)
  expect(highestIndex).toBe(Math.max(0, ...expected))
})

test("also removes unused indices below the supplied upper bound", () => {
  const boxes = makeBoxes([0, 3])

  expect(removeAscendingBoxIndexGaps(7, boxes)).toBeLessThan(7)
  expect(boxes.map((box) => box.ascending_box_index)).toEqual([0, 1])
})
