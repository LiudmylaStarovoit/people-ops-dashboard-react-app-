import { FormEvent, useMemo, useState } from 'react'

import type { EmployeeFormInput } from '../../types/employee'

import './employees-add-form.scss'

interface EmployeesAddFormProps {
  onAdd: (payload: EmployeeFormInput) => Promise<boolean> | boolean
  departments?: string[]
}

interface FormState {
  name: string
  role: string
  department: string
  location: string
  salary: string
  impactScore: number | string
  remote: boolean
  rise: boolean
  hiredAt: string
}

const initialFormState: FormState = {
  name: '',
  role: '',
  department: '',
  location: '',
  salary: '',
  impactScore: 80,
  remote: true,
  rise: false,
  hiredAt: new Date().toISOString().slice(0, 10)
}

const EmployeesAddForm = ({ onAdd, departments = [] }: EmployeesAddFormProps) => {
  const [formValues, setFormValues] = useState<FormState>(initialFormState)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  const departmentOptions = useMemo<string[]>(() => {
    const preset = ['People Ops', 'Engineering', 'Design', 'Growth', 'Marketing']
    const filtered = departments.filter((dept) => dept && dept !== 'all')
    return Array.from(new Set([...filtered, ...preset]))
  }, [departments])

  const handleChange =
    (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target
      const value =
        target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value
      setFormValues((prev) => ({
        ...prev,
        [field]: value
      }))
    }

  const handleToggle = (field: 'remote' | 'rise') => () => {
    setFormValues((prev) => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const resetForm = () => {
    setFormValues({
      ...initialFormState,
      department: formValues.department && !departmentOptions.includes(formValues.department)
        ? formValues.department
        : ''
    })
    setShowAdvanced(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nameValid = formValues.name.trim().length >= 3
    const roleValid = formValues.role.trim().length >= 2
    const salaryValue = Number(formValues.salary)
    const salaryValid = salaryValue > 0

    if (!nameValid || !roleValid || !salaryValid) {
      return
    }

    const success = await onAdd({
      name: formValues.name.trim(),
      role: formValues.role.trim(),
      department: formValues.department.trim() || 'Unassigned',
      location: formValues.location.trim() || 'Remote',
      salary: salaryValue,
      impactScore: Number(formValues.impactScore) || 75,
      remote: formValues.remote,
      rise: formValues.rise,
      hiredAt: formValues.hiredAt
    })

    if (success) {
      resetForm()
    }
  }

  return (
    <section className='app-add-form'>
      <header className='app-add-form__header'>
        <div>
          <h3>Invite a new teammate</h3>
          <p>Capture a few key details to surface them on the dashboard instantly.</p>
        </div>
        <button
          type='button'
          className={`app-add-form__advanced ${showAdvanced ? 'is-active' : ''}`}
          onClick={() => setShowAdvanced((prev) => !prev)}
        >
          {showAdvanced ? 'Hide onboarding extras' : 'Show onboarding extras'}
        </button>
      </header>

      <form className='app-add-form__form' onSubmit={handleSubmit}>
        <div className='app-add-form__grid'>
          <label className='app-add-form__field'>
            <span>Full name</span>
            <input
              type='text'
              name='name'
              value={formValues.name}
              onChange={handleChange('name')}
              placeholder='e.g. Sofia Eriksen'
              required
            />
          </label>

          <label className='app-add-form__field'>
            <span>Role</span>
            <input
              type='text'
              name='role'
              value={formValues.role}
              onChange={handleChange('role')}
              placeholder='e.g. Frontend Engineer'
              required
            />
          </label>

          <label className='app-add-form__field'>
            <span>Department</span>
            <input
              list='department-options'
              name='department'
              value={formValues.department}
              onChange={handleChange('department')}
              placeholder='Choose or type a department'
            />
            <datalist id='department-options'>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept} />
              ))}
            </datalist>
          </label>

          <label className='app-add-form__field'>
            <span>Location</span>
            <input
              type='text'
              name='location'
              value={formValues.location}
              onChange={handleChange('location')}
              placeholder='City, Country'
            />
          </label>

          <label className='app-add-form__field'>
            <span>Annual salary (USD)</span>
            <input
              type='number'
              name='salary'
              min='0'
              step='1000'
              value={formValues.salary}
              onChange={handleChange('salary')}
              placeholder='e.g. 82000'
              required
            />
          </label>

          <label className='app-add-form__field'>
            <span>Impact score</span>
            <input
              type='number'
              name='impactScore'
              min='0'
              max='100'
              value={formValues.impactScore}
              onChange={handleChange('impactScore')}
            />
          </label>
        </div>

        {showAdvanced && (
          <div className='app-add-form__advanced-grid'>
            <label className='app-add-form__field'>
              <span>Start date</span>
              <input
                type='date'
                name='hiredAt'
                value={formValues.hiredAt}
                onChange={handleChange('hiredAt')}
              />
            </label>
            <div className='app-add-form__field app-add-form__field--note'>
              <span>Onboarding notes</span>
              <textarea placeholder='Capture highlights or first 90 days focus areas' rows={3} />
            </div>
          </div>
        )}

        <div className='app-add-form__toggles'>
          <button
            type='button'
            className={formValues.remote ? 'is-active' : ''}
            onClick={handleToggle('remote')}
          >
            Remote friendly
          </button>
          <button
            type='button'
            className={formValues.rise ? 'is-active' : ''}
            onClick={handleToggle('rise')}
          >
            Promotion track
          </button>
        </div>

        <footer className='app-add-form__actions'>
          <button type='submit'>Add teammate</button>
          <button type='button' onClick={resetForm} className='app-add-form__secondary'>
            Reset form
          </button>
        </footer>
      </form>
    </section>
  )
}

export default EmployeesAddForm
