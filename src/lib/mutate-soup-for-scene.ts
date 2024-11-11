import { AnyCircuitElement, SchematicComponent } from "circuit-json"
import { Scene } from "./scene"
import { transformSchematicElement } from "@tscircuit/soup-util"
import { translate } from "transformation-matrix"

export const convertSceneToSoup = (
  og_soup: AnyCircuitElement[],
  scene: Scene
): AnyCircuitElement[] => {
  return mutateSoupForScene(JSON.parse(JSON.stringify(og_soup)), scene)
}

export const mutateSoupForScene = (
  og_soup: AnyCircuitElement[],
  scene: Scene
): AnyCircuitElement[] => {
  const soup: AnyCircuitElement[] = og_soup

  // Modify the soup to reflect the modifications made in the scene
  for (const box of scene.boxes) {
    // each box reflects a schematic_component
    const schematic_component: SchematicComponent = soup.find(
      (e) =>
        e.type === "schematic_component" &&
        e.schematic_component_id === box.box_id
    ) as any

    // Update the position of the box
    // TODO handle box rotations
    const mat = translate(
      box.x - schematic_component.center.x,
      box.y - schematic_component.center.y
    )
    for (const elm of soup) {
      if ((elm as any).schematic_component_id === box.box_id) {
        transformSchematicElement(elm as any, mat)
      }
    }

    // TODO handle adding netaliases
  }

  return soup
}
