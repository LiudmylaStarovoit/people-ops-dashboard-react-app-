import './app-info.css'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

const AppInfo = ({ stats }) => {
  const { count, payroll, remoteShare, promotionReady, recognitionCount, avgTenure } = stats

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
        <article className='app-info__card'>
          <span className='app-info__label'>Team size</span>
          <strong className='app-info__value'>{count}</strong>
          <span className='app-info__hint'>Active teammates on board</span>
        </article>

        <article className='app-info__card'>
          <span className='app-info__label'>Total annual payroll</span>
          <strong className='app-info__value app-info__value--accent'>
            {currencyFormatter.format(payroll)}
          </strong>
          <span className='app-info__hint'>Budget coverage across departments</span>
        </article>

        <article className='app-info__card'>
          <span className='app-info__label'>Promotion ready</span>
          <strong className='app-info__value'>{promotionReady}</strong>
          <span className='app-info__hint'>Awaiting next step in growth plan</span>
        </article>

        <article className='app-info__card'>
          <span className='app-info__label'>Recognised talent</span>
          <strong className='app-info__value'>{recognitionCount}</strong>
          <span className='app-info__hint'>Currently flagged for bonuses</span>
        </article>

        <article className='app-info__card'>
          <span className='app-info__label'>Remote friendly</span>
          <strong className='app-info__value'>{remoteShare}%</strong>
          <span className='app-info__hint'>Distribution of hybrid & remote hires</span>
        </article>

        <article className='app-info__card'>
          <span className='app-info__label'>Average tenure</span>
          <strong className='app-info__value'>{avgTenure} yrs</strong>
          <span className='app-info__hint'>Experience accumulated in-house</span>
        </article>
      </div>
    </section>
  )
}

export default AppInfo
