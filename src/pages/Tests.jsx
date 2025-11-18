import { useState } from 'react'
import { ButtonElement } from '../components'

// SETUP: Define zones that require MULTIPLE answers
const INITIAL_ZONES = [
  {
    id: 'z1',
    correct: ['Pilot', 'Co-Pilot'],
    placed: [], // Stores an array of dropped items
    x: 200,
    y: 20,
    label: 'Cockpit Personnel',
  },
  {
    id: 'z2',
    correct: ['Passenger', 'Stewardess', 'Luggage'],
    placed: [],
    x: 200,
    y: 450,
    label: 'Cabin Payload',
  },
]

// Generate the draggable items based on what is needed
const INITIAL_ITEMS = INITIAL_ZONES.flatMap((z) => z.correct)

export default function PlaneTest() {
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  // Deep copy for state to ensure clean resets
  const [dropZones, setDropZones] = useState(
    JSON.parse(JSON.stringify(INITIAL_ZONES))
  )
  const [items, setItems] = useState(INITIAL_ITEMS)

  // HANDLE DROP: Add item to the array instead of replacing it
  function handleDrop(e, zoneId) {
    const item = e.dataTransfer.getData('text/plain')

    setDropZones((prevZones) =>
      prevZones.map((zone) => {
        if (zone.id === zoneId) {
          // Prevent adding duplicates if the item is already in this box
          if (zone.placed.includes(item)) return zone

          return { ...zone, placed: [...zone.placed, item] }
        }
        return zone
      })
    )
  }

  // Feature: Click an item inside the box to remove it (in case of mistake)
  function handleRemoveItem(zoneId, itemToRemove) {
    if (finished) return // Disable removing if test is done

    setDropZones((prevZones) =>
      prevZones.map((zone) => {
        if (zone.id === zoneId) {
          return {
            ...zone,
            placed: zone.placed.filter((i) => i !== itemToRemove),
          }
        }
        return zone
      })
    )
  }

  function handleStart() {
    setItems(shuffleArray(INITIAL_ITEMS))
    setStarted(true)
  }

  function handleRestart() {
    setFinished(false)
    setStarted(false)
    setDropZones(JSON.parse(JSON.stringify(INITIAL_ZONES)))
  }

  // VALIDATION: Compare arrays ignoring order and return detailed results
  function checkResults() {
    let results = []

    dropZones.forEach((zone) => {
      // Sort both arrays so order doesn't matter
      const sortedCorrect = [...zone.correct].sort().toString()
      const sortedPlaced = [...zone.placed].sort().toString()

      const isCorrect = sortedCorrect === sortedPlaced

      results.push({
        label: zone.label,
        isCorrect: isCorrect,
        placed: zone.placed,
        required: zone.correct.sort(),
      })
    })

    return results
  }

  if (!started) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-sm mx-auto">
        <p>Multiple Answers Test</p>
        <ButtonElement
          setFunction={handleStart}
          style={'bg-blue-400'}
          buttonText={'Start Test'}
        />
      </div>
    )
  }

  if (finished) {
    const results = checkResults()
    const correctCount = results.filter((r) => r.isCorrect).length

    return (
      <div className="flex flex-col gap-4 items-start p-4 max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">
          You got **{correctCount} / {dropZones.length}** zones fully correct!
          🏆
        </h2>

        {/* Detailed Results List */}
        <div className="w-full space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded shadow-md border-l-4 ${
                result.isCorrect
                  ? 'border-green-600 bg-green-50'
                  : 'border-red-600 bg-red-50'
              }`}
            >
              <h3 className="font-bold text-sm mb-2">
                {result.label} (
                {result.isCorrect ? 'Correct ✅' : 'Incorrect ❌'})
              </h3>

              {/* Required Answers */}
              <div className="text-xs mb-2">
                <span className="font-semibold text-gray-700">Required:</span>{' '}
                <span className="text-green-800 font-medium">
                  {result.required.join(', ')}
                </span>
              </div>

              {/* Placed Answers */}
              <div className="text-xs">
                <span className="font-semibold text-gray-700">You Placed:</span>{' '}
                {result.placed.length > 0 ? (
                  <span className="text-blue-800 font-medium">
                    {[...result.placed].sort().join(', ')}
                  </span>
                ) : (
                  <span className="text-gray-500 italic">None</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 w-full">
          <ButtonElement
            setFunction={handleRestart}
            style={'bg-blue-400 w-full'}
            buttonText={'Restart Test'}
          />
        </div>
      </div>
    )
  }

  return (
    // MAIN CONTAINER: Ensures the entire app structure handles the viewport height
    // We add 'h-screen' to this outer div to ensure the scrolling context is the body/viewport.
    <div className="relative h-screen flex flex-col">
      {/* IMAGE CONTAINER: Now correctly forces horizontal scrolling */}
      <div
        // 1. FIXED: Added 'overflow-y-auto' to this container to handle vertical scrolling
        // of the map content itself, and 'overflow-x-auto' for horizontal scrolling.
        className="relative overflow-x-auto overflow-y-auto flex-grow shadow p-4"
      >
        {/* 2. FIXED: This inner div's minWidth forces the horizontal scrollbar 
           on the parent container when the screen is small. */}
        <div
          style={{
            minWidth: '630px', // Crucial: Forces content wider than mobile viewport
            height: '600px',
            backgroundImage:
              "url('https://www.shutterstock.com/image-vector/plane-top-view-aircraft-flight-600nw-2439936793.jpg')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
          }}
        >
          {/* ... (dropZones map function remains the same) ... */}
          {dropZones.map((zone) => {
            const isZoneCorrect =
              finished &&
              [...zone.correct].sort().toString() ===
                [...zone.placed].sort().toString()
            const isZoneIncorrect = finished && !isZoneCorrect

            return (
              <div
                key={zone.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, zone.id)}
                className={`absolute shadow rounded p-2 flex flex-wrap gap-1 content-start
                  ${
                    isZoneCorrect
                      ? 'bg-green-200/90 border-2 border-green-600'
                      : isZoneIncorrect
                      ? 'bg-red-200/90 border-2 border-red-600'
                      : 'bg-amber-100/90'
                  }
                `}
                style={{
                  width: 160,
                  minHeight: 80,
                  top: zone.y,
                  left: zone.x,
                }}
              >
                <div className="w-full text-xs text-gray-500 font-bold mb-1 border-b border-gray-300 pb-1">
                  {zone.label}
                </div>

                {zone.placed.map((item) => (
                  <span
                    key={item}
                    onClick={() => handleRemoveItem(zone.id, item)}
                    className="bg-white px-2 py-0.5 text-xs rounded shadow cursor-pointer hover:bg-red-100 border border-gray-300"
                    title="Click to remove"
                  >
                    {item}
                  </span>
                ))}

                {zone.placed.length === 0 && (
                  <span className="text-xs text-gray-400 italic">
                    Drop items here...
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ANSWER BANK: STICKY TO BOTTOM (remains the same) */}
      <div
        className="sticky bottom-0 left-0 right-0 z-10 
                   flex flex-col gap-3 p-4 shadow-lg rounded-t-2xl bg-gray-50 
                   border-t border-gray-200"
      >
        <div className="flex flex-wrap gap-2">
          {/* ... (item mapping remains the same) ... */}
          {items.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', item)}
              className="p-2 rounded shadow cursor-grab active:cursor-grabbing bg-white hover:bg-blue-50 border border-gray-200 text-sm"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex gap-4 w-full">
          <ButtonElement
            setFunction={() => setFinished(true)}
            style={'bg-green-400 flex-grow'}
            buttonText={'Finish'}
          />
          <ButtonElement
            setFunction={handleRestart}
            style={'bg-blue-400 flex-grow'}
            buttonText={'Reset'}
          />
        </div>
      </div>
    </div>
  )
}

function shuffleArray(array) {
  return [...array]
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
