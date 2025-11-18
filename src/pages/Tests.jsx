import { useState, useMemo, useCallback } from 'react'
import { ButtonElement, TestResults } from '../components'
import { shuffleArray } from '../utiles/shuffleArray'
import PLANE_DATA from '../data/planeData'

// --- DATA CONFIGURATION: Plane Models and Zones ---

// 1. ✅ ADDED: New constant for unselected state
const UNSELECTED_TYPE = 'UNSELECTED'
// 2. ✅ CHANGED: Default to the new unselected state
const DEFAULT_PLANE_TYPE = UNSELECTED_TYPE

const generateUniqueItems = (planeTypeKey) => {
  if (!PLANE_DATA[planeTypeKey]) return []
  return PLANE_DATA[planeTypeKey].zones
    .flatMap((z) => z.correct)
    .filter((value, index, self) => self.indexOf(value) === index)
}
// --- END DATA CONFIGURATION ---

// ✅ FIX: Modified getZones helper function to initialize `placed: []` on all zones.
const getZones = (type) => {
  // 3. ✅ CHANGED: Check for UNSELECTED_TYPE and return empty array
  if (type === UNSELECTED_TYPE || !PLANE_DATA[type]) return []
  const zones = PLANE_DATA[type]?.zones || []
  return zones.map((zone) => ({
    ...zone,
    // Explicitly ensure 'placed' property exists and is an empty array
    placed: [],
  }))
}
const getItems = (type) => generateUniqueItems(type)

export default function PlaneTest() {
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [selectedPlaneType, setSelectedPlaneType] = useState(DEFAULT_PLANE_TYPE)

  // ✅ FIX 1: Lazy initialization uses the corrected getZones helper
  const [dropZones, setDropZones] = useState(() => {
    const initialZones = getZones(DEFAULT_PLANE_TYPE)
    // Ensure deep copy for clean state isolation
    return JSON.parse(JSON.stringify(initialZones))
  })

  const [shuffledItems, setShuffledItems] = useState(() => {
    return getItems(DEFAULT_PLANE_TYPE)
  })

  // MEMO: Get a flat list of all items currently placed in any zone
  const placedItems = useMemo(() => {
    // Ensure dropZones is an array before calling flatMap, just in case
    return Array.isArray(dropZones)
      ? dropZones.flatMap((zone) => zone.placed)
      : []
  }, [dropZones])

  // MEMO: Filter the shuffled list to show only items not yet placed
  const remainingItems = useMemo(() => {
    return shuffledItems.filter((item) => !placedItems.includes(item))
  }, [shuffledItems, placedItems])

  // --- HANDLERS ---

  // 1. handleRestart
  const handleRestart = useCallback(
    // 4. ✅ CHANGED: Added optional 'resetToUnselected' parameter
    (newType = selectedPlaneType, resetToUnselected = false) => {
      // Determine the final type to use for the reset
      const finalType = resetToUnselected ? UNSELECTED_TYPE : newType

      // If UNSELECTED, just reset state without trying to load data
      if (finalType === UNSELECTED_TYPE) {
        setFinished(false)
        setStarted(false)
        setDropZones([])
        setShuffledItems([])
        setSelectedPlaneType(UNSELECTED_TYPE)
        return
      }

      // Uses the corrected getZones, ensuring fresh zones have placed: []
      const freshZones = getZones(finalType)
      const freshItems = getItems(finalType)

      setFinished(false)
      setStarted(false)
      // Reset drop zones based on the new selection
      setDropZones(JSON.parse(JSON.stringify(freshZones)))
      setShuffledItems(freshItems)
      setSelectedPlaneType(finalType)
    },
    [selectedPlaneType]
  )

  // 2. handlePlaneTypeChange
  const handlePlaneTypeChange = useCallback(
    (e) => {
      const newType = e.target.value
      // When changing via dropdown, we pass the newType
      handleRestart(newType)
    },
    [handleRestart]
  )

  // 3. handleStart
  function handleStart() {
    // 5. ✅ CHANGED: Prevent start if UNSELECTED
    if (selectedPlaneType === UNSELECTED_TYPE) return

    const itemsForType = getItems(selectedPlaneType)
    setShuffledItems(shuffleArray(itemsForType))
    setStarted(true)
  }

  // 4. handleDrop
  function handleDrop(e, zoneId) {
    if (finished) return

    const item = e.dataTransfer.getData('text/plain')

    setDropZones((prevZones) =>
      prevZones.map((zone) => {
        if (zone.id === zoneId) {
          // Check if item is already placed before adding
          if (zone.placed.includes(item)) return zone
          return { ...zone, placed: [...zone.placed, item] }
        }
        return zone
      })
    )
  }

  // 5. handleRemoveItem
  function handleRemoveItem(zoneId, itemToRemove) {
    if (finished) return

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

  // --- RENDER LOGIC ---

  if (!started) {
    const isUnselected = selectedPlaneType === UNSELECTED_TYPE

    return (
      <div className="flex flex-col gap-4 p-4 max-w-sm mx-auto">
        <h2 className="text-xl font-bold">Plane Configuration Test</h2>

        {/* 9. ✅ ADDED/CHANGED: Wrap selector in a container with a fixed width for consistency */}
        <div className="w-full max-w-xs mx-auto">
          {/* DROPDOWN SELECTOR */}
          <label
            htmlFor="plane-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select Plane Model:
          </label>
          <select
            id="plane-select"
            value={selectedPlaneType}
            onChange={handlePlaneTypeChange}
            // The select element maintains w-full, constrained by the parent max-w-xs
            className="mt-1 block w-full w-min-xl pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          >
            {/* 6. ✅ CHANGED: Add unselected option first */}
            <option value={UNSELECTED_TYPE} disabled>
              --- Select a Plane ---
            </option>
            {Object.entries(PLANE_DATA).map(([key, data]) => (
              <option key={key} value={key}>
                {data.label}
              </option>
            ))}
          </select>
        </div>
        {/* End Width Fix */}

        <ButtonElement
          setFunction={handleStart}
          style={'bg-blue-400'}
          buttonText={'Start Test'}
          // 7. ✅ CHANGED: Disable button if UNSELECTED
          disabled={isUnselected}
        />
      </div>
    )
  }

  if (finished) {
    return (
      <TestResults
        dropZones={dropZones}
        // Ensure restart from results screen goes to unselected
        handleRestart={() => handleRestart(undefined, true)}
      />
    )
  }

  return (
    // MAIN CONTAINER
    <div className="relative h-screen flex flex-col">
      {/* Test Header */}
      <div className="p-2 bg-gray-100 border-b text-center text-sm font-semibold rounded-t-2xl">
        {/* ✅ FIX 3: Defensive Rendering */}
        Current Test:{' '}
        {PLANE_DATA[selectedPlaneType]?.label || 'Loading Test...'}
      </div>

      {/* IMAGE CONTAINER */}
      <div className="relative overflow-x-auto overflow-y-auto flex-grow shadow p-4">
        <div
          style={{
            minWidth: '830px',
            height: '600px',
            backgroundImage: `url(${PLANE_DATA[selectedPlaneType]?.image})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
          }}
        >
          {/* Drop Zones */}
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
                className={`absolute shadow rounded p-2 flex flex-wrap gap-1 content-start border overflow-y-auto
                  ${
                    isZoneCorrect
                      ? 'bg-green-200/90 border-green-600 border-2'
                      : isZoneIncorrect
                      ? 'bg-red-200/90 border-red-600 border-2'
                      : 'bg-white/90 border-gray-400'
                  }
                `}
                style={{
                  width: 160,
                  minHeight: 120,
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
                    className={`bg-white px-2 py-0.5 text-xs rounded shadow border border-gray-300 ${
                      finished
                        ? 'cursor-default'
                        : 'cursor-pointer hover:bg-blue-100'
                    }`}
                    title={finished ? null : 'Click to remove'}
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

      {/* ANSWER BANK: STICKY TO BOTTOM */}
      <div
        className="sticky bottom-0 left-0 right-0 z-10 
                   flex flex-col gap-3 p-4 shadow-lg rounded-t-2xl bg-gray-50 
                   border-t border-gray-200"
      >
        <div className="flex flex-wrap gap-2">
          {/* Item mapping (uses remainingItems) */}
          {remainingItems.map((item) => (
            <div
              key={item}
              draggable={!finished}
              onDragStart={(e) => e.dataTransfer.setData('text/plain', item)}
              className={`p-2 rounded shadow bg-white border border-gray-200 text-sm 
                ${
                  finished
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-50 cursor-grab active:cursor-grabbing'
                }`}
            >
              {item}
            </div>
          ))}

          {/* All items placed message */}
          {remainingItems.length === 0 && placedItems.length > 0 && (
            <span className="p-2 text-sm text-gray-500 italic">
              All unique items have been placed for this configuration.
            </span>
          )}
        </div>

        <div className="flex gap-4 w-full">
          <ButtonElement
            setFunction={() => setFinished(true)}
            style={'bg-green-400 flex-grow'}
            buttonText={'Finish'}
            disabled={finished}
          />
          <ButtonElement
            // 8. ✅ CHANGED: Call handleRestart with 'resetToUnselected = true'
            setFunction={() => handleRestart(undefined, true)}
            style={'bg-blue-400 flex-grow'}
            buttonText={'Reset'}
          />
        </div>
      </div>
    </div>
  )
}
