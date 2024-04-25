import { Scene } from "../lib/scene"
import { AttachableBox } from "./AttachableBox"
import { BoxConnection } from "./BoxConnection"
import { LinesCanvas } from "./LinesCanvas"
import { Playground } from "./Playground"

export const PlaygroundScene = ({ scene }: { scene: Scene }) => {
  return (
    <Playground>
      {scene.boxes.map((b) => {
        const minX = b.ports.reduce((acc, p) => Math.min(acc, p.rx), 0)
        const maxX = b.ports.reduce((acc, p) => Math.max(acc, p.rx), 0)
        const minY = b.ports.reduce((acc, p) => Math.min(acc, p.ry), 0)
        const maxY = b.ports.reduce((acc, p) => Math.max(acc, p.ry), 0)
        return (
          <AttachableBox
            key={b.box_id}
            box_id={b.box_id}
            center={{
              x: b.x,
              y: b.y,
            }}
            width={Math.max(Math.abs(maxX), Math.abs(minX), 0.1) * 2}
            height={Math.max(Math.abs(maxY), Math.abs(minY), 0.1) * 2}
            rotation={"0deg"}
            ports={b.ports.map((p) => ({
              port_id: p.port_id,
              side: p.rx < 0 ? "left" : "right",
              relative_position: { x: p.rx, y: p.ry },
            }))}
          />
        )
      })}
      <LinesCanvas scene={scene} />
    </Playground>
  )
}
