export const getCcwPosition = (
  index: number,
  opts: {
    left_side_size: number
    right_size_size: number
    centered_around?: { x: number; y: number }
    pitch?: number
    space_between_sides?: number
  }
) => {
  opts.centered_around ??= { x: 0, y: 0 }
  opts.pitch ??= 1
  opts.space_between_sides ??= 5

  const { left_side_size, right_size_size } = opts

  const height = (Math.max(left_side_size, right_size_size) - 1) * opts.pitch

  if (index < left_side_size) {
    return {
      x: opts.centered_around.x - opts.space_between_sides / 2,
      y: opts.centered_around.y + height / 2 - index * opts.pitch,
    }
  } else {
    const rindex = index - left_side_size

    return {
      x: opts.centered_around.x + opts.space_between_sides / 2,
      y: opts.centered_around.y - height / 2 + rindex * opts.pitch,
    }
  }
}
