import './app-info.css'

const AppInfo = ({increased, employees}) => {
    return (
        <div className="app-info">
            <h1>Employees list in company</h1>
            <h2>Count of employees: {employees}</h2>
            <h2>Salary bonus will get: {increased} employees</h2>
        </div>
        
    )
}

export default AppInfo