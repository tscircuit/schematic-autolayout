import { createContext, useContext } from "react"
import { identity } from "transformation-matrix"

export const PlaygroundContext = createContext({
  transform: identity(),
})

export const usePlaygroundContext = () => {
  return useContext(PlaygroundContext)
}
