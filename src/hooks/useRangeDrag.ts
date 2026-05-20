import { useCallback, useEffect, useState } from 'react'

export function useRangeDrag(
  trackRef: React.RefObject<HTMLElement>,
  onDrag: (offsetPercent: number) => void
): { isDragging: boolean; onMouseDown: (e: React.MouseEvent) => void } {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const raw = (e.clientX - rect.left) / rect.width
      onDrag(Math.max(0, Math.min(1, raw)))
    },
    [trackRef, onDrag]
  )

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  useEffect(() => {
    if (!isDragging) return
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  return { isDragging, onMouseDown }
}
