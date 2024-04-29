import { AttachableBox } from "../components/AttachableBox"
import { Playground } from "../components/Playground"
import { PlaygroundScene } from "../components/PlaygroundScene"
import { scene } from "../lib/scene"

export const AutoRotate = () => {
  return (
    <PlaygroundScene
      scene={scene()
        // TODO add a box that should autorotate and run algo
        .addCcwBox("A", { x: 2, y: 0, leftPorts: 2, rightPorts: 2 })
        .addLrBox("B", { x: -2, y: 0 })
        .connect("A.1", "B.right")
        .build()}
    />
  )
}

export default {}
