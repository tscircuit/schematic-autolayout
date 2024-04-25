import { useEffect, useRef } from "react"
import { usePlaygroundContext } from "./PlaygroundContext"
import { applyToPoint } from "transformation-matrix"
import { Scene } from "../lib/scene"

export const LinesCanvas = ({ scene }: { scene: Scene }) => {
  const { transform } = usePlaygroundContext()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, 1000, 1000)

      const findPort = (
        port_id: string
      ): { screenX: number; screenY: number } => {
        const [box_id] = port_id.split(".")
        const box = scene.boxes.find((b) => b.box_id === box_id)
        if (!box) throw new Error(`Box not found: ${box_id}`)
        const port = box.ports.find((p) => p.port_id === port_id)
        if (!port) throw new Error(`Port not found: ${port_id}`)
        const port_pos = {
          x: box.x + port.rx,
          y: box.y + port.ry,
        }
        const screen_point = applyToPoint(transform, port_pos)
        return {
          screenX: screen_point.x,
          screenY: screen_point.y,
        }
      }

      for (const connection of scene.connections) {
        const A = findPort(connection.from)
        const B = findPort(connection.to)

        ctx.beginPath()
        ctx.moveTo(A.screenX, A.screenY)
        ctx.lineTo(B.screenX, B.screenY)
        ctx.strokeStyle = "blue"
        ctx.globalAlpha = 0.5
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }
  }, [canvasRef.current, transform])

  return (
    <canvas
      style={{ position: "absolute", left: 0, top: 0 }}
      ref={canvasRef}
      width="1000"
      height="1000"
    />
  )
}
