export type Connection = {
  from: string
  to: string
}
export type Port = {
  port_id: string
  /** relative x */
  rx: number
  /** relative y */
  ry: number
}
export type Box = {
  box_id: string
  x: number
  y: number
  ports: Array<Port>
}
