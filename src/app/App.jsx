import { useEffect, useMemo, useState } from 'react'

import AppInfo from '../components/app-info/app-info'
import AppFilter from '../components/app-filter/app-filter'
import EmployeeDetail from '../components/employee-detail/employee-detail'
import EmployeesAddForm from '../components/employees-add-form/employees-add-form'
import EmployeesList from '../components/employees-list/employees-list'
import SearchPanel from '../components/search-panel/search-panel'
import TeamAnalytics from '../components/team-analytics/team-analytics'

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
    avatarColor: '#8c5ff6',
    archived: false
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
    avatarColor: '#ff784f',
    archived: false
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
    avatarColor: '#5cb8a6',
    archived: false
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
    avatarColor: '#ffd166',
    archived: false
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
    avatarColor: '#06d6a0',
    archived: false
  }
]

const palette = ['#8c5ff6', '#ff784f', '#5cb8a6', '#ffd166', '#06d6a0', '#4d96ff']
const getAccentColor = (index) => palette[index % palette.length]

const buildTrendData = (records) => {
  if (!records.length) {
    return []
  }

  const now = new Date()
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    return date
  })

  return months.map((monthDate) => {
    const current = records.filter((employee) => {
      const hiredAt = new Date(employee.hiredAt)
      return hiredAt <= monthDate
    })

    const active = current.filter((employee) => !employee.archived)
    const payroll = active.reduce((sum, employee) => sum + employee.salary, 0)
    const remoteCount = active.filter((employee) => employee.remote).length

    return {
      label: monthDate.toLocaleString('default', { month: 'short' }),
      payroll,
      remoteShare: active.length ? Math.round((remoteCount / active.length) * 100) : 0
    }
  })
}

const App = () => {
  const [employees, setEmployees] = useState(initialEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [department, setDepartment] = useState('all')
  const [sortOption, setSortOption] = useState('salary-desc')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

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
    if (selectedEmployeeId === id) {
      setSelectedEmployeeId(null)
      setIsDetailOpen(false)
    }
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
          avatarColor: getAccentColor(nextIndex),
          archived: false
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

  const handleSelectEmployee = (id) => {
    setSelectedEmployeeId(id)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
  }

  const handleUpdateEmployee = (updated) => {
    setEmployees((prev) =>
      prev.map((employee) => {
        if (employee.id !== updated.id) return employee
        return {
          ...employee,
          ...updated,
          salary: Number(updated.salary) || 0,
          impactScore: Number(updated.impactScore) || 0,
          remote: Boolean(updated.remote),
          rise: Boolean(updated.rise),
          increase: Boolean(updated.increase)
        }
      })
    )
  }

  const handleArchiveToggle = (id) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id ? { ...employee, archived: !employee.archived } : employee
      )
    )
  }

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handlePrint = () => {
    if (typeof window.print === 'function') {
      window.print()
    }
  }

  const filteredEmployees = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    let prepared = employees.filter((employee) => {
      const matchesTerm =
        !normalizedTerm ||
        employee.name.toLowerCase().includes(normalizedTerm) ||
        employee.role.toLowerCase().includes(normalizedTerm) ||
        employee.department.toLowerCase().includes(normalizedTerm)

      return matchesTerm
    })

    if (department !== 'all') {
      prepared = prepared.filter((employee) => employee.department === department)
    }

    if (filter === 'archived') {
      prepared = prepared.filter((employee) => employee.archived)
    } else {
      prepared = prepared.filter((employee) => !employee.archived)

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
    const active = employees.filter((employee) => !employee.archived)
    const totals = active.reduce(
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
      count: active.length,
      payroll: totals.payroll,
      remoteShare: active.length ? Math.round((totals.remote / active.length) * 100) : 0,
      promotionReady: totals.promotion,
      recognitionCount: totals.recognized,
      avgTenure: active.length ? (totals.tenureSum / active.length).toFixed(1) : '0.0',
      archivedCount: employees.length - active.length
    }
  }, [employees])

  const trendData = useMemo(() => buildTrendData(employees), [employees])

  const analyticsSummary = useMemo(() => {
    if (!trendData.length) {
      return { payrollGrowth: 0, remoteShare: 0, averageSalary: 0 }
    }

    const first = trendData.at(0)
    const last = trendData.at(-1)
    const payrollGrowth =
      first && first.payroll > 0
        ? Math.round(((last.payroll - first.payroll) / first.payroll) * 100)
        : 0

    return {
      payrollGrowth,
      remoteShare: last.remoteShare,
      averageSalary: stats.count ? Math.round(stats.payroll / stats.count) : 0
    }
  }, [trendData, stats])

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId) || null,
    [employees, selectedEmployeeId]
  )

  const isArchiveView = filter === 'archived'

  return (
    <div className='app'>
      <header className='app__header'>
        <h1>People operations dashboard</h1>
        <div className='app__actions'>
          <button type='button' onClick={handleToggleTheme}>
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </button>
          <button type='button' onClick={handlePrint}>
            Print / Save PDF
          </button>
        </div>
      </header>

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
        onSelect={handleSelectEmployee}
        selectedId={selectedEmployeeId}
        isArchiveView={isArchiveView}
      />

      {employees.length > 0 && (
        <TeamAnalytics data={trendData} summary={analyticsSummary} />
      )}

      <EmployeesAddForm onAdd={handleAddEmployee} departments={departments.slice(1)} />

      <div className={`app__backdrop ${isDetailOpen ? 'is-visible' : ''}`} onClick={handleCloseDetail} />

      <EmployeeDetail
        employee={selectedEmployee}
        isOpen={isDetailOpen && Boolean(selectedEmployee)}
        onClose={handleCloseDetail}
        onSave={handleUpdateEmployee}
        onArchiveToggle={handleArchiveToggle}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default App
