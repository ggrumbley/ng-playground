import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';

import {
  AppComponent,
  TasksComponent,
  TaskNewComponent,
  TaskListComponent,
  TaskService
} from "./app.component";

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    TaskListComponent,
    TaskNewComponent
  ],
  imports: [BrowserModule, FormsModule],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule {}
