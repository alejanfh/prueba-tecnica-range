'use client'
import React, { useState, useRef } from 'react'

type RangeProps = {
  minValue: number
  maxValue: number
  rangeValues?: number[]
}

export default function Range({ minValue, maxValue, rangeValues }: RangeProps) {
  const [min, setMin] = useState<number>(
    rangeValues ? rangeValues[0] : minValue
  )
  const [max, setMax] = useState<number>(
    rangeValues ? rangeValues[rangeValues.length - 1] : maxValue
  )
  const [dragStart, setDragStart] = useState<number>(0)
  const rangeRef = useRef<HTMLDivElement>(null)

  const snapToRange = (value: number): number => {
    if (!rangeValues || rangeValues.length === 0) {
      const valueWithinRange = Math.min(Math.max(value, minValue), maxValue)
      return valueWithinRange
    }

    const closest = rangeValues.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    )
    return closest
  }

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragStart(e.clientX)
    const moveHandler = rangeValues ? handleMouseMoveDiscrete : handleMouseMove
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('mouseup', endDrag)
  }

  const startDragMax = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragStart(e.clientX)
    const moveHandler = rangeValues
      ? handleMouseMoveMaxDiscrete
      : handleMouseMoveMax
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('mouseup', endDrag)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!rangeRef.current) return

    const rangeRect = rangeRef.current.getBoundingClientRect()
    let newMin =
      ((e.clientX - rangeRect.left) / rangeRect.width) * (maxValue - minValue) +
      minValue

    newMin = snapToRange(newMin)

    setMin(Math.max(minValue, Math.min(newMin, max)))
  }

  const handleMouseMoveDiscrete = (e: MouseEvent) => {
    if (!rangeRef.current || !rangeValues) return

    const rangeRect = rangeRef.current.getBoundingClientRect()
    // Calcula la posición proporcional del cursor dentro del rango.
    const cursorPosition = (e.clientX - rangeRect.left) / rangeRect.width
    // Calcula el índice basado en la posición proporcional.
    let newIndex = Math.round(cursorPosition * (rangeValues.length - 1))

    // Asegurar que min no exceda max
    if (rangeValues[newIndex] >= max) {
      newIndex = rangeValues.indexOf(max) - 1
    }

    // Clampa el índice para evitar que sobrepase los límites del array.
    newIndex = Math.max(0, Math.min(newIndex, rangeValues.length - 1))

    // Actualiza el valor mínimo basado en el nuevo índice.
    setMin(rangeValues[newIndex])
  }

  const handleMouseMoveMax = (e: MouseEvent) => {
    if (!rangeRef.current) return

    const rangeRect = rangeRef.current.getBoundingClientRect()
    let newMax =
      ((e.clientX - rangeRect.left) / rangeRect.width) * (maxValue - minValue) +
      minValue

    // Adjust newMax based on the presence of rangeValues
    newMax = snapToRange(newMax)

    // Ensure max does not go below min
    setMax(Math.max(min, Math.min(newMax, maxValue)))
  }

  const handleMouseMoveMaxDiscrete = (e: MouseEvent) => {
    if (!rangeRef.current || !rangeValues) return

    const rangeRect = rangeRef.current.getBoundingClientRect()
    const cursorPosition = (e.clientX - rangeRect.left) / rangeRect.width
    let newIndex = Math.round(cursorPosition * (rangeValues.length - 1))

    // Asegurar que max no sea menor que min
    if (rangeValues[newIndex] <= min) {
      newIndex = rangeValues.indexOf(min) + 1
    }

    newIndex = Math.max(0, Math.min(newIndex, rangeValues.length - 1))

    setMax(rangeValues[newIndex])
  }

  const calculateLeft = () => {
    if (rangeValues && rangeValues.length > 0) {
      const index = rangeValues.indexOf(min)
      // Asegurar que el deslizador se mueva en proporción a la longitud de rangeValues
      return (index / (rangeValues.length - 1)) * 100
    }
    return ((min - minValue) / (maxValue - minValue)) * 100
  }

  const calculateRight = () => {
    if (rangeValues && rangeValues.length > 0) {
      const index = rangeValues.indexOf(max)
      // Asegurar que el deslizador se mueva en proporción a la longitud de rangeValues
      return (index / (rangeValues.length - 1)) * 100
    }
    return ((max - minValue) / (maxValue - minValue)) * 100
  }

  const endDrag = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mousemove', handleMouseMoveMax)
    document.removeEventListener('mousemove', handleMouseMoveDiscrete)
    document.removeEventListener('mousemove', handleMouseMoveMaxDiscrete)
    document.removeEventListener('mouseup', endDrag)
  }

  return (
    <div className='flex items-center gap-4 w-full'>
      <input
        className=' p-1 bg-gray-100 text-sm w-[100px]'
        type='number'
        value={min}
        onChange={(e) => setMin(snapToRange(Number(e.target.value)))}
        min={minValue}
        max={maxValue}
        step={rangeValues ? 'any' : 1}
        readOnly={rangeValues ? true : false}
      />
      <div
        ref={rangeRef}
        className='flex-1 h-1 mx-4 w-[200px] relative bg-gray-300 rounded cursor-pointer'
        onMouseDown={(e) => {
          if (e.target === rangeRef.current) {
            startDrag(e)
          }
        }}
      >
        {/* Bullet Min */}
        <div
          className='absolute top-0 -translate-y-1/2 translate-x-[-50%] w-4 h-4 bg-black rounded-full cursor-grab  hover:scale-150 '
          style={{ left: `${calculateLeft()}%` }}
          onMouseDown={startDrag}
        />

        {/* Bullet Max */}
        <div
          className='absolute top-0 -translate-y-1/2 translate-x-[-50%] w-4 h-4 bg-black rounded-full cursor-grab hover:scale-150'
          style={{ left: `${calculateRight()}%` }}
          onMouseDown={startDragMax}
        />
      </div>
      <input
        className=' p-1 bg-gray-100 text-sm w-[100px]'
        type='number'
        value={max}
        onChange={(e) => setMax(snapToRange(Number(e.target.value)))}
        min={minValue}
        max={maxValue}
        step={rangeValues ? 'any' : 1}
        readOnly={rangeValues ? true : false}
      />
    </div>
  )
}
