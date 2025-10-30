export interface Employee {
  id: number
  name: string
  role: string
  department: string
  location: string
  salary: number
  increase: boolean
  rise: boolean
  remote: boolean
  hiredAt: string
  impactScore: number
  avatarColor: string
  archived: boolean
}

export type EmployeePropertyToggle = 'increase' | 'rise'

export interface EmployeeStats {
  count: number
  payroll: number
  remoteShare: number
  promotionReady: number
  recognitionCount: number
  avgTenure: string
  archivedCount: number
}

export interface EmployeeTrendPoint {
  label: string
  payroll: number
  remoteShare: number
}

export interface EmployeeFormInput {
  name: string
  role: string
  department: string
  location: string
  salary: number
  impactScore: number
  remote: boolean
  rise: boolean
  increase?: boolean
  hiredAt: string
}

export type EmployeeCreateInput = Omit<Employee, 'id' | 'avatarColor'> &
  Partial<Pick<Employee, 'avatarColor'>>

export type EmployeeUpdateInput = Partial<Omit<Employee, 'id'>>

export type SortOption = 'salary-asc' | 'salary-desc' | 'impact-desc' | 'newest' | 'name-asc'

export type EmployeeFilterOption = 'all' | 'rise' | 'increase' | 'remote' | 'impact' | 'archived'

export interface AnalyticsSummary {
  payrollGrowth: number
  remoteShare: number
  averageSalary: number
}
