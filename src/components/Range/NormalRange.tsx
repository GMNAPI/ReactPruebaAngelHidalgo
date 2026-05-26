import { useCallback, useState } from 'react'
import { useRangeDrag } from '../../hooks/useRangeDrag'
import styles from './Range.module.css'

export interface NormalRangeProps {
  mode: 'normal'
  min: number
  max: number
}

interface NormalRangeInternalProps extends NormalRangeProps {
  trackRef: React.RefObject<HTMLDivElement>
}

export function NormalRange({ min, max, trackRef }: NormalRangeInternalProps) {
  const [minVal, setMinVal] = useState(min)
  const [maxVal, setMaxVal] = useState(max)
  const [minInput, setMinInput] = useState(String(min))
  const [maxInput, setMaxInput] = useState(String(max))

  const toPercent = (v: number) => ((v - min) / (max - min)) * 100

  const handleMinDrag = useCallback(
    (pct: number) => {
      const raw = min + pct * (max - min)
      const clamped = Math.max(min, Math.min(raw, maxVal - 1))
      const rounded = Math.round(clamped)
      setMinVal(rounded)
      setMinInput(String(rounded))
    },
    [min, max, maxVal]
  )

  const handleMaxDrag = useCallback(
    (pct: number) => {
      const raw = min + pct * (max - min)
      const clamped = Math.max(minVal + 1, Math.min(raw, max))
      const rounded = Math.round(clamped)
      setMaxVal(rounded)
      setMaxInput(String(rounded))
    },
    [min, max, minVal]
  )

  const { isDragging: minDragging, onMouseDown: minMouseDown, onTouchStart: minTouchStart } =
    useRangeDrag(trackRef, handleMinDrag)
  const { isDragging: maxDragging, onMouseDown: maxMouseDown, onTouchStart: maxTouchStart } =
    useRangeDrag(trackRef, handleMaxDrag)

  function commitMin() {
    const parsed = parseFloat(minInput)
    if (isNaN(parsed)) { setMinInput(String(minVal)); return }
    const clamped = Math.max(min, Math.min(parsed, maxVal - 1))
    setMinVal(clamped)
    setMinInput(String(clamped))
  }

  function commitMax() {
    const parsed = parseFloat(maxInput)
    if (isNaN(parsed)) { setMaxInput(String(maxVal)); return }
    const clamped = Math.max(minVal + 1, Math.min(parsed, max))
    setMaxVal(clamped)
    setMaxInput(String(clamped))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>
        <input
          className={styles.labelInput}
          value={minInput}
          onChange={e => setMinInput(e.target.value)}
          onBlur={commitMin}
          onKeyDown={e => e.key === 'Enter' && commitMin()}
          aria-label="minimum value"
        />
        €
      </div>

      <div ref={trackRef} className={styles.trackOuter}>
        <div
          className={styles.trackFill}
          style={{ left: `${toPercent(minVal)}%`, right: `${100 - toPercent(maxVal)}%` }}
        />
        <div
          role="slider"
          aria-label="min bullet"
          aria-valuenow={minVal}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-orientation="horizontal"
          tabIndex={0}
          className={`${styles.bullet} ${minDragging ? styles.bulletDragging : ''}`}
          style={{ left: `${toPercent(minVal)}%` }}
          onMouseDown={minMouseDown}
          onTouchStart={minTouchStart}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') handleMinDrag((Math.min(minVal + 1, maxVal - 1) - min) / (max - min))
            if (e.key === 'ArrowLeft') handleMinDrag((Math.max(minVal - 1, min) - min) / (max - min))
          }}
        />
        <div
          role="slider"
          aria-label="max bullet"
          aria-valuenow={maxVal}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-orientation="horizontal"
          tabIndex={0}
          className={`${styles.bullet} ${maxDragging ? styles.bulletDragging : ''}`}
          style={{ left: `${toPercent(maxVal)}%` }}
          onMouseDown={maxMouseDown}
          onTouchStart={maxTouchStart}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') handleMaxDrag((Math.min(maxVal + 1, max) - min) / (max - min))
            if (e.key === 'ArrowLeft') handleMaxDrag((Math.max(maxVal - 1, minVal + 1) - min) / (max - min))
          }}
        />
      </div>

      <div className={styles.label}>
        <input
          className={styles.labelInput}
          value={maxInput}
          onChange={e => setMaxInput(e.target.value)}
          onBlur={commitMax}
          onKeyDown={e => e.key === 'Enter' && commitMax()}
          aria-label="maximum value"
        />
        €
      </div>
    </div>
  )
}
