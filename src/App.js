import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // const [sortBlogs, setSortBlogs] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFromRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortBlogs = blogs.sort( (a,b) => b.likes - a.likes)
      setBlogs( sortBlogs )
    })
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
    setErrorMessage({ message,type })
    setTimeout(() => {
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
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    // window.localStorage.clear()
    setUser(null)
  }


  const addBlog = (blogObject) => {
    blogFromRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notifyMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      })
      .catch(error => {
        // console.log(error.response)
        // notifyMessage(`${error.response.data.error}`,'error')
        notifyMessage(`${error}`,'error')
      })
  }

  const addLike = (id,blogObject) => {
    blogService
      .update(id, blogObject)
      .then(returnedBlog => {
        const updateBlogs = blogs.map(blog => blog.id !== id ? blog : returnedBlog)
        const sortBlogs = updateBlogs.sort( (a,b) => b.likes - a.likes)
        setBlogs( sortBlogs )
        // setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
  }

  const removeBlog = (id) => {
    blogService
      .remove(id)
      .then(() => {
        const updateBlogs = blogs.filter(blog => blog.id !== id)
        const sortBlogs = updateBlogs.sort( (a,b) => b.likes - a.likes)
        setBlogs( sortBlogs )
      })
      .catch(error => {
        // notifyMessage(`${error}`,'error')
        notifyMessage(`${error.response.data.error}`,'error')
      })
  }

  // const addBlog = async (event) => {
  //   event.preventDefault()
  //   const blogObject = {
  //     title: newTitle,
  //     author: newAuthor,
  //     url: newUrl
  //   }

  //   const returnedBlog = await blogService.create(blogObject)
  //   setBlogs(blogs.concat(returnedBlog))
  //   notifyMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
  //   setNewAuthor('')
  //   setNewTitle('')
  //   setNewUrl('')
  //   // setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
  // }

  const blogForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={errorMessage}/>
        <p>{user.name} logged-in<button onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel="create new blog" ref={blogFromRef}>
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            removeBlog={removeBlog}
          />
        )}
      </div>
    )
  }

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