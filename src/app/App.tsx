import { useEffect, useMemo, useState } from 'react'

import AppInfo from '../components/app-info/app-info'
import AppFilter from '../components/app-filter/app-filter'
import EmployeeDetail from '../components/employee-detail/employee-detail'
import EmployeesAddForm from '../components/employees-add-form/employees-add-form'
import EmployeesList from '../components/employees-list/employees-list'
import SearchPanel from '../components/search-panel/search-panel'
import TeamAnalytics from '../components/team-analytics/team-analytics'
import { useEmployees } from '../hooks/use-employees'
import type { AnalyticsSummary, Employee, EmployeeFilterOption, EmployeeFormInput, EmployeePropertyToggle, SortOption } from '../types/employee'
import { buildEmployeeTrendData, calculateEmployeeStats } from '../utils/employee-analytics'

import './App.css'

const App = () => {
  const {
    employees,
    isLoading,
    isLoadingMore,
    error,
    summary,
    trend,
    hasMore,
    addEmployee,
    deleteEmployee,
    toggleEmployeeProperty,
    updateSalary,
    updateEmployee,
    loadMore
  } = useEmployees()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filter, setFilter] = useState<EmployeeFilterOption>('all')
  const [department, setDepartment] = useState<string>('all')
  const [sortOption, setSortOption] = useState<SortOption>('salary-desc')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const departments = useMemo<string[]>(() => {
    const unique = new Set<string>()
    employees.forEach((employee) => unique.add(employee.department))
    return ['all', ...unique]
  }, [employees])

  const handleDelete = async (id: number) => {
    const success = await deleteEmployee(id)
    if (success && selectedEmployeeId === id) {
      setSelectedEmployeeId(null)
      setIsDetailOpen(false)
    }
  }

  const handleAddEmployee = async (payload: EmployeeFormInput) => {
    await addEmployee(payload)
  }

  const handleToggleProp = (id: number, prop: EmployeePropertyToggle) => {
    void toggleEmployeeProperty(id, prop)
  }

  const handleSalaryChange = (id: number, value: number) => {
    void updateSalary(id, value)
  }

  const handleSelectEmployee = (id: number) => {
    setSelectedEmployeeId(id)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
  }

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    const { id, ...rest } = updatedEmployee
    const result = await updateEmployee(id, rest)
    if (result) {
      setSelectedEmployeeId(result.id)
    }
  }

  const handleArchiveToggle = async (id: number) => {
    const current = employees.find((employee) => employee.id === id)
    if (!current) {
      return
    }

    const result = await updateEmployee(id, { archived: !current.archived })
    if (result?.archived) {
      setIsDetailOpen(false)
      setSelectedEmployeeId(null)
    }
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
          return new Date(b.hiredAt).getTime() - new Date(a.hiredAt).getTime()
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [employees, searchTerm, filter, department, sortOption])

  const stats = useMemo(() => summary ?? calculateEmployeeStats(employees), [summary, employees])

  const trendData = useMemo(
    () => (trend.length ? trend : buildEmployeeTrendData(employees)),
    [trend, employees]
  )

  const analyticsSummary = useMemo<AnalyticsSummary>(() => {
    if (!trendData.length) {
      return { payrollGrowth: 0, remoteShare: 0, averageSalary: 0 }
    }

    const first = trendData[0]
    const last = trendData[trendData.length - 1]
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
    () => employees.find((employee) => employee.id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId]
  )

  const isArchiveView = filter === 'archived'

  const handleLoadMore = () => {
    void loadMore()
  }

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
          onUpdateSearch={(value) => setSearchTerm(value)}
          onSortChange={(value) => setSortOption(value)}
        />
        <AppFilter
          filter={filter}
          department={department}
          departments={departments}
          onFilterSelect={(value) => setFilter(value)}
          onDepartmentChange={(value) => setDepartment(value)}
        />
      </section>

      {isLoading && <p className='app__status'>Loading teammates...</p>}
      {error && <p className='app__status app__status--error'>{error}</p>}

      <EmployeesList
        data={filteredEmployees}
        onDelete={handleDelete}
        onToggleProp={handleToggleProp}
        onSalaryChange={handleSalaryChange}
        onSelect={handleSelectEmployee}
        selectedId={selectedEmployeeId}
        isArchiveView={isArchiveView}
      />

      {hasMore && (
        <div className='app__load-more'>
          <button type='button' onClick={handleLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading more...' : 'Load more teammates'}
          </button>
        </div>
      )}

      {employees.length > 0 && <TeamAnalytics data={trendData} summary={analyticsSummary} />}

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
