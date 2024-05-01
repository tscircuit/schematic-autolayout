import { AttachableBox } from "../components/AttachableBox"
import { Playground } from "../components/Playground"
import { PlaygroundScene } from "../components/PlaygroundScene"
import { autoRotateTwoPortBoxes } from "../lib/algorithms/auto-rotate-two-port-boxes"
import { scene as sceneBuilder } from "../lib/scene"

export const AutoRotateManyLines = () => {
  const scene = sceneBuilder()
    .addTbBox("L", { x: 10, y: 0 })
    .addTbBox("M", { x: 10, y: 1 })
    .addTbBox("N", { x: 10, y: -1 })
    .addLrBox("O", { x: 12, y: -0.2 })
    .addLrBox("P", { x: 12, y: 0 })
    .addLrBox("Q", { x: 12, y: 0.2 })
    .connect("L.top", "M.bottom")
    .connect("L.bottom", "N.top")
    .connect("L.top", "O.left")
    .connect("L.top", "P.left")
    .connect("L.top", "Q.left")
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
