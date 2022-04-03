describe('TodoMVC - React', function () {

  beforeEach(function () {
    cy.visit('/')
  })

  const TODO_ITEMS = [
    'buy some cheese',
    'feed the cat',
    'book a doctors appointment'
  ];

  context('New Todo', function () {
    it('should allow me to add todo items', function () {
      // Create 1st todo.
      cy.get('.new-todo')
      .type(TODO_ITEMS[0])
      .type('{enter}');

      // Make sure the list only has one todo item.
      cy.get('.todo-list li')
      .eq(0)
      .find('label')
      .should('contain', TODO_ITEMS[0]);

      // Create 2nd todo.
      cy.get('.new-todo')
      .type(TODO_ITEMS[1])
      .type('{enter}');

      // Make sure the list now has two todo items.
      cy.get('.todo-list li')
      .eq(1)
      .find('label')
      .should('contain', TODO_ITEMS[1]);
    })

    it('should clear text input field when an item is added', function () {
      cy.get('.new-todo')
      .type(TODO_ITEMS[0])
      .type('{enter}');

      cy.get('.new-todo').should('have.text', '');
    })

    it('should append new items to the bottom of the list', function () {
      // Create 3 items.
      cy.createDefaultTodos().as('todos');

      cy.get('.todo-count').contains('3 items left');

      cy.get('@todos')
      .eq(0)
      .find('label')
      .should('contain', TODO_ITEMS[0]);

      cy.get('@todos')
      .eq(1)
      .find('label')
      .should('contain', TODO_ITEMS[1]);

      cy.get('@todos')
      .eq(2)
      .find('label')
      .should('contain', TODO_ITEMS[2]);
    })

    it('should trim entered text', function () {
      //Create todo.      
      cy.createTodo(`    ${TODO_ITEMS[0]}    `);

      cy.get('.todo-list li')
      .eq(0)
      .should('have.text', TODO_ITEMS[0]);
    })

    it('should show #main and #footer when items added', function () {
      cy.createTodo(TODO_ITEMS[0]);
      cy.get('.main').should('be.visible');
      cy.get('.footer').should('be.visible');
    });
  });

  context('Mark all as completed', function () {
    beforeEach(function () {
      cy.createDefaultTodos().as('todos');
    });

    it('should allow me to mark all items as completed', function () {
      // Complete all todos.
      cy.get('.toggle-all').check();

      // get each todo li and ensure its class is 'completed'
      cy.get('@todos')
      .eq(0)
      .should('have.class', 'completed');

      cy.get('@todos')
      .eq(1)
      .should('have.class', 'completed');

      cy.get('@todos')
      .eq(2)
      .should('have.class', 'completed');
    });

    it('should allow me to clear the complete state of all items', function () {
      // Check and then immediately uncheck.
      cy.get('.toggle-all')
      .check()
      .uncheck();

      cy.get('@todos')
      .eq(0)
      .should('not.have.class', 'completed');

      cy.get('@todos')
      .eq(1)
      .should('not.have.class', 'completed');

      cy.get('@todos')
      .eq(2)
      .should('not.have.class', 'completed');
    });

    it('complete all checkbox should update state when items are completed / cleared', function () {
      cy.get('.toggle-all')
      .as('toggleAll')
      .check()
      .should('be.checked');

      // Uncheck first todo.
      cy.get('.todo-list li')
      .eq(0)
      .as('firstTodo')
      .find('.toggle')
      .uncheck();

      // reference the .toggle-all element and make sure its not checked
      cy.get('@toggleAll').should('not.be.checked');

      // reference the first todo again and now toggle it
      cy.get('@firstTodo')
      .find('.toggle')
      .check();

      // Assert the toggle all is checked again.
      cy.get('@toggleAll').should('be.checked');
    });
  });

  
  context('Item', function () {
    it('should allow me to mark items as complete', function () {
      // we are aliasing the return value of
      // our custom command 'createTodo'
      cy.createTodo(TODO_ITEMS[0]).as('firstTodo');
      cy.createTodo(TODO_ITEMS[1]).as('secondTodo');

      cy.get('@firstTodo')
      .find('.toggle')
      .check();
      cy.get('@firstTodo').should('have.class', 'completed');

      cy.get('@secondTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo')
      .find('.toggle')
      .check();

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('have.class', 'completed')
    })

    it('should allow me to un-mark items as complete', function () {
      cy.createTodo(TODO_ITEMS[0]).as('firstTodo')
      cy.createTodo(TODO_ITEMS[1]).as('secondTodo')

      cy.get('@firstTodo')
      .find('.toggle')
      .check()

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')

      cy.get('@firstTodo')
      .find('.toggle')
      .uncheck()

      cy.get('@firstTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')
    })

    it('should allow me to edit an item', function () {
      cy.createDefaultTodos().as('todos')

      cy.get('@todos')
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      // clear out the inputs current value
      // and type a new value
      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('buy some sausages')
      .type('{enter}')

      // explicitly assert about the text value
      cy.get('@todos')
      .eq(0)
      .should('contain', TODO_ITEMS[0])

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos')
      .eq(2)
      .should('contain', TODO_ITEMS[2])
    })
  })

  afterEach(() => {
    cy.window().then((win) => {
      // @ts-ignore
      win.document.activeElement.blur()
    })
  })
})

