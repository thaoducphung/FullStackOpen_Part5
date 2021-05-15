import React, { useState } from 'react'
import PropTypes from 'prop-types'

// import Toggleable from './Toggleable'

const Blog = ({
  blog,
  addLike,
  removeBlog
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisbile] = useState(false)
  const hideWhenVisible = { display:visible ? 'none' : '' }
  const showWhenVisible = { display:visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisbile(!visible)
  }

  const addChangeBlog = (blog) => {
    // console.log('id',blog.id)
    addLike(blog.id, {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const addRemoveBlog = (blog) => {
    const confirm = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirm) {
      removeBlog(blog.id)
    }
  }

  // console.log(blog)
  return (

    <div style={blogStyle}>

      <div style={hideWhenVisible} className='ViewTitleOnly'>
        {blog.title}<button id='view-button' onClick={toggleVisibility}>view</button>
      </div>

      <div style={showWhenVisible} className='ShowAll'>
        {blog.title}<button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>
          <div className='like-item'>likes {blog.likes}</div>
          <button id='like-button' onClick={() => addChangeBlog(blog)}>like</button>
        </div>
        <div>{blog.author}</div>
        <button onClick={() => addRemoveBlog(blog)}>remove</button>
      </div>

    </div>
  )}

Blog.propTypes = {
  blog:PropTypes.object.isRequired,
  addLike:PropTypes.func.isRequired,
  removeBlog:PropTypes.func.isRequired
}

export default Blog