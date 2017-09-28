import { Component } from '@angular/core';
import { Model, TodoItem } from './model';

@Component({
  selector: 'todo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  model = new Model();

  getName = () => this.model.user;

  getTodoItems = () => this.model.items.filter(i => !i.done);

  addItem = (newItem) => {
    if (newItem !="") {
      this.model.items.push(new TodoItem(newItem, false));
    }
  };
}
