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
  const rangeRef = useRef<HTMLDivElement>(null)

  // Ajustar cualquier valor al mas cercano del arrays de RangeValues o que
  // value > min y value < max
  const snapToRange = (value: number): number => {
    if (!rangeValues || rangeValues.length === 0) {
      // Para que esté entre > min y < max
      const valueWithinRange = Math.min(Math.max(value, minValue), maxValue)
      return valueWithinRange
    }

    // Se utiliza reduce (acumula el resultado) y se comprueba si
    // el valor de la pos del bullet es la mas cercana (abs para ser positivo distancia)
    const closest = rangeValues.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    )
    return closest
  }

  // Para el 1 bullet(min), inicia el proceso de drag para mousemove
  // y mouseup dinámicamente mientras el user mueve el mouse
  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const moveHandler = rangeValues ? handleMouseMoveDiscrete : handleMouseMove
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('mouseup', endDrag)
  }

  // Para el 2 bullet(max), //
  const startDragMax = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const moveHandler = rangeValues
      ? handleMouseMoveMaxDiscrete
      : handleMouseMoveMax
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('mouseup', endDrag)
  }

  // Coomo se mueve el bullet 1 min
  const handleMouseMove = (e: MouseEvent) => {
    if (!rangeRef.current) return

    // Obtengo la info (left, width, height, right,...) del div (LINE)
    const rangeRect = rangeRef.current.getBoundingClientRect()

    // Calculo la nueva posición
    // (e.clientX - rangeRect.left) que tan lejos hacia la derecha está el cursor desde
    // el borde izquierdo
    // Despues se divide por el ancho total del contenedor y se obtiene el % que ha avanzado el bullet
    // Se multiplica por la diferencia total de valores posibles + minValue(para asegurar que esta en el rango)
    let newMin =
      ((e.clientX - rangeRect.left) / rangeRect.width) * (maxValue - minValue) +
      minValue

    // Seteo el nuevo valor y posicion del bullet sin que pase del min y max
    setMin(Math.max(minValue, Math.min(newMin, max)))
  }

  const handleMouseMoveDiscrete = (e: MouseEvent) => {
    if (!rangeRef.current || !rangeValues) return

    const rangeRect = rangeRef.current.getBoundingClientRect()

    const cursorPosition = (e.clientX - rangeRect.left) / rangeRect.width

    // Lo mismo que la anterior funcion pero con las posiciones del array
    let newIndex = Math.round(cursorPosition * (rangeValues.length - 1))

    // Asegurar que min no exceda max (para que no se crucen)
    if (rangeValues[newIndex] >= max) {
      newIndex = rangeValues.indexOf(max) - 1
    }

    newIndex = Math.max(0, Math.min(newIndex, rangeValues.length - 1))

    setMin(rangeValues[newIndex])
  }

  const handleMouseMoveMax = (e: MouseEvent) => {
    if (!rangeRef.current) return

    const rangeRect = rangeRef.current.getBoundingClientRect()
    let newMax =
      ((e.clientX - rangeRect.left) / rangeRect.width) * (maxValue - minValue) +
      minValue

    setMax(Math.max(min, Math.min(newMax, maxValue)))
  }

  const handleMouseMoveMaxDiscrete = (e: MouseEvent) => {
    if (!rangeRef.current || !rangeValues) return

    const rangeRect = rangeRef.current.getBoundingClientRect()

    const cursorPosition = (e.clientX - rangeRect.left) / rangeRect.width

    let newIndex = Math.round(cursorPosition * (rangeValues.length - 1))

    // Asegurar que max no sea menor que min (que no se crucen)
    if (rangeValues[newIndex] <= min) {
      newIndex = rangeValues.indexOf(min) + 1
    }

    newIndex = Math.max(0, Math.min(newIndex, rangeValues.length - 1))

    setMax(rangeValues[newIndex])
  }

  // Calcula la posición del bullet 1 (min) del rango como un
  // porcentaje del ancho total del contenedor del slider.
  const calculateLeft = () => {
    if (rangeValues && rangeValues.length > 0) {
      const index = rangeValues.indexOf(min)
      return (index / (rangeValues.length - 1)) * 100
    }

    // (min - minValue) / (maxValue - minValue) en % en que posicion está
    // representa la posicion del valor minimo dentro del rango
    return ((min - minValue) / (maxValue - minValue)) * 100
  }

  const calculateRight = () => {
    if (rangeValues && rangeValues.length > 0) {
      const index = rangeValues.indexOf(max)
      return (index / (rangeValues.length - 1)) * 100
    }
    return ((max - minValue) / (maxValue - minValue)) * 100
  }

  // Eliminar los listeners para evitar efectos secundarios (rendimiento, o cosas raras)
  const endDrag = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mousemove', handleMouseMoveMax)
    document.removeEventListener('mousemove', handleMouseMoveDiscrete)
    document.removeEventListener('mousemove', handleMouseMoveMaxDiscrete)
    document.removeEventListener('mouseup', endDrag)
  }

  return (
    <div
      data-testid='rangeComponent'
      className='flex items-center gap-4 w-full'
    >
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
        {/* Bullet 1 Min */}
        <div
          className='absolute top-0 -translate-y-1/2 translate-x-[-50%] w-4 h-4 bg-black rounded-full cursor-grab  hover:scale-150 '
          style={{ left: `${calculateLeft()}%` }}
          onMouseDown={startDrag}
        />

        {/* Bullet 2 Max */}
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
