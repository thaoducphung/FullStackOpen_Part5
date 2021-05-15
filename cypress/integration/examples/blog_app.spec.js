

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      blogs: [],
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged-in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain','wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })
  describe('When logged in', function () {
    beforeEach(function() {
      cy.login({ username:'mluukkai', password: 'secret' })
      cy.visit('http://localhost:3000')
    })
    it('A blog can be created', function (){
      cy.contains('create new blog').click()
      cy.get('#title').type('Test Title')
      cy.get('#author').type('Test Author')
      cy.get('#url').type('Test Url')
      cy.get('#create-note').click()
      cy.contains('Test Title')
      cy.contains('view').click()
      cy.contains('Test Url')
      cy.contains('likes 0')
      cy.contains('Test Author')
    })

    // it('A blog can be like by the user',function (){
    //   cy.createBlog({ title: 'first title', author: 'first author', url:'first url' })
    //   cy.contains('view').click()
    //   cy.get('#like-button').click()
    //   cy.contains('likes 1')
    // })
  })

  describe('User logs in, create and like a blog', function () {
    beforeEach(function () {
      cy.login({ username:'mluukkai', password: 'secret' })
      cy.createBlog({ title: 'first title', author: 'first author', url:'first url', likes:0 })
      cy.contains('view').click()
    })

    it('A blog can be like by the user',function (){
      cy.get('#like-button').click()
      cy.contains('likes 1')
    })

    it('A blog can be removed by the user who created it',function (){
      cy.contains('remove').click()
      cy.get('html').should('not.contain', 'first title')
    })

    it('A blog cannot be removed by other user',function (){
      // Log out first
      cy.contains('logout').click()
      const user = {
        blogs: [],
        name: 'Admin',
        username: 'root',
        password: 'secret'
      }
      cy.request('POST', 'http://localhost:3003/api/users', user)
      cy.visit('http://localhost:3000')

      cy.login({ username:'root', password: 'secret' })
      cy.visit('http://localhost:3000')

      cy.contains('view').click()
      cy.contains('remove').click()
      cy.get('.error')
        .should('contain', 'Unauthorized Action')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('contain', 'first title')
      cy.contains('logout').click()
    })
  })

  describe('test the order likes of all blogs', function () {
    beforeEach(function(){
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        blogs: [],
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'secret'
      }
      cy.request('POST', 'http://localhost:3003/api/users', user)
      cy.visit('http://localhost:3000')

      cy.login({ username:'mluukkai', password: 'secret' })
      cy.createBlog({ title: 'first title', author: 'first author', url:'first url', likes:4 })
      cy.createBlog({ title: 'second title', author: 'second author', url:'second url', likes:1 })
      cy.createBlog({ title: 'third title', author: 'third author', url:'third url', likes:10 })
      cy.createBlog({ title: 'fourth title', author: 'fourth author', url:'fourth url', likes:5 })



    })
    it('test', function(){
      cy.login({ username:'mluukkai', password: 'secret' })
      cy.get('.ViewTitleOnly').then(blogs => {
        console.log('number of blogs', blogs.length)
        console.log(blogs)
        const blogArray = blogs.map( function (i, el) {
          console.log(el.innerText)
          return el.innerText
        })
        return blogArray.get()
        // blogs.get('#view-button').click()
        // cy.wrap(blogs[1]).click()
        // return buttons.map(function(i, el) {
        // console.log(el)
        //   el.click()
        // })
      })
        .should('deep.eq',['third titleview','fourth titleview','first titleview','second titleview'])
    })
  })
})