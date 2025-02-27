export function RabbitAuthMQ() {
    return {
        url: process.env.AMQP_URL,
        queue: process.env.MQ_AUTH_QUEUE,

    };
}
