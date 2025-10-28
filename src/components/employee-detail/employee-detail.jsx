import { useEffect, useState } from 'react'

import './employee-detail.css'

const EmployeeDetail = ({ employee, isOpen, onClose, onSave, onArchiveToggle, onDelete }) => {
  const [formState, setFormState] = useState(employee ?? null)

  useEffect(() => {
    setFormState(employee ? { ...employee } : null)
  }, [employee])

  if (!employee || !formState) {
    return null
  }

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(formState)
  }

  const handleArchive = () => {
    onArchiveToggle(employee.id)
  }

  return (
    <aside className={`employee-detail ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <div className='employee-detail__header'>
        <div>
          <span className='employee-detail__eyebrow'>People profile</span>
          <h3>{employee.name}</h3>
          <p>Adjust role, compensation and growth track from one place.</p>
        </div>
        <button type='button' className='employee-detail__close' onClick={onClose} aria-label='Close'>
          X
        </button>
      </div>

      <form className='employee-detail__form' onSubmit={handleSubmit}>
        <label className='employee-detail__field'>
          <span>Full name</span>
          <input type='text' value={formState.name} onChange={handleChange('name')} required />
        </label>

        <label className='employee-detail__field'>
          <span>Role</span>
          <input type='text' value={formState.role} onChange={handleChange('role')} required />
        </label>

        <label className='employee-detail__field'>
          <span>Department</span>
          <input type='text' value={formState.department} onChange={handleChange('department')} />
        </label>

        <label className='employee-detail__field'>
          <span>Location</span>
          <input type='text' value={formState.location} onChange={handleChange('location')} />
        </label>

        <label className='employee-detail__field'>
          <span>Annual salary (USD)</span>
          <input
            type='number'
            min='0'
            step='1000'
            value={formState.salary}
            onChange={handleChange('salary')}
          />
        </label>

        <label className='employee-detail__field'>
          <span>Impact score</span>
          <input
            type='range'
            min='0'
            max='100'
            value={formState.impactScore}
            onChange={handleChange('impactScore')}
          />
          <div className='employee-detail__range-value'>{formState.impactScore}</div>
        </label>

        <div className='employee-detail__toggles'>
          <label>
            <input
              type='checkbox'
              checked={Boolean(formState.remote)}
              onChange={handleChange('remote')}
            />
            Remote friendly
          </label>
          <label>
            <input
              type='checkbox'
              checked={Boolean(formState.rise)}
              onChange={handleChange('rise')}
            />
            Promotion track
          </label>
          <label>
            <input
              type='checkbox'
              checked={Boolean(formState.increase)}
              onChange={handleChange('increase')}
            />
            Bonus spotlight
          </label>
        </div>

        <div className='employee-detail__actions'>
          <button type='submit' className='employee-detail__save'>
            Save changes
          </button>
          <button type='button' className='employee-detail__archive' onClick={handleArchive}>
            {employee.archived ? 'Restore teammate' : 'Archive teammate'}
          </button>
          <button type='button' className='employee-detail__delete' onClick={() => onDelete(employee.id)}>
            Remove from list
          </button>
        </div>
      </form>
    </aside>
  )
}

export default EmployeeDetail
