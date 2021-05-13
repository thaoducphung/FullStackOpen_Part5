import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyMessage = (message, type='success') => {
    setErrorMessage({message,type})
    setTimeout(()=>{
      setErrorMessage(null)
    }, 5000)
  }


  const handleLogin =  async (event) => {
    event.preventDefault()
    // console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // setErrorMessage('Wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
      notifyMessage('wrong username or password','error')
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={errorMessage}/>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input 
            type="text"
            value={username}
            name="Username"
            onChange={({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input 
            type="password"
            value={password}
            name="Password"
            onChange={({target})=> setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
  
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    // window.localStorage.clear()
    setUser(null)
  }

  

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    notifyMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
    // setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
  }

  const blogForm = (errorMessage) => {
    return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage}/>
      <p>{user.name} logged-in<button onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
        title:
        <input 
          value={newTitle}
          onChange={({target}) => setNewTitle(target.value)}
        />
        </div>
        <div>
        author:
        <input 
          value={newAuthor}
          onChange={({target}) => setNewAuthor(target.value)}
        />
        </div>
        <div>
        url:
        <input 
          value={newUrl}
          onChange={({target}) => setNewUrl(target.value)}
        />
        </div>
        <button type="submit">create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )}

  return (
    <div>
    {user === null ?
      loginForm()
      : blogForm(errorMessage)
    }
    </div>
  )
}

export default App