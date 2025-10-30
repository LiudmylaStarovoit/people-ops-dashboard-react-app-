import type { Employee, EmployeeStats, EmployeeTrendPoint } from '../types/employee'

const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365

export const calculateEmployeeStats = (records: Employee[]): EmployeeStats => {
  const active = records.filter((employee) => !employee.archived)

  if (!active.length) {
    return {
      count: 0,
      payroll: 0,
      remoteShare: 0,
      promotionReady: 0,
      recognitionCount: 0,
      avgTenure: '0.0',
      archivedCount: records.length
    }
  }

  const totals = active.reduce(
    (acc, employee) => {
      acc.payroll += employee.salary
      if (employee.remote) acc.remote += 1
      if (employee.increase) acc.recognized += 1
      if (employee.rise) acc.promotion += 1

      const tenureYears = Math.max(
        0,
        (Date.now() - new Date(employee.hiredAt).getTime()) / MS_IN_YEAR
      )

      acc.tenureSum += tenureYears
      return acc
    },
    { payroll: 0, remote: 0, recognized: 0, promotion: 0, tenureSum: 0 }
  )

  const remoteShare = Math.round((totals.remote / active.length) * 100)
  const avgTenure = (totals.tenureSum / active.length).toFixed(1)

  return {
    count: active.length,
    payroll: totals.payroll,
    remoteShare,
    promotionReady: totals.promotion,
    recognitionCount: totals.recognized,
    avgTenure,
    archivedCount: records.length - active.length
  }
}

export const buildEmployeeTrendData = (records: Employee[]): EmployeeTrendPoint[] => {
  if (!records.length) {
    return []
  }

  const now = new Date()
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    return date
  })

  return months.map((monthDate) => {
    const current = records.filter((employee) => new Date(employee.hiredAt) <= monthDate)
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
