import { applyToPoint, compose, translate } from "transformation-matrix"
import { usePlaygroundContext } from "./PlaygroundContext"

interface Props {
  box_id?: string
  center: { x: number; y: number }
  width: number
  height: number
  rotation: "0deg" | "90deg" | "180deg" | "270deg"
  ports: Array<{
    port_id: string
    side: "top" | "right" | "bottom" | "left"
    relative_position: { x: number; y: number }
  }>
}

const addp = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  }
}

export const AttachableBox = ({
  box_id,
  center,
  width,
  height,
  rotation,
  ports,
}: Props) => {
  const { transform } = usePlaygroundContext()

  const screen_center = applyToPoint(transform, center)
  const screen_width = width * transform.a
  const screen_height = height * transform.a

  return (
    <>
      <div
        style={{
          pointerEvents: "none",
          border: "1px solid rgba(0,0,0,0.5)",
          backgroundColor: "rgba(0,0,0,0.1)",
          position: "absolute",
          width: screen_width,
          height: screen_height,
          left: screen_center.x - screen_width / 2,
          top: screen_center.y - screen_height / 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
          fontSize: 11,
        }}
      >
        {box_id}
      </div>
      {ports.map((port) => {
        const screen_port_position = applyToPoint(
          transform,
          addp(center, port.relative_position)
        )
        return (
          <div
            key={port.port_id}
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              border: "1px solid rgba(0,0,255,0.5)",
              backgroundColor: "rgba(0,0,255,0.1)",
              left: screen_port_position.x - 5,
              top: screen_port_position.y - 5,
            }}
          />
        )
      })}
    </>
  )
}
