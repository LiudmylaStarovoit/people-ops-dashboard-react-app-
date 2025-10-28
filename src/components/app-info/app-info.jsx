import './app-info.css'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const AppInfo = ({ stats }) => {
  const {
    count,
    payroll,
    remoteShare,
    promotionReady,
    recognitionCount,
    avgTenure,
    archivedCount
  } = stats

  const metricCards = [
    {
      label: 'Team size',
      value: count,
      hint: 'Active teammates on board'
    },
    {
      label: 'Total annual payroll',
      value: currencyFormatter.format(payroll),
      hint: 'Budget coverage across departments',
      accent: true
    },
    {
      label: 'Promotion ready',
      value: promotionReady,
      hint: 'Awaiting next step in growth plan'
    },
    {
      label: 'Recognised talent',
      value: recognitionCount,
      hint: 'Currently flagged for bonuses'
    },
    {
      label: 'Remote friendly',
      value: `${remoteShare}%`,
      hint: 'Distribution of hybrid & remote hires'
    },
    {
      label: 'Average tenure',
      value: `${avgTenure} yrs`,
      hint: 'Experience accumulated in-house'
    },
    {
      label: 'Archived teammates',
      value: archivedCount,
      hint: 'Parked profiles for future review'
    }
  ]

  return (
    <section className='app-info'>
      <div className='app-info__headline'>
        <span className='app-info__eyebrow'>People Analytics Snapshot</span>
        <h1 className='app-info__title'>Vivid employees dashboard</h1>
        <p className='app-info__subtitle'>
          A polished overview that highlights team health, recognises top performers and keeps hiring
          momentum on track.
        </p>
      </div>

      <div className='app-info__grid'>
        {metricCards.map(({ label, value, hint, accent }) => (
          <article className='app-info__card' key={label}>
            <span className='app-info__label'>{label}</span>
            <strong className={`app-info__value ${accent ? 'app-info__value--accent' : ''}`}>
              {value}
            </strong>
            <span className='app-info__hint'>{hint}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AppInfo
