import { useCallback, useState } from 'react'
import { useRangeDrag } from '../../hooks/useRangeDrag'
import styles from './Range.module.css'

export interface FixedRangeProps {
  mode: 'fixed'
  values: number[]
}

interface FixedRangeInternalProps extends FixedRangeProps {
  trackRef: React.RefObject<HTMLDivElement>
}

export function FixedRange({ values, trackRef }: FixedRangeInternalProps) {
  const [minIndex, setMinIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(values.length - 1)

  const toPercent = (index: number) => (index / (values.length - 1)) * 100

  const snapIndex = useCallback(
    (pct: number) => Math.round(pct * (values.length - 1)),
    [values.length]
  )

  const handleMinDrag = useCallback(
    (pct: number) => {
      const idx = Math.max(0, Math.min(snapIndex(pct), maxIndex - 1))
      setMinIndex(idx)
    },
    [snapIndex, maxIndex]
  )

  const handleMaxDrag = useCallback(
    (pct: number) => {
      const idx = Math.max(minIndex + 1, Math.min(snapIndex(pct), values.length - 1))
      setMaxIndex(idx)
    },
    [snapIndex, minIndex, values.length]
  )

  const { isDragging: minDragging, onMouseDown: minMouseDown, onTouchStart: minTouchStart } =
    useRangeDrag(trackRef, handleMinDrag)
  const { isDragging: maxDragging, onMouseDown: maxMouseDown, onTouchStart: maxTouchStart } =
    useRangeDrag(trackRef, handleMaxDrag)

  return (
    <div className={styles.wrapper}>
      <span className={styles.labelText}>{values[minIndex].toFixed(2)}€</span>

      <div ref={trackRef} className={styles.trackOuter}>
        <div
          className={styles.trackFill}
          style={{
            left: `${toPercent(minIndex)}%`,
            right: `${100 - toPercent(maxIndex)}%`,
          }}
        />
        <div
          role="slider"
          aria-label="min bullet"
          aria-valuenow={values[minIndex]}
          aria-valuemin={values[0]}
          aria-valuemax={values[values.length - 1]}
          aria-orientation="horizontal"
          tabIndex={0}
          className={`${styles.bullet} ${minDragging ? styles.bulletDragging : ''}`}
          style={{ left: `${toPercent(minIndex)}%` }}
          onMouseDown={minMouseDown}
          onTouchStart={minTouchStart}
          onKeyDown={e => {
            if (e.key === 'ArrowRight')
              handleMinDrag(Math.min(minIndex + 1, maxIndex - 1) / (values.length - 1))
            if (e.key === 'ArrowLeft')
              handleMinDrag(Math.max(minIndex - 1, 0) / (values.length - 1))
          }}
        />
        <div
          role="slider"
          aria-label="max bullet"
          aria-valuenow={values[maxIndex]}
          aria-valuemin={values[0]}
          aria-valuemax={values[values.length - 1]}
          aria-orientation="horizontal"
          tabIndex={0}
          className={`${styles.bullet} ${maxDragging ? styles.bulletDragging : ''}`}
          style={{ left: `${toPercent(maxIndex)}%` }}
          onMouseDown={maxMouseDown}
          onTouchStart={maxTouchStart}
          onKeyDown={e => {
            if (e.key === 'ArrowRight')
              handleMaxDrag(Math.min(maxIndex + 1, values.length - 1) / (values.length - 1))
            if (e.key === 'ArrowLeft')
              handleMaxDrag(Math.max(maxIndex - 1, minIndex + 1) / (values.length - 1))
          }}
        />
      </div>

      <span className={styles.labelText}>{values[maxIndex].toFixed(2)}€</span>
    </div>
  )
}
