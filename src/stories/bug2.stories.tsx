import { PlaygroundScene } from "../components/PlaygroundScene"
import { ascendingCentralLrBug1 } from "../lib/algorithms/ascending-central-lr-bug-1"
import { scene } from "../lib/scene"

export const bug2 = () => {
  return (
    <PlaygroundScene
      scene={ascendingCentralLrBug1(
        scene()
          .addCcwBox("U1G3", { x: 0, y: 0, leftPorts: 7, rightPorts: 0 })
          .addTBox("G1", { x: -1.5, y: -3 })
          .connect("U1G3.7", "G1.top")
          .connect("U1G3.6", "G1.top")
          .addTbBox("C11", { x: -2.5, y: -2 })
          .connect("U1G3.5", "C11.top")
          .connect("G2.top", "C11.bottom")
          .addTbBox("C12", { x: -3, y: -2 })
          .connect("U1G3.4", "C12.top")
          .connect("G2.top", "C12.bottom")
          .addLrBox("BAT", { x: -4, y: -1 })
          .connect("U1G3.3", "BAT.right")
          .connect("V2.bottom", "BAT.left")
          .addTbBox("C6", { x: -5, y: 0 })
          .addTbBox("C5", { x: -6, y: 1 })
          .addTbBox("C4", { x: -7, y: 2 })
          .addTbBox("C3", { x: -8, y: 3 })
          .addTbBox("C2", { x: -9, y: 4 })
          .connect("C2.bottom", "G4.top")
          .connect("C3.bottom", "G4.top")
          .connect("C4.bottom", "G4.top")
          .connect("C5.bottom", "G4.top")
          .connect("U1G3.2", "V1.bottom")
          .connect("U1G3.1", "V1.bottom")
          .connect("C6.top", "U1G3.2")
          .connect("C6.bottom", "G3.top")
          .connect("C5.top", "V4.bottom")
          .connect("C4.top", "V4.bottom")
          .connect("C3.top", "V5.bottom")
          .connect("C2.top", "V5.bottom")
          .build()
      )}
    />
  )
}

export default {}
