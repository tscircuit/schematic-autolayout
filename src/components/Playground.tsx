import { SuperGrid } from "react-supergrid"
import { useMouseMatrixTransform } from "use-mouse-matrix-transform"
import { PlaygroundContext } from "./PlaygroundContext"
import { scale, compose, translate } from "transformation-matrix"

export const Playground = ({
  children,
  center = { x: 0, y: 0 },
  height = 1000,
}: {
  children: any
  center?: { x: number; y: number }
  height?: number
}) => {
  const { transform, ref } = useMouseMatrixTransform({
    initialTransform: compose(scale(100, -100), translate(center.x, center.y)),
  })

  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden", height }}>
      <PlaygroundContext.Provider value={{ transform }}>
        <SuperGrid width={1000} height={height} transform={transform} />
        {children}
      </PlaygroundContext.Provider>
    </div>
  )
}
