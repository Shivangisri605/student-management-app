import { useState } from 'react'
import StudentForm from './components/StudentForm'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Student Management App</h1>
      <StudentForm />
    
    </>
  )
}

export default App
