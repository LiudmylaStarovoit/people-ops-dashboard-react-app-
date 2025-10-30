import type { EmployeeFilterOption } from '../../types/employee'

import './app-filter.css'

const filterButtons: Array<{ name: EmployeeFilterOption; label: string }> = [
  { name: 'all', label: 'All team members' },
  { name: 'rise', label: 'Promotion ready' },
  { name: 'increase', label: 'Bonus spotlight' },
  { name: 'remote', label: 'Remote friendly' },
  { name: 'impact', label: 'Impact 90+' },
  { name: 'archived', label: 'Archived' }
]

interface AppFilterProps {
  filter: EmployeeFilterOption
  department: string
  departments: string[]
  onFilterSelect: (value: EmployeeFilterOption) => void
  onDepartmentChange: (value: string) => void
}

const AppFilter = ({
  filter,
  department,
  departments,
  onFilterSelect,
  onDepartmentChange
}: AppFilterProps) => {
  return (
    <div className='app-filter'>
      <div className='app-filter__segmented'>
        {filterButtons.map(({ name, label }) => (
          <button
            key={name}
            type='button'
            className={filter === name ? 'is-active' : ''}
            onClick={() => onFilterSelect(name)}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className='app-filter__department'>
        <label htmlFor='department-select'>Focus department</label>
        <div className='app-filter__select-wrapper'>
          <select
            id='department-select'
            value={department}
            onChange={(event) => onDepartmentChange(event.target.value)}
          >
            {departments.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'All departments' : item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default AppFilter
