import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

function Page() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function getTodos() {
      const { data, error } = await supabase.from('todos').select()

      if (error) {
        console.error('Error fetching todos:', error)
      } else if (data.length > 0) {
        setTodos(data)
      }
    }

    getTodos()
  }, [])

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li> 
        ))}
      </ul>
    </div>
  )
}

export default Page
