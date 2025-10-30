import { useCallback, type ChangeEvent } from 'react'

import type { SortOption } from '../../types/employee'

import './search-panel.css'

interface SearchPanelProps {
  term: string
  sortOption: SortOption
  onUpdateSearch: (value: string) => void
  onSortChange: (value: SortOption) => void
}

const SearchPanel = ({ term, sortOption, onUpdateSearch, onSortChange }: SearchPanelProps) => {
  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onUpdateSearch(event.target.value)
    },
    [onUpdateSearch]
  )

  const handleSortChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onSortChange(event.target.value as SortOption)
    },
    [onSortChange]
  )

  return (
    <div className='search-panel'>
      <div className='search-panel__field'>
        <label className='search-panel__label' htmlFor='search'>
          Search your team
        </label>
        <div className='search-panel__control'>
          <i className='search-panel__icon' aria-hidden='true'>
            <span className='search-panel__icon-glass' />
          </i>
          <input
            id='search'
            type='text'
            placeholder='Try "designer", "engineering", or a teammate name'
            value={term}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className='search-panel__field'>
        <label className='search-panel__label' htmlFor='sort'>
          Sort by
        </label>
        <div className='search-panel__select-wrapper'>
          <select id='sort' value={sortOption} onChange={handleSortChange}>
            <option value='salary-desc'>Salary - highest first</option>
            <option value='salary-asc'>Salary - lowest first</option>
            <option value='impact-desc'>Impact score</option>
            <option value='newest'>Most recent hire</option>
            <option value='name-asc'>Name A to Z</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchPanel
