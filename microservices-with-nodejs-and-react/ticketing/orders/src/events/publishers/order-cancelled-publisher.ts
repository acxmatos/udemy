import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@acxmatos-gittix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
