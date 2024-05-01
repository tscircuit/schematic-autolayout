import { SuperGrid } from "react-supergrid"
import { useMouseMatrixTransform } from "use-mouse-matrix-transform"
import { PlaygroundContext } from "./PlaygroundContext"
import { scale, compose, translate } from "transformation-matrix"

export const Playground = ({
  children,
  height = 1000,
}: {
  children: any
  height?: number
}) => {
  const { transform, ref } = useMouseMatrixTransform({
    initialTransform: compose(scale(100, -100), translate(-8, -2)),
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
