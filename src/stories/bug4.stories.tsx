import { PlaygroundScene } from "../components/PlaygroundScene"
import { ascendingCentralLrBug1 } from "../lib/algorithms/ascending-central-lr-bug-1"
import { scene } from "../lib/scene"

export const bug4 = () => {
  const scene = {
    boxes: [
      {
        box_id: "schematic_component_simple_bug_0",
        x: 0,
        y: 0,
        ports: [
          {
            port_id: "schematic_component_simple_bug_0.schematic_port_0",
            rx: -0.75,
            ry: 0.75,
          },
          {
            port_id: "schematic_component_simple_bug_0.schematic_port_1",
            rx: -0.75,
            ry: 0.25,
          },
          {
            port_id: "schematic_component_simple_bug_0.schematic_port_2",
            rx: -0.75,
            ry: -0.25,
          },
          {
            port_id: "schematic_component_simple_bug_0.schematic_port_3",
            rx: -0.75,
            ry: -0.75,
          },
          {
            port_id: "schematic_component_simple_bug_0.schematic_port_4",
            rx: 0.75,
            ry: -0.75,
          },
          {
            port_id: "schematic_component_simple_bug_0.schematic_port_5",
            rx: 0.75,
            ry: -0.25,
          },
          {
            port_id: "schematic_component_simple_bug_0.schematic_port_6",
            rx: 0.75,
            ry: 0.25,
          },
          {
            port_id: "schematic_component_simple_bug_0.schematic_port_7",
            rx: 0.75,
            ry: 0.75,
          },
        ],
      },
      {
        box_id: "schematic_simple_diode_component_0",
        x: 0,
        y: 0,
        ports: [
          {
            port_id: "schematic_simple_diode_component_0.schematic_port_8",
            rx: -0.5,
            ry: 0,
          },
          {
            port_id: "schematic_simple_diode_component_0.schematic_port_9",
            rx: 0.5,
            ry: 0,
          },
        ],
      },
      {
        box_id: "schematic_component_simple_resistor_0",
        x: 0,
        y: 0,
        ports: [
          {
            port_id: "schematic_component_simple_resistor_0.schematic_port_10",
            rx: -0.5,
            ry: 0,
          },
          {
            port_id: "schematic_component_simple_resistor_0.schematic_port_11",
            rx: 0.5,
            ry: 0,
          },
        ],
      },
      {
        box_id: "schematic_component_simple_resistor_1",
        x: 0,
        y: 0,
        ports: [
          {
            port_id: "schematic_component_simple_resistor_1.schematic_port_12",
            rx: -0.5,
            ry: 0,
          },
          {
            port_id: "schematic_component_simple_resistor_1.schematic_port_13",
            rx: 0.5,
            ry: 0,
          },
        ],
      },
      {
        box_id: "schematic_component_simple_resistor_2",
        x: 0,
        y: 0,
        ports: [
          {
            port_id: "schematic_component_simple_resistor_2.schematic_port_14",
            rx: -0.5,
            ry: 0,
          },
          {
            port_id: "schematic_component_simple_resistor_2.schematic_port_15",
            rx: 0.5,
            ry: 0,
          },
        ],
      },
      {
        box_id: "schematic_component_simple_capacitor_0",
        x: 0,
        y: 0,
        ports: [
          {
            port_id: "schematic_component_simple_capacitor_0.schematic_port_16",
            rx: -0.5,
            ry: 0,
          },
          {
            port_id: "schematic_component_simple_capacitor_0.schematic_port_17",
            rx: 0.5,
            ry: 0,
          },
        ],
      },
    ],
    connections: [],
    nets: [],
  }

  return (
    <div>
      <h2>After autolayout</h2>
      <PlaygroundScene scene={ascendingCentralLrBug1(scene)} />
      <h2>Before autolayout</h2>
      <PlaygroundScene scene={scene} />
    </div>
  )
}

export default {}
