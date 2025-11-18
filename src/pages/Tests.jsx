import { useState } from 'react'
import { ButtonElement } from '../components'

export default function PlaneTest() {
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const [dropZones, setDropZones] = useState([
    { id: 'zone1', correct: 'Cockpit', placed: null, x: 220, y: 30 },
    { id: 'zone2', correct: 'Tail', placed: null, x: 200, y: 530 },
  ])

  const initialItems = ['Cockpit', 'Tail']
  const [items, setItems] = useState(initialItems)

  function handleDrop(e, zoneId) {
    const item = e.dataTransfer.getData('text/plain')
    setDropZones((z) =>
      z.map((zone) => (zone.id === zoneId ? { ...zone, placed: item } : zone))
    )
  }

  function handleStart() {
    // shuffle items when starting
    setItems(shuffleArray(initialItems))
    setStarted(true)
  }

  if (!started) {
    return (
      <div className="flex flex-col gap-4">
        <select className="p-2 rounded shadow w-xs">
          <option>A320</option>
          <option>B737</option>
        </select>
        <ButtonElement
          setFunction={handleStart}
          style={'bg-blue-400'}
          buttonText={'Start Test'}
        />
      </div>
    )
  }

  if (finished) {
    const correct = dropZones.filter((z) => z.correct === z.placed).length
    return (
      <h2>
        You got {correct} / {dropZones.length} correct!
      </h2>
    )
  }

  return (
    <div>
      <div
        className="relative"
        style={{
          width: 630,
          height: 600,
          overflow: 'auto',
          backgroundImage:
            "url('https://www.shutterstock.com/image-vector/plane-top-view-aircraft-flight-600nw-2439936793.jpg')",
          backgroundSize: 'cover',
        }}
      >
        {dropZones.map((zone) => (
          <div
            key={zone.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, zone.id)}
            className="absolute shadow rounded bg-amber-100 p-2"
            style={{
              width: 70,
              height: 40,
              top: zone.y,
              left: zone.x,
            }}
          >
            {zone.placed || ''}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-6 p-4 shadow rounded-2xl">
        {items.map((item) => (
          <div
            key={item}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', item)}
            className="p-2  rounded shadow"
          >
            {item}
          </div>
        ))}
      </div>
      <ButtonElement
        setFunction={() => setFinished(true)}
        style={'bg-green-400'}
        buttonText={'Finish'}
      />
    </div>
  )
}

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
