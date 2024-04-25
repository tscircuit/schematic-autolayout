import { Scene } from "../../scene"

export function getConnectionMap(scene: Scene) {
  return scene.connections.reduce(
    (acc, conn) => {
      acc[conn.from] = conn.to
      acc[conn.to] = conn.from
      return acc
    },
    {} as Record<string, string>
  )
}
