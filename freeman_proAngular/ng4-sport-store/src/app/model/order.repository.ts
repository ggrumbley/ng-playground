import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Order } from './order.model';
import { StaticDataSource } from './static.datasource';

@Injectable()
export class OrderRepository {
  private orders: Order[] = [];

  constructor(private dataSource: StaticDataSource) {}

  getOrders = (): Order[] => this.orders;

  saveOrder = (order: Order): Observable<Order> => this.dataSource.saveOrder(order);
}
