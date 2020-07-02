import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@acxmatos-gittix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
