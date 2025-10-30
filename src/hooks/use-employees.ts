import { useCallback } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData
} from '@tanstack/react-query'

import { employeeService } from '../services/employee-service'
import type {
  Employee,
  EmployeeCreateInput,
  EmployeeFormInput,
  EmployeeListResponse,
  EmployeePropertyToggle,
  EmployeeStats,
  EmployeeTrendPoint,
  EmployeeUpdateInput
} from '../types/employee'

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

const PAGE_SIZE = 10
const EMPLOYEES_QUERY_KEY = ['employees']

const normaliseFormPayload = (payload: EmployeeFormInput): EmployeeCreateInput => ({
  name: payload.name.trim(),
  role: payload.role.trim(),
  department: payload.department.trim() || 'Unassigned',
  location: payload.location.trim() || 'Remote',
  salary: payload.salary,
  impactScore: payload.impactScore,
  remote: payload.remote,
  rise: payload.rise,
  increase: payload.increase ?? false,
  archived: false,
  hiredAt: payload.hiredAt
})

const mergePages = (
  data: InfiniteData<EmployeeListResponse, unknown> | undefined
): Employee[] => data?.pages.flatMap((page) => page.items) ?? []

const extractSummary = (
  data: InfiniteData<EmployeeListResponse, unknown> | undefined
): EmployeeStats | null => data?.pages[0]?.summary ?? null

const extractTrend = (
  data: InfiniteData<EmployeeListResponse, unknown> | undefined
): EmployeeTrendPoint[] => data?.pages[0]?.trend ?? []

export const useEmployees = (): UseEmployeesResult => {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery<EmployeeListResponse, Error>({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: ({ pageParam = 1 }) =>
      employeeService.list({ page: Number(pageParam), pageSize: PAGE_SIZE }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    staleTime: 30_000
  })

  const invalidateEmployees = useCallback(
    () => queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY }),
    [queryClient]
  )

  const addEmployeeMutation = useMutation({
    mutationFn: (payload: EmployeeFormInput) =>
      employeeService.create(normaliseFormPayload(payload)),
    onSuccess: invalidateEmployees
  })

  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: number) => employeeService.remove(id),
    onSuccess: invalidateEmployees
  })

  const toggleEmployeeMutation = useMutation({
    mutationFn: ({ id, prop }: { id: number; prop: EmployeePropertyToggle }) =>
      employeeService.toggle(id, prop),
    onSuccess: invalidateEmployees
  })

  const updateSalaryMutation = useMutation({
    mutationFn: ({ id, value }: { id: number; value: number }) =>
      employeeService.update(id, { salary: value }),
    onSuccess: invalidateEmployees
  })

  const updateEmployeeMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: EmployeeUpdateInput }) =>
      employeeService.update(id, updates),
    onSuccess: invalidateEmployees
  })

  const addEmployee: UseEmployeesResult['addEmployee'] = useCallback(
    async (payload) => {
      try {
        await addEmployeeMutation.mutateAsync(payload)
        return true
      } catch (mutationError) {
        console.error(mutationError)
        return false
      }
    },
    [addEmployeeMutation]
  )

  const deleteEmployee: UseEmployeesResult['deleteEmployee'] = useCallback(
    async (id) => {
      try {
        await deleteEmployeeMutation.mutateAsync(id)
        return true
      } catch (mutationError) {
        console.error(mutationError)
        return false
      }
    },
    [deleteEmployeeMutation]
  )

  const toggleEmployeeProperty: UseEmployeesResult['toggleEmployeeProperty'] = useCallback(
    async (id, prop) => {
      try {
        await toggleEmployeeMutation.mutateAsync({ id, prop })
        return true
      } catch (mutationError) {
        console.error(mutationError)
        return false
      }
    },
    [toggleEmployeeMutation]
  )

  const updateSalary: UseEmployeesResult['updateSalary'] = useCallback(
    async (id, value) => {
      try {
        await updateSalaryMutation.mutateAsync({ id, value })
        return true
      } catch (mutationError) {
        console.error(mutationError)
        return false
      }
    },
    [updateSalaryMutation]
  )

  const updateEmployee: UseEmployeesResult['updateEmployee'] = useCallback(
    async (id, updates) => {
      try {
        return await updateEmployeeMutation.mutateAsync({ id, updates })
      } catch (mutationError) {
        console.error(mutationError)
        return null
      }
    },
    [updateEmployeeMutation]
  )

  const loadMore: UseEmployeesResult['loadMore'] = useCallback(async () => {
    if (hasNextPage) {
      await fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage])

  const refresh: UseEmployeesResult['refresh'] = useCallback(async () => {
    await refetch()
  }, [refetch])

  const employees = mergePages(data)
  const summary = extractSummary(data)
  const trend = extractTrend(data)

  const errorMessage =
    error instanceof Error ? error.message : error ? 'Failed to load teammates.' : null

  return {
    employees,
    isLoading,
    isLoadingMore: isFetchingNextPage,
    error: errorMessage,
    summary,
    trend,
    hasMore: Boolean(hasNextPage),
    addEmployee,
    deleteEmployee,
    toggleEmployeeProperty,
    updateSalary,
    updateEmployee,
    loadMore,
    refresh
  }
}
