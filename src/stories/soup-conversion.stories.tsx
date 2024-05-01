import { AttachableBox } from "../components/AttachableBox"
import { Playground } from "../components/Playground"
import { PlaygroundScene } from "../components/PlaygroundScene"
import { scene } from "../lib/scene"
import { Schematic } from "@tscircuit/schematic-viewer"
import { soup1 } from "./soup-conversion/soup1"
import { convertSoupToScene } from "../lib/convert-soup-to-scene"
import { ascendingCentralLrBug1 } from "../lib/algorithms/ascending-central-lr-bug-1"
import { convertSceneToSoup } from "../lib/convert-scene-to-soup"

export const SoupConversion = () => {
  return (
    <div>
      <h2>Soup Before</h2>
      <Schematic style={{ height: 400 }} soup={soup1} />
      <h2>Converted to Autolayout Scene</h2>
      <PlaygroundScene height={400} scene={convertSoupToScene(soup1 as any)} />
      <h2>Autolayout</h2>
      <PlaygroundScene
        height={400}
        scene={ascendingCentralLrBug1(convertSoupToScene(soup1 as any))}
      />
      <h2>Soup After</h2>
      <Schematic
        style={{ height: 400 }}
        soup={convertSceneToSoup(
          soup1 as any,
          ascendingCentralLrBug1(convertSoupToScene(soup1 as any))
        )}
      />
    </div>
  )
}

export default {}
