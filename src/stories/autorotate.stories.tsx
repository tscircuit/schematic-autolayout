import { AttachableBox } from "../components/AttachableBox"
import { Playground } from "../components/Playground"
import { PlaygroundScene } from "../components/PlaygroundScene"
import { autoRotateTwoPortBoxes } from "../lib/algorithms/auto-rotate-two-port-boxes"
import { scene as sceneBuilder } from "../lib/scene"

export const AutoRotate = () => {
  const scene = sceneBuilder()
    .addLrBox("A", { x: -4, y: 1 })
    .addLrBox("B", { x: -4, y: -1 })
    .connect("A.left", "B.right")
    .addTbBox("C", { x: -2, y: -1 })
    .addLrBox("D", { x: -2, y: 1 })
    .connect("C.top", "D.left")
    .addTbBox("E", { x: 0, y: 1 })
    .addLrBox("F", { x: 0, y: -1 })
    .connect("E.bottom", "F.left")
    .addLrBox("G", { x: 1, y: 0 })
    .addTbBox("H", { x: 3, y: 0 })
    .connect("G.right", "H.top")
    .build()
  return (
    <div>
      <h2>Original Scene</h2>
      <PlaygroundScene height={300} scene={scene} />
      <h2>Auto Rotate Applied</h2>
      <PlaygroundScene
        height={300}
        scene={autoRotateTwoPortBoxes(JSON.parse(JSON.stringify(scene)))}
      />
    </div>
  )
}

export default {}
