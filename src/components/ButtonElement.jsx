import React from 'react'

function ButtonElement({ setFunction, style, buttonText }) {
  return (
    <button
      className={`p-2 rounded text-white mt-4 ${style}`}
      onClick={setFunction}
    >
      {buttonText}
    </button>
  )
}

export default ButtonElement
