import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import type { AnalyticsSummary, EmployeeTrendPoint } from '../../types/employee'

import './team-analytics.css'

interface CustomTooltipPoint {
  value?: number | string
}

interface CustomTooltipProps {
  active?: boolean
  label?: string
  payload?: CustomTooltipPoint[]
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null
  }

  const [payrollPoint, remotePoint] = payload

  const payrollValue =
    typeof payrollPoint?.value === 'number'
      ? payrollPoint.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      : '—'

  const remoteValue =
    typeof remotePoint?.value === 'number' ? `${remotePoint.value}%` : '—'

  return (
    <div className='team-analytics__tooltip'>
      <span className='team-analytics__tooltip-label'>{label}</span>
      <div className='team-analytics__tooltip-field'>
        <span>Total payroll</span>
        <strong>{payrollValue}</strong>
      </div>
      <div className='team-analytics__tooltip-field'>
        <span>Remote share</span>
        <strong>{remoteValue}</strong>
      </div>
    </div>
  )
}

interface TeamAnalyticsProps {
  data: EmployeeTrendPoint[]
  summary: AnalyticsSummary
}

const TeamAnalytics = ({ data, summary }: TeamAnalyticsProps) => {
  return (
    <section className='team-analytics'>
      <header className='team-analytics__header'>
        <div>
          <h2>Team momentum</h2>
          <p>Track payroll growth against remote adoption to balance budget with location strategy.</p>
        </div>
        <ul className='team-analytics__badges'>
          <li>
            <span>Payroll YoY</span>
            <strong>{summary.payrollGrowth}%</strong>
          </li>
          <li>
            <span>Remote share</span>
            <strong>{summary.remoteShare}%</strong>
          </li>
          <li>
            <span>Avg salary</span>
            <strong>
              {summary.averageSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </strong>
          </li>
        </ul>
      </header>

      <div className='team-analytics__chart'>
        <ResponsiveContainer width='100%' height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='payrollGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='var(--chart-payroll)' stopOpacity={0.35} />
                <stop offset='100%' stopColor='var(--chart-payroll)' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='4 8' stroke='var(--chart-grid)' />
            <XAxis dataKey='label' stroke='var(--chart-axis)' />
            <YAxis
              yAxisId='left'
              tickFormatter={(value: number) =>
                value.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })
              }
              stroke='var(--chart-axis)'
            />
            <YAxis yAxisId='right' orientation='right' stroke='var(--chart-axis)' domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId='left'
              type='monotone'
              dataKey='payroll'
              name='Total payroll'
              stroke='var(--chart-payroll)'
              fill='url(#payrollGradient)'
              strokeWidth={2}
            />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='remoteShare'
              name='Remote share %'
              stroke='var(--chart-remote)'
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default TeamAnalytics
