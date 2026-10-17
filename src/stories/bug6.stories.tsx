import { PlaygroundScene } from "../components/PlaygroundScene"
import { ascendingCentralLrBug1 } from "../lib"
import { scene } from "../lib/scene"

/**
 * Reproduction of issue #2: 3 series resistors (R1 -> R2 -> R3) laying out on inverted sides
 */
export const bug6InvertedSide = () => {
  return (
    <PlaygroundScene
      scene={ascendingCentralLrBug1(
        scene()
          .addLrBox("R1", { x: 0, y: 0 })
          .addLrBox("R2", { x: 0, y: 0 })
          .addLrBox("R3", { x: 0, y: 0 })
          .connect("R1.right", "R2.left")
          .connect("R2.right", "R3.left")
          .build()
      )}
    />
  )
}

export default {}
