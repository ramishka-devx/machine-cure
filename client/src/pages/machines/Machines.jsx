import React from 'react'

const Machines = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Machines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map((i)=> (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Machine #{i}</div>
            <div className="mt-2 text-lg font-medium">Status: Operational</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Machines
