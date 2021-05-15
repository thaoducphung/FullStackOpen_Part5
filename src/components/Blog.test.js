import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'
// import { prettyDOM } from '@testing-library/dom'


describe('<Blog/>', () => {
  let component

  beforeEach(() => {
    const blog = {
      user: 'Test User',
      likes: 0,
      author: 'Test Author',
      title: 'Test Title',
      url: 'Test Url'
    }
    component = render(
      <Blog blog={blog}/>
    )
  })
  test('check blog renders title and author', () => {
    //   component.debug()
    const blogTitle = component.container.querySelector('.ViewTitleOnly')
    //   console.log(prettyDOM(blogTitle))
    expect(blogTitle).toHaveTextContent('Test Title')

    const blogAuthor = component.container.querySelector('.ShowAll')
    // console.log(prettyDOM(blogAuthor))
    expect(blogAuthor).toHaveTextContent('Test Author')
    expect(blogAuthor).toHaveTextContent('Test Url')

  })
  test('at start the title are displayed', () => {
    const div = component.container.querySelector('.ViewTitleOnly')
    expect(div).not.toHaveStyle('display: none')
  })
  test('at start the author, url, likes are not render', () => {
    const div = component.container.querySelector('.ShowAll')
    expect(div).toHaveStyle('display: none')
  })
  test('after clicking the button, children are display', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.ViewTitleOnly')
    expect(div).toHaveStyle('display:none')

    const showAll = component.container.querySelector('.ShowAll')
    expect(showAll).not.toHaveStyle('display:none')
  })
})

test('check the like button', () => {
  const addLike = jest.fn()
  const blog = {
    user: 'Test User',
    likes: 0,
    author: 'Test Author',
    title: 'Test Title',
    url: 'Test Url'
  }
  const componentLike = render(
    <Blog addLike={addLike} blog={blog}/>
  )
  componentLike.debug()
  // View the like button first
  const button = componentLike.getByText('view')
  fireEvent.click(button)

  const likeButton = componentLike.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(addLike.mock.calls).toHaveLength(2)
})