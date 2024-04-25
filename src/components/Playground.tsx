import { SuperGrid } from "react-supergrid"
import { useMouseMatrixTransform } from "use-mouse-matrix-transform"
import { PlaygroundContext } from "./PlaygroundContext"
import { scale, compose, translate } from "transformation-matrix"

export const Playground = ({ children }: { children: any }) => {
  const { transform, ref } = useMouseMatrixTransform({
    initialTransform: compose(scale(100, -100), translate(5, -2)),
  })

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <PlaygroundContext.Provider value={{ transform }}>
        <SuperGrid width={1000} height={1000} transform={transform} />
        {children}
      </PlaygroundContext.Provider>
    </div>
  )
}
