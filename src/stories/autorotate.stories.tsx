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
    .addLrBox("I", { x: 7, y: 0 })
    .addLrBox("J", { x: 5, y: 1 })
    .connect("I.right", "J.left")
    .connect("J.right", "H.bottom")
    .addLrBox("K", { x: 5, y: -1 })
    .connect("K.right", "G.left")
    .addTbBox("L", { x: 10, y: 0 })
    .addTbBox("M", { x: 10, y: 1 })
    .addTbBox("N", { x: 10, y: -1 })
    .addLrBox("O", { x: 12, y: -0.2 })
    .addLrBox("P", { x: 12, y: 0 })
    .addLrBox("Q", { x: 12, y: 0.2 })
    .addLrBox("R", { x: 12, y: -0.4 })
    .connect("L.top", "M.bottom")
    .connect("L.bottom", "N.top")
    .connect("L.top", "O.left")
    .connect("L.top", "P.left")
    .connect("L.top", "Q.left")
    .connect("L.top", "R.left")
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
