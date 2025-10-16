import './app-filter.css'

// Dynamically render filter buttons with active styling
const AppFilter = ({ filter, onFilterSelect }) => {
  const buttonsData = [
    { name: 'all', label: 'All employees' },
    { name: 'rise', label: 'Promotion' },
    { name: 'salary', label: 'Salary more than 1000$' }
  ]

  return (
    <div className='btn-group'>
      {buttonsData.map(({ name, label }) => {
        const active = filter === name
        const clazz = active ? 'btn btn-light' : 'btn btn-outline-light'

        return (
          <button
            key={name}
            className={clazz}
            type='button'
            onClick={() => onFilterSelect(name)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default AppFilter
