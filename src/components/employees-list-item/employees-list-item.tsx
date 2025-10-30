import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react'

import type { Employee, EmployeePropertyToggle } from '../../types/employee'

import './employees-list-item.css'

const salaryFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((chunk) => chunk[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase()

interface EmployeesListItemProps {
  employee: Employee
  onDelete: () => void
  onToggleProp: (prop: EmployeePropertyToggle) => void
  onSalaryChange: (value: number) => void
  onSelect: () => void
  isSelected: boolean
}

const EmployeesListItem = ({
  employee,
  onDelete,
  onToggleProp,
  onSalaryChange,
  onSelect,
  isSelected
}: EmployeesListItemProps) => {
  const {
    name,
    role,
    department,
    location,
    salary,
    increase,
    rise,
    remote,
    hiredAt,
    impactScore,
    avatarColor,
    archived
  } = employee

  const initials = getInitials(name)
  const formattedSalary = salaryFormatter.format(salary)
  const tenure = Math.max(
    0,
    Math.floor((new Date().getTime() - new Date(hiredAt).getTime()) / (1000 * 60 * 60 * 24 * 30))
  )

  const cardClassName = ['employee-card']
  if (isSelected) cardClassName.push('employee-card--selected')
  if (archived) cardClassName.push('employee-card--archived')

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onDelete()
  }

  const handleToggleClick =
    (prop: EmployeePropertyToggle) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onToggleProp(prop)
    }

  const handleSalaryInput = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    onSalaryChange(Number(event.target.value))
  }

  return (
    <article
      className={cardClassName.join(' ')}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <header className='employee-card__header'>
        <div className='employee-card__avatar' style={{ backgroundColor: avatarColor }}>
          {initials}
        </div>
        <div className='employee-card__meta'>
          <div className='employee-card__primary'>
            <h3>{name}</h3>
            {rise && <span className='employee-card__chip employee-card__chip--rise'>Rise track</span>}
            {increase && (
              <span className='employee-card__chip employee-card__chip--increase'>Bonus</span>
            )}
            {archived && (
              <span className='employee-card__chip employee-card__chip--archived'>Archived</span>
            )}
          </div>
          <div className='employee-card__secondary'>
            <span>{role}</span>
            <span>|</span>
            <span>{department}</span>
            <span>|</span>
            <span>{location}</span>
            {remote && (
              <span className='employee-card__remote' title='Remote friendly'>
                Remote
              </span>
            )}
          </div>
        </div>
        <button type='button' className='employee-card__delete' onClick={handleDeleteClick}>
          <span className='sr-only'>Remove teammate</span>
          X
        </button>
      </header>

      <section className='employee-card__body'>
        <div className='employee-card__metric'>
          <span className='employee-card__metric-label'>Impact score</span>
          <span className='employee-card__metric-value'>{impactScore}</span>
          <div className='employee-card__meter'>
            <div className='employee-card__meter-fill' style={{ width: `${impactScore}%` }} />
          </div>
        </div>

        <div className='employee-card__metric'>
          <span className='employee-card__metric-label'>Tenure</span>
          <span className='employee-card__metric-value'>
            {tenure >= 12 ? `${(tenure / 12).toFixed(1)} yrs` : `${tenure} mo`}
          </span>
          <span className='employee-card__metric-hint'>Hired {new Date(hiredAt).toLocaleDateString()}</span>
        </div>

        <div className='employee-card__metric employee-card__metric--salary'>
          <span className='employee-card__metric-label'>Salary</span>
          <div className='employee-card__salary-input'>
            <input
              type='number'
              min='0'
              step='1000'
              value={salary}
              onChange={handleSalaryInput}
              onClick={(event) => event.stopPropagation()}
            />
            <span>{formattedSalary}</span>
          </div>
          <div className='employee-card__salary-actions'>
            <button
              type='button'
              className={increase ? 'is-active' : ''}
              onClick={handleToggleClick('increase')}
            >
              Bonus ready
            </button>
            <button
              type='button'
              className={rise ? 'is-active' : ''}
              onClick={handleToggleClick('rise')}
            >
              Promotion track
            </button>
          </div>
        </div>
      </section>
    </article>
  )
}

export default EmployeesListItem
