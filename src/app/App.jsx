import { Component } from 'react'

import AppInfo from '../components/app-info/app-info'
import SearchPanel from '../components/search-panel/search-panel'
import AppFilter from '../components/app-filter/app-filter'
import EmployeesList from '../components/employees-list/employees-list'
import EmployeesAddForm from '../components/employees-add-form/employees-add-form'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [
        { name: 'Uda', salary: 10000, increase: true, rise: true, id: 1 },
        { name: 'Uda2', salary: 20000, increase: false, rise: false, id: 2 },
        { name: 'Uda3', salary: 30000, increase: true, rise: false, id: 3 }
      ],
      term: '',
      filter: 'all'
    }
    this.maxId = 4
  }

  deleteItem = (id) => {
    this.setState(({ data }) => ({
      data: data.filter((item) => item.id !== id)
    }))
  }

  addItem = (name, salary) => {
    const newItem = {
      name,
      // Normalize new employee entry before pushing to state
      salary: Number(salary),
      increase: false,
      rise: false,
      id: this.maxId++
    }

    this.setState(({ data }) => {
      const newArr = [...data, newItem]
      return {
        data: newArr
      }
    })
  }

  onToggleProp = (id, prop) => {
    this.setState(({ data }) => ({
      data: data.map((item) => {
        if (item.id === id) {
          return { ...item, [prop]: !item[prop] }
        }
        return item
      })
    }))
  }

  searchEmployees = (items, term) => {
    if (term.length === 0) {
      return items
    }

    return items.filter((item) =>{
      return item.name.indexOf(term) > -1
    })
  }

  filterEmployees = (items, filter) => {
    switch (filter) {
      case 'rise':
        return items.filter((item) => item.rise)
      case 'salary':
        return items.filter((item) => item.salary > 1000)
      default:
        return items
    }
  }

  onUpdateSearch = (term) => {
    this.setState({term})
  }

  onFilterSelect = (filter) => {
    this.setState({filter})
  }

  render() {
    const { data, term, filter } = this.state
    const employees = data.length
    const increased = data.filter((item) => item.increase).length
    const visibleData = this.filterEmployees(
      this.searchEmployees(data, term),
      filter
    )

    return (
      <div className='app'>
        <AppInfo employees={employees} increased={increased} />

        <div className='search-panel'>
          <SearchPanel onUpdateSearch={this.onUpdateSearch} />
          <AppFilter filter={filter} onFilterSelect={this.onFilterSelect} />
        </div>

        <EmployeesList
          data={visibleData}
          onDelete={this.deleteItem}
          onToggleProp={this.onToggleProp}
        />
        <EmployeesAddForm onAdd={this.addItem} />
      </div>
    )
  }
}

export default App
