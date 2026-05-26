import { useRef } from 'react'
import { FixedRange, FixedRangeProps } from './FixedRange'
import { NormalRange, NormalRangeProps } from './NormalRange'

type RangeProps = NormalRangeProps | FixedRangeProps

export function Range(props: RangeProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  if (props.mode === 'normal') {
    return <NormalRange {...props} trackRef={trackRef} />
  }
  return <FixedRange {...props} trackRef={trackRef} />
}
