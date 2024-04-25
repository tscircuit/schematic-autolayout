import { AttachableBox } from "../components/AttachableBox"
import { Playground } from "../components/Playground"
import { PlaygroundScene } from "../components/PlaygroundScene"
import { scene } from "../lib/scene"

export const Basic = () => {
  return (
    <PlaygroundScene
      scene={scene()
        .addCcwBox("A", { x: -2, y: 0, leftPorts: 2, rightPorts: 2 })
        .addLRBox("B", { x: 2, y: 0 })
        .connect("A.1", "B.left")
        .build()}
    />
  )
}

export default {}
