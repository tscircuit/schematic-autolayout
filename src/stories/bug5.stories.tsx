import { PlaygroundScene } from "../components/PlaygroundScene"
import { ascendingCentralLrBug1 } from "../lib"
import { scene } from "../lib/scene"

/**
 * This demonstrates a layout but doesn't do any routing algorithm
 */
export const bug5 = () => {
  return (
    <PlaygroundScene
      scene={ascendingCentralLrBug1(
        scene()
          .addCcwBox("U1", { x: 0, y: 0, leftPorts: 3, rightPorts: 3 })
          .addCcwBox("U2", { x: 0, y: 0, leftPorts: 2, rightPorts: 2 })
          .addCcwBox("U3", { x: 0, y: 0, leftPorts: 2, rightPorts: 2 })
          .connect("U1.1", "U2.4")
          .connect("U1.4", "U3.1")
          .build()
      )}
    />
  )
}

export default {}
