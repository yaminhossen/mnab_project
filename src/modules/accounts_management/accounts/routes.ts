'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import check_auth from '../../auth_management/authetication/services/check_auth';
import check_account_auth from '../../auth_management/authetication/services/check_account_auth';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/accounts';
    const controllerInstance = controller(fastify);

    fastify
        .get(
            `${prefix}`,
            { preHandler: [auth_middleware] },
            controllerInstance.all,
        )
        .get(`${prefix}/all`, controllerInstance.all_accounts)
        .get(`${prefix}/accounts`, controllerInstance.accounts)
        .get(`${prefix}/:id`, controllerInstance.find)
        .post(
            `${prefix}/store`,
            { preHandler: [auth_middleware] },
            controllerInstance.store,
        )
        .post(
            `${prefix}/update`,
            { preHandler: [auth_middleware] },
            controllerInstance.update,
        )
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import);
};
