import type { Employee, EmployeeCreateInput, EmployeePropertyToggle, EmployeeStats, EmployeeTrendPoint, EmployeeUpdateInput } from '../types/employee'
import { buildEmployeeTrendData, calculateEmployeeStats } from '../utils/employee-analytics'

const ACCENT_PALETTE = ['#8c5ff6', '#ff784f', '#5cb8a6', '#ffd166', '#06d6a0', '#4d96ff']

const getAccentColor = (index: number) => ACCENT_PALETTE[index % ACCENT_PALETTE.length]

const BASE_EMPLOYEES: Employee[] = [
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

const FIRST_NAMES = [
  'Jonas',
  'Caroline',
  'Birta',
  'Mateusz',
  'Lina',
  'Sven',
  'Helga',
  'Anika',
  'Tomas',
  'Elisa',
  'Nadia',
  'Oskar',
  'Maja',
  'Henrik',
  'Ingrid',
  'Mikkel',
  'Olivia',
  'Jakob',
  'Sofia',
  'Emil'
]

const LAST_NAMES = [
  'Berg',
  'Madsen',
  'Jonsdottir',
  'Kowalski',
  'Andersson',
  'Larsson',
  'Pettersson',
  'Johansson',
  'Svendsen',
  'Ibrahimovic',
  'Nowak',
  'Virtanen',
  'Seppala',
  'Kallio',
  'Poulsen',
  'Christensen',
  'Lindgren',
  'Holm',
  'Nyström',
  'Westergaard'
]

const ROLES = [
  'Frontend Developer',
  'Backend Engineer',
  'Design Lead',
  'Product Manager',
  'Data Scientist',
  'QA Lead',
  'Growth Manager',
  'People Partner',
  'DevOps Engineer',
  'UX Researcher'
]

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Data',
  'Marketing',
  'People Ops',
  'Growth',
  'Operations'
]

const LOCATIONS = [
  'Stockholm, Sweden',
  'Copenhagen, Denmark',
  'Reykjavik, Iceland',
  'Warsaw, Poland',
  'Oslo, Norway',
  'Helsinki, Finland',
  'Tallinn, Estonia',
  'Vilnius, Lithuania',
  'Hamburg, Germany',
  'Remote, Europe'
]

const generateEmployees = (): Employee[] => {
  const result: Employee[] = [...BASE_EMPLOYEES]
  let idCounter = BASE_EMPLOYEES.length + 1
  const startDate = new Date('2018-01-01')

  for (let i = 0; i < 40; i += 1) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length]
    const role = ROLES[i % ROLES.length]
    const department = DEPARTMENTS[i % DEPARTMENTS.length]
    const location = LOCATIONS[i % LOCATIONS.length]

    const hiredAtDate = new Date(startDate)
    hiredAtDate.setMonth(startDate.getMonth() + i * 2)

    const salary = 58000 + (i % 10) * 4500
    const impactScore = Math.min(99, 70 + (i % 9) * 3)

    result.push({
      id: idCounter,
      name: `${firstName} ${lastName}`,
      role,
      department,
      location,
      salary,
      increase: i % 3 === 0,
      rise: i % 4 === 0,
      remote: i % 2 === 0,
      hiredAt: hiredAtDate.toISOString().slice(0, 10),
      impactScore,
      avatarColor: getAccentColor(result.length),
      archived: i % 11 === 0
    })

    idCounter += 1
  }

  return result
}

let employees: Employee[] = generateEmployees()
let nextId = employees.length + 1

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export interface EmployeeListParams {
  page?: number
  pageSize?: number
}

export interface EmployeeListResponse {
  items: Employee[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  summary: EmployeeStats
  trend: EmployeeTrendPoint[]
}

export const employeeService = {
  async list(params: EmployeeListParams = {}): Promise<EmployeeListResponse> {
    await delay()

    const page = Math.max(1, params.page ?? 1)
    const pageSize = Math.max(1, params.pageSize ?? 10)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = employees.slice(start, end)
    const total = employees.length

    return {
      items: clone(items),
      total,
      page,
      pageSize,
      hasMore: end < total,
      summary: calculateEmployeeStats(employees),
      trend: buildEmployeeTrendData(employees)
    }
  },

  async create(payload: EmployeeCreateInput): Promise<Employee> {
    await delay()
    const newEmployee: Employee = {
      ...payload,
      id: nextId,
      avatarColor: payload.avatarColor ?? getAccentColor(employees.length)
    }

    employees = [...employees, newEmployee]
    nextId += 1
    return clone(newEmployee)
  },

  async update(id: number, updates: EmployeeUpdateInput): Promise<Employee> {
    await delay()
    employees = employees.map((employee) =>
      employee.id === id ? { ...employee, ...updates } : employee
    )

    const updated = employees.find((employee) => employee.id === id)
    if (!updated) {
      throw new Error(`Employee with id ${id} not found`)
    }

    return clone(updated)
  },

  async toggle(id: number, prop: EmployeePropertyToggle): Promise<Employee> {
    const employee = employees.find((item) => item.id === id)
    if (!employee) {
      throw new Error(`Employee with id ${id} not found`)
    }

    return this.update(id, { [prop]: !employee[prop] })
  },

  async remove(id: number): Promise<void> {
    await delay()
    employees = employees.filter((employee) => employee.id !== id)
  }
}

export const employeeServiceUtils = {
  reset() {
    employees = generateEmployees()
    nextId = employees.length + 1
  },
  getSeed(): Employee[] {
    return clone(employees)
  }
}
