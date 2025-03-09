import * as dotenv from 'dotenv';
dotenv.config();


export function RabbitAuthMQ() {
    console.log('🔧 Configuración RabbitMQ:', {
        url: process.env.AMQP_URL,
        AuthQueue: process.env.MQ_AUTH_QUEUE
    });

    return {
        url: process.env.AMQP_URL,
        AuthQueue: process.env.MQ_AUTH_QUEUE,
        actions: {
            SIGN_IN: 'SIGN_IN',
            SIGN_OUT: 'SIGN_OUT',
            AUTH_EXTERNAL_SIGNIN: 'AUTH_EXTERNAL_SIGNIN',
            RESET: 'AUTH_RESET',
            GET_LIST: 'GET_LIST',
            RECOVERY: 'AUTH_RECOVERY',
            UPDATE_RESET: 'AUTH_UPDATE_RESET',
            PS_CHECK: 'AUTH_PS_CHECK',
            CREATE_USER: 'AUTH_CREATE_USER',
            FIND_USER: 'AUTH_FIND_USER',
            FIND_LIST_USER: 'AUTH_FIND_LIST_USER',
            FIND_ONE_USER: 'AUTH_FIND_ONE_USER',
            UPDATE_USER: 'AUTH_UPDATE_USER',
            UPDATE_EXTRA_INFO_USER: 'UPDATE_EXTRA_INFO_USER',
            REMOVE_USER: 'AUTH_REMOVE_USER',
            CREATE_ROLE: 'AUTH_CREATE_ROLE',
            FIND_ONE_ROLE: 'AUTH_FIND_ONE_ROLE',
            FIND_ROLE: 'AUTH_FIND_ROLE',
            UPDATE_ROLE: 'AUTH_UPDATE_ROLE',
            REMOVE_ROLE: 'AUTH_REMOVE_ROLE',
            UPDATE_STATUS: 'UPDATE_STATUS',
            FIND_ALL_ROLE : 'FIND_ALL_ROLE',
            CREATE_SESSION: 'CREATE_SESSION',
            CLOSE_SESSION: 'CLOSE_SESSION',
            VALIDATE_SESSION: 'VALIDATE_SESSION',
            FIND_LIST_USER_CAMPAIGN_ROL : 'FIND_LIST_USER_CAMPAIGN_ROL'
        }

    };
}
