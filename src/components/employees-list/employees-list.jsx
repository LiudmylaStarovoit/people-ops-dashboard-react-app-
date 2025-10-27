import EmployeesListItem from '../employees-list-item/employees-list-item'

import './employees-list.css'

const EmptyState = () => (
  <div className='employees-list__empty'>
    <div className='employees-list__empty-beacon' />
    <h3>No teammates match your filters yet</h3>
    <p>
      Try clearing the filters or inviting new colleagues with the form below. Fresh hires and
      future top performers will appear here.
    </p>
  </div>
)

const EmployeesList = ({ data, onDelete, onToggleProp, onSalaryChange }) => {
  if (!data.length) {
    return (
      <section className='employees-list'>
        <EmptyState />
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
        />
      ))}
    </section>
  )
}

export default EmployeesList
