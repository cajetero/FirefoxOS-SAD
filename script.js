
      var TodoList = {};
      TodoList.webdb = {};
      TodoList.webdb.db = null;
      
      TodoList.webdb.open = function() {
        var dbSize = 5 * 1024 * 1024; // 5MB
        TodoList.webdb.db = openDatabase("Todo", "1.0", "Todo manager", dbSize);
      }
      
      TodoList.webdb.createTable = function() {
        var db = TodoList.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("CREATE TABLE IF NOT EXISTS todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
        });
      }
      
      TodoList.webdb.addTodo = function(todoText) {
        var db = TodoList.webdb.db;
        db.transaction(function(tx){
          var addedOn = new Date();
          tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)",
              [todoText, addedOn],
              TodoList.webdb.onSuccess,
              TodoList.webdb.onError);
         });
      }
      
      TodoList.webdb.onError = function(tx, e) {
        alert("There has been an error: " + e.message);
      }
      
      TodoList.webdb.onSuccess = function(tx, r) {
        // re-render the data.
        TodoList.webdb.getAllTodoItems(loadTodoItems);
      }
      
      
      TodoList.webdb.getAllTodoItems = function(renderFunc) {
        var db = TodoList.webdb.db;
        db.transaction(function(tx) {
          tx.executeSql("SELECT * FROM todo", [], renderFunc,
              TodoList.webdb.onError);
        });
      }
      
      TodoList.webdb.deleteTodo = function(id) {
        var db = TodoList.webdb.db;
        db.transaction(function(tx){
          tx.executeSql("DELETE FROM todo WHERE ID=?", [id],
              TodoList.webdb.onSuccess,
              TodoList.webdb.onError);
          });
      }
      
      function loadTodoItems(tx, rs) {
        var rowOutput = "";
        var todoItems = document.getElementById("todoItems");
        for (var i=0; i < rs.rows.length; i++) {
          rowOutput += renderTodo(rs.rows.item(i));
        }
      
        todoItems.innerHTML = rowOutput;
      }
      
      function renderTodo(row) {
        return "<li>" + row.todo  + " [<a href='javascript:void(0);'  onclick='TodoList.webdb.deleteTodo(" + row.ID +");'>Borrar</a>]</li>";
      }
      
      function init() {
        TodoList.webdb.open();
        TodoList.webdb.createTable();
        TodoList.webdb.getAllTodoItems(loadTodoItems);
      }
      
      function addTodo() {
        var todo = document.getElementById("todo");
        TodoList.webdb.addTodo(todo.value);
        todo.value = "";
      }
