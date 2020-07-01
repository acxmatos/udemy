import { Message } from "node-nats-streaming";

import { Listener, Subjects, TicketCreatedEvent } from "@acxmatos-gittix/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    msg.ack(); // acks the message has been processed
  }
}
