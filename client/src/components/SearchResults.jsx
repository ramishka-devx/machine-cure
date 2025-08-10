import React from 'react'

const SearchResults = ({ query, data, onPick }) => {
  if (!query) return null
  const q = query.toLowerCase()
  const filtered = data.flatMap((item) =>
    (item.children ?? []).filter((c) => c.label.toLowerCase().includes(q)).map((c) => ({...c, parent: item.label}))
  )

  if (filtered.length === 0) {
    return (
      <div className="absolute left-0 top-full mt-2 w-[32rem] bg-white border rounded-lg shadow-lg p-4 text-sm text-gray-500">
        No options found
      </div>
    )
  }

  return (
    <div className="absolute left-0 top-full mt-2 w-[32rem] bg-white border rounded-lg shadow-lg p-2 max-h-80 overflow-auto">
      {filtered.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onPick(opt)}
          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50"
        >
          <div className="text-sm font-medium">{opt.label}</div>
          <div className="text-xs text-gray-500">in {opt.parent}</div>
        </button>
      ))}
    </div>
  )
}

export default SearchResults
