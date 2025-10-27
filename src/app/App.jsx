import { useMemo, useState } from 'react'

import AppInfo from '../components/app-info/app-info'
import SearchPanel from '../components/search-panel/search-panel'
import AppFilter from '../components/app-filter/app-filter'
import EmployeesList from '../components/employees-list/employees-list'
import EmployeesAddForm from '../components/employees-add-form/employees-add-form'

import './App.css'

const initialEmployees = [
  {
    id: 1,
    name: 'Jonas Berg',
    role: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Stockholm, Sweden',
    salary: 94000,
    increase: true,
    rise: true,
    remote: true,
    hiredAt: '2019-08-12',
    impactScore: 93,
    avatarColor: '#8c5ff6'
  },
  {
    id: 2,
    name: 'Caroline Madsen',
    role: 'Product Manager',
    department: 'Product',
    location: 'Copenhagen, Denmark',
    salary: 88000,
    increase: false,
    rise: false,
    remote: false,
    hiredAt: '2021-02-04',
    impactScore: 87,
    avatarColor: '#ff784f'
  },
  {
    id: 3,
    name: 'Birta Jonsdottir',
    role: 'Design Lead',
    department: 'Design',
    location: 'Reykjavik, Iceland',
    salary: 76000,
    increase: true,
    rise: false,
    remote: true,
    hiredAt: '2020-11-19',
    impactScore: 91,
    avatarColor: '#5cb8a6'
  },
  {
    id: 4,
    name: 'Mateusz Kowalczyk',
    role: 'Data Scientist',
    department: 'AI & Data',
    location: 'Warsaw, Poland',
    salary: 102000,
    increase: true,
    rise: true,
    remote: false,
    hiredAt: '2022-05-30',
    impactScore: 95,
    avatarColor: '#ffd166'
  },
  {
    id: 5,
    name: 'Lina Andersson',
    role: 'People Partner',
    department: 'People Ops',
    location: 'Malmo, Sweden',
    salary: 64000,
    increase: false,
    rise: false,
    remote: true,
    hiredAt: '2023-09-14',
    impactScore: 82,
    avatarColor: '#06d6a0'
  }
]

const palette = ['#8c5ff6', '#ff784f', '#5cb8a6', '#ffd166', '#06d6a0', '#4d96ff']
const getAccentColor = (index) => palette[index % palette.length]

const App = () => {
  const [employees, setEmployees] = useState(initialEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [department, setDepartment] = useState('all')
  const [sortOption, setSortOption] = useState('salary-desc')

  const departments = useMemo(() => {
    const unique = employees.reduce((acc, employee) => {
      if (!acc.includes(employee.department)) {
        acc.push(employee.department)
      }
      return acc
    }, [])

    return ['all', ...unique]
  }, [employees])

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== id))
  }

  const handleAddEmployee = (payload) => {
    setEmployees((prev) => {
      const nextIndex = prev.length
      return [
        ...prev,
        {
          id: Date.now(),
          name: payload.name,
          role: payload.role,
          department: payload.department || 'Unassigned',
          location: payload.location || 'Remote',
          salary: Number(payload.salary) || 0,
          increase: false,
          rise: payload.rise || false,
          remote: payload.remote ?? true,
          hiredAt: payload.hiredAt || new Date().toISOString().slice(0, 10),
          impactScore: payload.impactScore || 75,
          avatarColor: getAccentColor(nextIndex)
        }
      ]
    })
  }

  const handleToggleProp = (id, prop) => {
    setEmployees((prev) =>
      prev.map((employee) => {
        if (employee.id === id) {
          return { ...employee, [prop]: !employee[prop] }
        }
        return employee
      })
    )
  }

  const handleSalaryChange = (id, value) => {
    setEmployees((prev) =>
      prev.map((employee) => {
        if (employee.id !== id) {
          return employee
        }
        const parsed = Number(value)
        return Number.isNaN(parsed) ? employee : { ...employee, salary: parsed }
      })
    )
  }

  const filteredEmployees = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    let prepared = employees.filter((employee) => {
      if (!normalizedTerm) return true
      return (
        employee.name.toLowerCase().includes(normalizedTerm) ||
        employee.role.toLowerCase().includes(normalizedTerm) ||
        employee.department.toLowerCase().includes(normalizedTerm)
      )
    })

    if (department !== 'all') {
      prepared = prepared.filter((employee) => employee.department === department)
    }

    if (filter === 'rise') {
      prepared = prepared.filter((employee) => employee.rise)
    }

    if (filter === 'increase') {
      prepared = prepared.filter((employee) => employee.increase)
    }

    if (filter === 'remote') {
      prepared = prepared.filter((employee) => employee.remote)
    }

    if (filter === 'impact') {
      prepared = prepared.filter((employee) => employee.impactScore >= 90)
    }

    const sorted = [...prepared]
    sorted.sort((a, b) => {
      switch (sortOption) {
        case 'salary-asc':
          return a.salary - b.salary
        case 'salary-desc':
          return b.salary - a.salary
        case 'impact-desc':
          return b.impactScore - a.impactScore
        case 'newest':
          return new Date(b.hiredAt) - new Date(a.hiredAt)
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [employees, searchTerm, filter, department, sortOption])

  const stats = useMemo(() => {
    const totals = employees.reduce(
      (acc, employee) => {
        acc.payroll += employee.salary
        if (employee.remote) acc.remote += 1
        if (employee.increase) acc.recognized += 1
        if (employee.rise) acc.promotion += 1
        const tenureYears =
          (new Date().getTime() - new Date(employee.hiredAt).getTime()) / (1000 * 60 * 60 * 24 * 365)
        acc.tenureSum += tenureYears > 0 ? tenureYears : 0
        return acc
      },
      { payroll: 0, remote: 0, recognized: 0, promotion: 0, tenureSum: 0 }
    )

    return {
      count: employees.length,
      payroll: totals.payroll,
      remoteShare: employees.length ? Math.round((totals.remote / employees.length) * 100) : 0,
      promotionReady: totals.promotion,
      recognitionCount: totals.recognized,
      avgTenure: employees.length ? (totals.tenureSum / employees.length).toFixed(1) : '0.0'
    }
  }, [employees])

  return (
    <div className='app'>
      <AppInfo stats={stats} />

      <section className='app__controls'>
        <SearchPanel
          term={searchTerm}
          sortOption={sortOption}
          onUpdateSearch={setSearchTerm}
          onSortChange={setSortOption}
        />
        <AppFilter
          filter={filter}
          department={department}
          departments={departments}
          onFilterSelect={setFilter}
          onDepartmentChange={setDepartment}
        />
      </section>

      <EmployeesList
        data={filteredEmployees}
        onDelete={handleDelete}
        onToggleProp={handleToggleProp}
        onSalaryChange={handleSalaryChange}
      />

      <EmployeesAddForm onAdd={handleAddEmployee} departments={departments.slice(1)} />
    </div>
  )
}

export default App
