import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogFrom from './BlogForm'


test('<BlogForm/> test the new blog form', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogFrom  createBlog={createBlog}/>
  )

  const form = component.container.querySelector('form')
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  fireEvent.change(title, {
    target: { value: 'Test Title' }
  })
  fireEvent.change(author, {
    target: { value: 'Test Author' }
  })
  fireEvent.change(url, {
    target: { value: 'Test URL' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
//   console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('Test URL')
})