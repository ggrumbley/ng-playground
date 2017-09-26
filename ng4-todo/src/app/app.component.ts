import { Component, Injectable } from '@angular/core';

@Injectable()
export class TaskService {
  tasks;
  constructor() {
    this.tasks = [
      { title: "First Task", completed: false },
      { title: "Second Task", completed: false },
      { title: "Third Task", completed: false },
      { title: "Fourth Task", completed: false }
    ]
  }

  addTask(task) {
    this.tasks.push(task);
  }
}

// ===================================
@Component({
  selector: 'task-list',
  template: `
    <h4>Task List</h4>
    <ul>
      <li *ngFor="let task of taskService.tasks">
        <span [class.completed]="task.completed">{{ task.title }} - {{ task.completed }}</span>
        <button (click)="completeTask(task)">Click to Complete</button>
      </li>
    </ul>
  `,
  styles: [".completed { color: green}"]
})
export class TaskListComponent {
  constructor(public taskService: TaskService) { }

  completeTask(task) {
    task.completed = true;
  }
}

// ===================================
@Component({
  selector: 'task-new',
  template: `
    <h4>Create a Task</h4>
    <form (submit)="onSubmit()">
      <input [(ngModel)]="task.title" [ngModelOptions]="{standalone: true}">
      <input type="submit">
    </form>
  `
})
export class TaskNewComponent {
  task;

  constructor(public taskService: TaskService) {
    this.task = { title: "", completed: false };
  }

  onSubmit() {
    this.taskService.addTask(this.task);
    this.task = { title: "", completed: false };
  }
}

// ===================================
@Component({
  selector: 'tasks',
  template: `
    <h1>Task List Application</h1>
    <task-new></task-new>
    <task-list></task-list>
  `
})
export class TasksComponent { }

// ===================================
@Component({
  selector: 'app-root',
  template: `
    <tasks></tasks>
  `
})
export class AppComponent {}
