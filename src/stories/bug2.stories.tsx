import { PlaygroundScene } from "../components/PlaygroundScene"
import { ascendingCentralLrBug1 } from "../lib/algorithms/ascending-central-lr-bug-1"
import { scene } from "../lib/scene"

export const bug2 = () => {
  return (
    <PlaygroundScene
      scene={ascendingCentralLrBug1(
        scene()
          .addNet("V1", { is_power: true })
          .addNet("GND", { is_ground: true })
          .addCcwBox("U1G3", { x: 0, y: 0, leftPorts: 7, rightPorts: 0 })
          .addTBox("G1", { x: -1.5, y: -3 })
          .connect("U1G3.7", "G1.top")
          .connect("U1G3.6", "G1.top")
          .addTbBox("C11", { x: -2.5, y: -2 })
          .connect("U1G3.5", "C11.top")
          .connect("C11.bottom", "GND")
          .addTbBox("C12", { x: -3, y: -2 })
          .connect("U1G3.4", "C12.top")
          .connect("C12.bottom", "GND")
          .addLrBox("BAT", { x: -4, y: -1 })
          .connect("U1G3.3", "BAT.right")
          .connect("V1", "BAT.left")
          .addTbBox("C6", { x: -5, y: 0 })
          .addTbBox("C5", { x: -6, y: 1 })
          .addTbBox("C4", { x: -7, y: 2 })
          .addTbBox("C3", { x: -8, y: 3 })
          .addTbBox("C2", { x: -9, y: 4 })
          .connect("C2.bottom", "GND")
          .connect("C3.bottom", "GND")
          .connect("C4.bottom", "GND")
          .connect("C5.bottom", "GND")
          .connect("U1G3.2", "V1")
          .connect("U1G3.1", "V1")
          .connect("C6.top", "U1G3.2")
          .connect("C6.bottom", "GND")
          .connect("C5.top", "V1")
          .connect("C4.top", "V1")
          .connect("C3.top", "V1")
          .connect("C2.top", "V1")
          .build()
      )}
    />
  )
}

export default {}
