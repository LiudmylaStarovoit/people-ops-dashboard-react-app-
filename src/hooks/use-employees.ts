import { useCallback, useEffect, useState } from 'react'

import { employeeService } from '../services/employee-service'
import type {
  Employee,
  EmployeeFormInput,
  EmployeePropertyToggle,
  EmployeeStats,
  EmployeeTrendPoint,
  EmployeeUpdateInput
} from '../types/employee'

const PAGE_SIZE = 10

interface UseEmployeesResult {
  employees: Employee[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  summary: EmployeeStats | null
  trend: EmployeeTrendPoint[]
  hasMore: boolean
  addEmployee: (payload: EmployeeFormInput) => Promise<boolean>
  deleteEmployee: (id: number) => Promise<boolean>
  toggleEmployeeProperty: (id: number, prop: EmployeePropertyToggle) => Promise<boolean>
  updateSalary: (id: number, value: number) => Promise<boolean>
  updateEmployee: (id: number, updates: EmployeeUpdateInput) => Promise<Employee | null>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

export const useEmployees = (): UseEmployeesResult => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<EmployeeStats | null>(null)
  const [trend, setTrend] = useState<EmployeeTrendPoint[]>([])
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(false)

  const fetchPage = useCallback(
    async (pageToLoad: number, append: boolean) => {
      try {
        if (append) {
          setIsLoadingMore(true)
        } else {
          setIsLoading(true)
        }

        const response = await employeeService.list({ page: pageToLoad, pageSize: PAGE_SIZE })

        if (append) {
          setEmployees((prev) => {
            const existingIds = new Set(prev.map((employee) => employee.id))
            const merged = [...prev]
            response.items.forEach((item) => {
              if (!existingIds.has(item.id)) {
                merged.push(item)
              }
            })
            return merged
          })
        } else {
          setEmployees(response.items)
        }

        setSummary(response.summary)
        setTrend(response.trend)
        setHasMore(response.hasMore)
        setPage(response.page)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Failed to load teammates. Please try again.')
      } finally {
        if (append) {
          setIsLoadingMore(false)
        } else {
          setIsLoading(false)
        }
      }
    },
    []
  )

  const reloadAllPages = useCallback(async () => {
    const currentPage = page
    await fetchPage(1, false)
    for (let nextPage = 2; nextPage <= currentPage; nextPage += 1) {
      // eslint-disable-next-line no-await-in-loop
      await fetchPage(nextPage, true)
    }
  }, [fetchPage, page])

  useEffect(() => {
    void fetchPage(1, false)
  }, [fetchPage])

  const addEmployee = useCallback(
    async (payload: EmployeeFormInput) => {
      try {
        await employeeService.create({
          ...payload,
          increase: payload.increase ?? false,
          archived: false
        })
        await reloadAllPages()
        return true
      } catch (err) {
        console.error(err)
        setError('Failed to add teammate.')
        return false
      }
    },
    [reloadAllPages]
  )

  const deleteEmployee = useCallback(
    async (id: number) => {
      try {
        await employeeService.remove(id)
        await reloadAllPages()
        return true
      } catch (err) {
        console.error(err)
        setError('Failed to remove teammate.')
        return false
      }
    },
    [reloadAllPages]
  )

  const toggleEmployeeProperty = useCallback(
    async (id: number, prop: EmployeePropertyToggle) => {
      try {
        await employeeService.toggle(id, prop)
        await reloadAllPages()
        return true
      } catch (err) {
        console.error(err)
        setError('Failed to update teammate status.')
        return false
      }
    },
    [reloadAllPages]
  )

  const updateSalary = useCallback(
    async (id: number, value: number) => {
      try {
        await employeeService.update(id, { salary: value })
        await reloadAllPages()
        return true
      } catch (err) {
        console.error(err)
        setError('Failed to update salary.')
        return false
      }
    },
    [reloadAllPages]
  )

  const updateEmployeeHandler = useCallback(
    async (id: number, updates: EmployeeUpdateInput) => {
      try {
        const updated = await employeeService.update(id, updates)
        await reloadAllPages()
        return updated
      } catch (err) {
        console.error(err)
        setError('Failed to save teammate.')
        return null
      }
    },
    [reloadAllPages]
  )

  const loadMore = useCallback(async () => {
    if (hasMore && !isLoadingMore) {
      await fetchPage(page + 1, true)
    }
  }, [fetchPage, hasMore, isLoadingMore, page])

  const refresh = useCallback(async () => {
    await reloadAllPages()
  }, [reloadAllPages])

  return {
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
    updateEmployee: updateEmployeeHandler,
    loadMore,
    refresh
  }
}
