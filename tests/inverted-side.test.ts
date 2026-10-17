import { expect, test } from "bun:test"
import { ascendingCentralLrBug1, scene } from "../src/lib"

test("reproduces and resolves inverted side layout for series R1 -> R2 -> R3", () => {
  const inputScene = scene()
    .addLrBox("R1", { x: 0, y: 0 })
    .addLrBox("R2", { x: 0, y: 0 })
    .addLrBox("R3", { x: 0, y: 0 })
    .connect("R1.right", "R2.left")
    .connect("R2.right", "R3.left")
    .build()

  const laidOut = ascendingCentralLrBug1(inputScene)
  const r1 = laidOut.boxes.find((b) => b.box_id === "R1")!
  const r2 = laidOut.boxes.find((b) => b.box_id === "R2")!
  const r3 = laidOut.boxes.find((b) => b.box_id === "R3")!

  expect(r1.x).toBeLessThan(r2.x)
  expect(r2.x).toBeLessThan(r3.x)

  const r1Right = r1.ports.find((p) => p.port_id === "R1.right")!
  const r3Left = r3.ports.find((p) => p.port_id === "R3.left")!
  expect(r1Right.rx).toBeGreaterThan(0)
  expect(r3Left.rx).toBeLessThan(0)
})

test("places transitively connected right-side boxes on the right side", () => {
  const inputScene = scene()
    .addCcwBox("U1", { x: 0, y: 0, leftPorts: 2, rightPorts: 2 })
    .addLrBox("R1", { x: 0, y: 0 })
    .addLrBox("R2", { x: 0, y: 0 })
    .connect("U1.3", "R1.left")
    .connect("R1.right", "R2.left")
    .build()

  const laidOut = ascendingCentralLrBug1(inputScene)
  const u1 = laidOut.boxes.find((b) => b.box_id === "U1")!
  const r1 = laidOut.boxes.find((b) => b.box_id === "R1")!
  const r2 = laidOut.boxes.find((b) => b.box_id === "R2")!

  expect(r1.x).toBeGreaterThan(u1.x)
  expect(r2.x).toBeGreaterThan(r1.x)
})
