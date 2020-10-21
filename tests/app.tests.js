var utils = {
  clearApp: function() {
    localStorage.clear();
    App.filter = 'all';
    App.selectedTodoId = 'home';
    App.todos = {
      id: 'home',
      title: 'nested-todos',
      completed: false,
      children: []
    };
    App.render();
  },
  createTodos: function(number, title = 'test') {
    var newTodoInput = document.querySelector('#new-todo');
    for (var i = 1; i <= number; i++) {
      newTodoInput.value = title + ': todo' + i;
      newTodoInput.dispatchEvent(new KeyboardEvent('keyup', {'keyCode': 13}));
    }
    newTodoInput.value = "";
  }
};

tests({
  // TODO: Add test sections with description and cases.
  // E.g.
  // test('description', tests({...}))
  'THESE TESTS COVER ONLY CORE FUNCTIONALITY.': function() {},
  'Feel free to play with the app to test every edge and tricky case.': function() {},
  '': function() {},
  'STORAGE (2 tests)': function () {},
  '   1. It should store todos in the localStorage': function () {
    utils.clearApp();
    utils.createTodos(1, 'storage test');

    // Get todo from the local storage.
    var project = JSON.parse(localStorage.getItem('nested-todos'));
    var todos = project.children;

    todos.forEach(function(todo, i) {
      eq(todo.title, 'storage test: todo' + (i+1));
    });
  },
  '   2. It should retreive todos from the localStorage': function () {
    utils.clearApp();
    eq(App.todos.children.length, 0);

    // Populate local storage with test todos.
    var todos = [
      {
        id: "1",
        title: "storage test2: todo1",
        completed: false,
        expanded: false,
        children: [],
      },
      {
        id: "1",
        title: "storage test2: todo2",
        completed: true,
        expanded: false,
        children: [],
      },
    ];

    var parent = {
      id: "home",
      title: "Parent",
      completed: false,
      expanded: false,
      children: todos
    };

    localStorage.setItem('nested-todos', JSON.stringify(parent));

    // Initialize the App.
    // App.init();

    // Actual test.
    // eq(App.todos.children.length, 2);
    // eq(App.todos.children[0].title, 'storage test2: todo1');
    // eq(App.todos.children[1].title, 'storage test2: todo2');

    // TODO: Remove extra event listeners after App.init();
  },

  ' ': function() {},
  'SINGLE TODO (10 tests)': function () {},
  '   1.  It should render todo': function () {
    utils.clearApp();
    utils.createTodos(1, 'render single todo test');
    var todo = document.querySelector('#todo-list li');
    var title = todo.querySelector('label');
    eq(title.textContent, 'render single todo test: todo1');
  },
  '   2.  It should create a todo': function () {
    utils.clearApp();
    var todos = App.todos.children;
    eq(todos.length, 0);

    utils.createTodos(1, 'create single todo test');

    eq(todos.length, 1);
    eq(todos[0].title, 'create single todo test: todo1');
  },
  '   3.  It should update todo (MANUAL TEST REQUIRED)': function () {
    utils.clearApp();
    utils.createTodos(1, 'Dbl click me to update!');
    eq(App.todos.children.length, 1);

    // TODO: how to test user dblclick and todo text update?
  },
  '   4.  It should toggle todo': function () {
    utils.clearApp();
    utils.createTodos(1);
    eq(App.todos.children[0].completed, false);

    var toggle = document.querySelector('input.toggle');
    toggle.click();
    eq(App.todos.children[0].completed, true);
  },
  '   5.  It should toggle all todos': function () {
    utils.clearApp();
    utils.createTodos(3, 'toggle-all single todo test');
    var todos = App.todos.children;
    todos.forEach(function(todo) {
      eq(todo.completed, false);
    });

    var toggleAll = document.querySelector('#toggle-all');
    toggleAll.click();

    todos.forEach(function(todo) {
      eq(todo.completed, true);
    });
  },
  '   6.  It should delete todo': function () {
    utils.clearApp();
    utils.createTodos(1, 'destroy single todo test');
    eq(App.todos.children.length, 1);

    var destroyBtn = document.querySelector('.destroy');
    destroyBtn.click();
    eq(App.todos.children.length, 0);
  },
  '   7.  It should delete all completed todos': function() {
    utils.clearApp();
    utils.createTodos(5, 'destroy single todo test');
    var todos = App.todos.children;
    todos.forEach(function(todo, i) {
      eq(todo.completed, false);
    });

    var toggleAll = document.querySelector('#toggle-all');
    toggleAll.click();

    todos.forEach(function(todo, i) {
      eq(todo.completed, true);
    });    

    var clearCompleted = document.querySelector('#clear-completed');
    clearCompleted.click();
    eq(App.todos.children.length, 0);
  },
  '   8.  It should filter completed todos': function() {
    utils.clearApp();
    utils.createTodos(3, 'filter competed todos test');
    eq(App.todos.children.length, 3);
    var all = document.querySelector('#footer ul li:nth-child(1) a');
    var active = document.querySelector('#footer ul li:nth-child(2) a');
    var completed = document.querySelector('#footer ul li:nth-child(3) a');

    var toggleSecondTodo = document.querySelector('#todo-list li:nth-child(2) .toggle');
    App.todos.children[1].completed = !toggleSecondTodo.click();
    App.filter = 'completed';
    completed.click();
    App.render();

    var renderedTodos = document.querySelectorAll('#todo-list li');
    var renderedTodosId = Array.prototype.map.call(renderedTodos, function(todo) {
      return todo.dataset.id;
    });

    var todos = App.todos.children;
    var completedTodosId = todos
      .filter(function(todo) {
        return todo.completed;
      })
      .map(function(todo) {
        return todo.id;
      });

    eq(renderedTodos.length, completedTodosId.length);
    renderedTodosId.forEach(function(id, i) {
      eq(id, completedTodosId[i]);
    });
    all.click();
  },
  '   9.  It should filter active todos': function() {
    utils.clearApp();
    utils.createTodos(3, 'filter competed todos test');
    eq(App.todos.children.length, 3);
    var all = document.querySelector('#footer ul li:nth-child(1) a');
    var active = document.querySelector('#footer ul li:nth-child(2) a');
    var completed = document.querySelector('#footer ul li:nth-child(3) a');

    var toggleSecondTodo = document.querySelector('#todo-list li:nth-child(2) .toggle');
    App.todos.children[1].completed = !toggleSecondTodo.click();
    App.filter = 'active';
    active.click();
    App.render();

    var renderedTodos = document.querySelectorAll('#todo-list li');
    var renderedTodosId = Array.prototype.map.call(renderedTodos, function(todo) {
      return todo.dataset.id;
    });

    var todos = App.todos.children;
    var activeTodosId = todos
      .filter(function(todo) {
        return !todo.completed;
      })
      .map(function(todo) {
        return todo.id;
      });

    eq(renderedTodosId.length, activeTodosId.length);

    renderedTodosId.forEach(function(id, i) {
      eq(id, activeTodosId[i]);
    });
    all.click();
  },
  '   10. It should filter all todos': function() {
    utils.clearApp();
    utils.createTodos(3, 'filter competed todos test');
    eq(App.todos.children.length, 3);

    var all = document.querySelector('#footer ul li:nth-child(1) a');
    var active = document.querySelector('#footer ul li:nth-child(2) a');
    var completed = document.querySelector('#footer ul li:nth-child(3) a');

    var toggleSecondTodo = document.querySelector('#todo-list li:nth-child(2) .toggle');
    App.todos.children[1].completed = !toggleSecondTodo.click();
    App.filter = 'active';
    active.click();
    App.render();
    App.filter = 'all';
    all.click();
    App.render();

    var renderedTodos = document.querySelectorAll('#todo-list li');
    var renderedTodosId = Array.prototype.map.call(renderedTodos, function(todo) {
      return todo.dataset.id;
    });

    var todos = App.todos.children;
    var allTodosId = todos.map(function(todo) {
      return todo.id;
    });

    eq(renderedTodosId.length, allTodosId.length);

    renderedTodosId.forEach(function(id, i) {
      eq(id, allTodosId[i]);
    });
    all.click();
  },

  '   ': function() {},
  'NESTED TODOS (10 tests)': function () {},
  '   1.  It should render focused todo view when click on the todo title.': function () {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var children = parentTodo.children;
    var headline = document.querySelector('#header .headline');
    eq(children.length, 0);
    eq(headline.textContent, 'nested-todos');

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();
    headline = document.querySelector('#header .headline');
    eq(headline.textContent, 'parent: todo1');
    
  },
  '   2.  It should create nested todo.': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var children = parentTodo.children;
    eq(children.length, 0);

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();

    utils.createTodos(1, 'child');
    var childTodo = children[0];
    eq(children.length, 1);
    eq(childTodo.title, parentTodo.children[0].title);
  },
  '   3.  It should update nested todo (MANUAL TEST REQUIRED: both in focused view and expanded view).': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var children = parentTodo.children;

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();

    utils.createTodos(1, 'child');
    var childTodo = children[0];
    eq(children.length, 1);
    eq(childTodo.title, parentTodo.children[0].title); 
  },  
  '   4.  It should toggle nested todo.': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var children = parentTodo.children;

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();

    utils.createTodos(1, 'child');
    var childTodo = children[0];

    eq(childTodo.completed, false);

    var toggle = document.querySelector('input.toggle');
    toggle.click();
    App.render();
    eq(childTodo.completed, true);
  },
  '   5.  It should delete nested todo.': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var children = parentTodo.children;

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();

    utils.createTodos(1, 'child');
    var destroyBtn = document.querySelector('.destroy');

    eq(children.length, 1);
    destroyBtn.click();
    eq(children.length, 0);
  },
  '   6.  It should expand todo children if they exist and if expand btn clicked.': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();

    utils.createTodos(1, 'child');
    var homeLink = document.querySelector('#header .crumbs li:nth-child(1) a');
    App.selectedTodoId = 'home';
    homeLink.click();
    App.render();

    var renderedChildren = document.querySelector('#todo-list li:nth-child(1) .children');
    eq(renderedChildren.childElementCount, 0);
    
    var expand = document.querySelector('#todo-list li');
    parentTodo.expanded = true;
    expand.click();
    App.render();

    renderedChildren = document.querySelector('#todo-list li:nth-child(1) .children');
    eq(renderedChildren.childElementCount, 1);
  },
  '   7.  It should toggle all todos (with nested children).': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var children = parentTodo.children;

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();

    utils.createTodos(1, 'child');
    var homeLink = document.querySelector('#header .crumbs li:nth-child(1) a');
    App.selectedTodoId = 'home';
    homeLink.click();
    App.render();

    var expand = document.querySelector('#todo-list li');
    parentTodo.expanded = true;
    expand.click();
    App.render();

    eq(parentTodo.completed, false);
    eq(children[0].completed, false);

    var toggleAll = document.querySelector('#toggle-all');
    toggleAll.click();

    eq(parentTodo.completed, true);
    eq(children[0].completed, true);
  },
  '   8.  It should toggle children if parent toggled.': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var children = parentTodo.children;

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();

    utils.createTodos(1, 'child');
    var homeLink = document.querySelector('#header .crumbs li:nth-child(1) a');
    App.selectedTodoId = 'home';
    homeLink.click();
    App.render();

    var expand = document.querySelector('#todo-list li');
    parentTodo.expanded = true;
    expand.click();
    App.render();

    eq(parentTodo.completed, false);
    eq(children[0].completed, false);
  },
  '   9.  It should delete children if parent deleted.': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var children = parentTodo.children;

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodo.id;
    todoLink.click();

    utils.createTodos(1, 'child');
    var homeLink = document.querySelector('#header .crumbs li:nth-child(1) a');
    App.selectedTodoId = 'home';
    homeLink.click();
    App.render();

    eq(App.todos.children.length, 1);
    eq(children.length, 1);

    var toggleAll = document.querySelector('#toggle-all');
    toggleAll.click();

    var destroyCompleted = document.querySelector('#footer #clear-completed');
    destroyCompleted.click();
    eq(App.todos.children.length, 0);
  },
  '   10. It should handle crumbs navigation.': function() {
    utils.clearApp();
    utils.createTodos(1, 'parent');
    var parentTodo = App.todos.children[0];
    var parentTodoId = parentTodo.id;
    var children = parentTodo.children;

    var todoLink = document.querySelector('#todo-list li label a');
    App.selectedTodoId = parentTodoId;
    todoLink.click();

    utils.createTodos(1, 'child');
    todoLink = document.querySelector('#todo-list li label a');
    var childId = children[0].id;
    App.selectedTodoId = childId;
    todoLink.click();

    utils.createTodos(1, 'grand child');

    var renderedTodo = document.querySelector('#todo-list .view label a');
    var crumbs = document.querySelectorAll('#header .crumbs a');
    var homeCrumb = crumbs[0];
    var parentCrumb = crumbs[1];

    eq(renderedTodo.textContent, 'grand child: todo1');

    App.selectedTodoId = parentTodoId;
    parentCrumb.click();
    App.render();
    renderedTodo = document.querySelector('#todo-list .view label a');
    eq(renderedTodo.textContent, 'child: todo1');
    
    App.selectedTodoId = 'home';
    homeCrumb.click();
    App.render();
    renderedTodo = document.querySelector('#todo-list .view label a');
    eq(renderedTodo.textContent, 'parent: todo1');

    utils.clearApp();
  }
});