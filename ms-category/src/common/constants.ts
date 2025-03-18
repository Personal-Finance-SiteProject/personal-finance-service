export function RabbitConfigMQ() {
    return {
        url: process.env.AMQP_URL,
        queue: process.env.MQ_CATEGORY_QUEUE,
    };
}
