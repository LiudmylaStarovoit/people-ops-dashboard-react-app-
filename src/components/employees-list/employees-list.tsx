import type { Employee, EmployeePropertyToggle } from '../../types/employee'
import EmployeesListItem from '../employees-list-item/employees-list-item'

import './employees-list.css'

interface EmptyStateProps {
  isArchiveView: boolean
}

const EmptyState = ({ isArchiveView }: EmptyStateProps) => (
  <div className='employees-list__empty'>
    <div className='employees-list__empty-beacon' />
    <h3>{isArchiveView ? 'No archived teammates yet' : 'No teammates match your filters yet'}</h3>
    {isArchiveView ? (
      <p>Archived profiles will land here when you pause them from the detail drawer.</p>
    ) : (
      <p>
        Try clearing the filters or inviting new colleagues with the form below. Fresh hires and
        future top performers will appear here.
      </p>
    )}
  </div>
)

interface EmployeesListProps {
  data: Employee[]
  onDelete: (id: number) => void
  onToggleProp: (id: number, prop: EmployeePropertyToggle) => void
  onSalaryChange: (id: number, value: number) => void
  onSelect: (id: number) => void
  selectedId: number | null
  isArchiveView: boolean
}

const EmployeesList = ({
  data,
  onDelete,
  onToggleProp,
  onSalaryChange,
  onSelect,
  selectedId,
  isArchiveView
}: EmployeesListProps) => {
  if (!data.length) {
    return (
      <section className='employees-list'>
        <EmptyState isArchiveView={isArchiveView} />
      </section>
    )
  }

  return (
    <section className='employees-list'>
      {data.map((employee) => (
        <EmployeesListItem
          key={employee.id}
          employee={employee}
          onDelete={() => onDelete(employee.id)}
          onToggleProp={(prop) => onToggleProp(employee.id, prop)}
          onSalaryChange={(value) => onSalaryChange(employee.id, value)}
          onSelect={() => onSelect(employee.id)}
          isSelected={selectedId === employee.id}
        />
      ))}
    </section>
  )
}

export default EmployeesList
