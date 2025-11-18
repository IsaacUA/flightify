import { useState } from 'react'

export default function PlaneTest() {
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const [dropZones, setDropZones] = useState([
    { id: 'zone1', correct: 'Engine', placed: null, x: 100, y: 180 },
    { id: 'zone2', correct: 'Tail', placed: null, x: 450, y: 50 },
  ])

  const initialItems = ['Engine', 'Tail']
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
        <select className="p-2 border">
          <option>A320</option>
          <option>B737</option>
        </select>
        <button className="p-2 bg-blue-500 text-white" onClick={handleStart}>
          Start
        </button>
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
      {/* Plane Image */}
      <div
        className="relative"
        style={{
          width: 600,
          height: 300,
          backgroundImage: "url('/plane.png')",
          backgroundSize: 'cover',
        }}
      >
        {dropZones.map((zone) => (
          <div
            key={zone.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, zone.id)}
            className="absolute border border-blue-500 bg-white bg-opacity-50"
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

      {/* Items */}
      <div className="flex gap-4 mt-6 p-4 border">
        {items.map((item) => (
          <div
            key={item}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', item)}
            className="p-2 bg-gray-200 rounded"
          >
            {item}
          </div>
        ))}
      </div>

      <button
        className="mt-6 p-2 bg-green-500 text-white"
        onClick={() => setFinished(true)}
      >
        Finish
      </button>
    </div>
  )
}

// Shuffle function
function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
