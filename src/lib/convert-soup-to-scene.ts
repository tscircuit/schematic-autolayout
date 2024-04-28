import type {
  AnySoupElement,
  SchematicBox,
  SchematicComponent,
  SchematicPort,
  SchematicTrace,
  SourcePort,
  SourceTrace,
} from "@tscircuit/builder"
import { Scene } from "./scene"
import { Box, Port, Connection, Net } from "./types"

/*
export type Connection = {
  from: string
  to: string
}
export type Port = {
  port_id: string
  // relative x
  rx: number
  // relative y
  ry: number
}
export type Box = {
  box_id: string
  x: number
  y: number
  ports: Array<Port>
}
export type Net = {
  net_id: string
  is_power?: boolean
  is_ground?: boolean
}

*/

/**
 * Convert tscircuit soup to a scene
 */
export const convertSoupToScene = (soup: AnySoupElement[]): Scene => {
  const boxes: Scene["boxes"] = []
  const connections: Scene["connections"] = []
  const nets: Scene["nets"] = []

  const soup_elm_map = {
    schematic_component: soup.filter(
      (e) => e.type === "schematic_component"
    ) as SchematicComponent[],
    schematic_port: soup.filter(
      (e) => e.type === "schematic_port"
    ) as SchematicPort[],
    source_port: (soup as any[]).filter(
      (e) => e.type === "source_port"
    ) as SourcePort[],
    schematic_trace: (soup as any[]).filter(
      (e) => e.type === "schematic_trace"
    ) as SchematicTrace[],
    source_trace: (soup as any[]).filter(
      (e) => e.type === "source_trace"
    ) as SourceTrace[],
  }

  // iterate over soup, convert schematic_box to a scene box
  for (const schematic_component of soup_elm_map.schematic_component) {
    const ports: Port[] = []
    const box_id = schematic_component.schematic_component_id

    // go through each port attached to the schematic box
    for (const sch_port of soup_elm_map.schematic_port) {
      if (
        sch_port.schematic_component_id ===
        schematic_component.schematic_component_id
      ) {
        ports.push({
          port_id: `${box_id}.${sch_port.schematic_port_id}`,
          rx: sch_port.center.x - schematic_component.center.x,
          ry: sch_port.center.y - schematic_component.center.y,
        })
      }
    }

    const box: Box = {
      box_id,
      x: schematic_component.center.x,
      y: schematic_component.center.y,
      ports,
    }
    boxes.push(box)
  }

  for (const source_trace of soup_elm_map.source_trace) {
    const [sp_A, sp_B] = source_trace.connected_source_port_ids

    const schp_A = soup_elm_map.schematic_port.find(
      (sch_port) => sch_port.source_port_id === sp_A
    )
    const schp_B = soup_elm_map.schematic_port.find(
      (sch_port) => sch_port.source_port_id === sp_B
    )

    if (!schp_A || !schp_B) {
      continue
    }

    const schcomp_A = soup_elm_map.schematic_component.find(
      (sch_comp) =>
        sch_comp.schematic_component_id === schp_A.schematic_component_id
    )
    const schcomp_B = soup_elm_map.schematic_component.find(
      (sch_comp) =>
        sch_comp.schematic_component_id === schp_B.schematic_component_id
    )

    if (!schcomp_A || !schcomp_B) {
      continue
    }

    const connection: Connection = {
      from: `${schcomp_A.schematic_component_id}.${schp_A.schematic_port_id}`,
      to: `${schcomp_B.schematic_component_id}.${schp_B.schematic_port_id}`,
    }

    connections.push(connection)
  }

  return {
    boxes,
    connections,
    nets,
  }
}
