import { AttachableBox } from "../components/AttachableBox"
import { Playground } from "../components/Playground"
import { PlaygroundScene } from "../components/PlaygroundScene"
import { scene } from "../lib/scene"
import { Schematic } from "@tscircuit/schematic-viewer"
import { soup1 } from "./soup-conversion/soup1"
import { convertSoupToScene } from "../lib/convert-soup-to-scene"

export const SoupConversion = () => {
  return (
    <div>
      <h2>Soup Before</h2>
      <Schematic style={{ height: 400 }} soup={soup1} />
      <h2>Converted to Autolayout Scene</h2>
      <PlaygroundScene height={400} scene={convertSoupToScene(soup1 as any)} />
    </div>
  )
}

export default {}
