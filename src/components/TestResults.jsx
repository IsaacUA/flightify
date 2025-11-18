// TestResults.jsx
// Assuming ButtonElement is available via import

import ButtonElement from './ButtonElement'

export default function TestResults({ dropZones, handleRestart }) {
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

  const results = checkResults()
  const correctCount = results.filter((r) => r.isCorrect).length

  return (
    <div className="flex flex-col gap-4 items-start p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">
        You got {correctCount} / {dropZones.length} fully correct! 🏆
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
              {result.label} ({result.isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
              )
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
