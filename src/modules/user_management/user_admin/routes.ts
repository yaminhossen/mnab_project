'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/admin-users';
    const controllerInstance = controller(fastify);

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .get(`${prefix}/:id`, controllerInstance.find)
        .get(
            `${prefix}/admin-details`,
            { preHandler: [auth_middleware] },
            controllerInstance.admin_details,
        )
        .post(`${prefix}/make-admin/:id`, controllerInstance.make_admin)
        .post(
            `${prefix}/make-admin-teacher/:id`,
            controllerInstance.make_admin_teacher,
        )
        .post(`${prefix}/store`, controllerInstance.store)
        .post(
            `${prefix}/profile-update`,
            { preHandler: [auth_middleware] },
            controllerInstance.profile_update,
        )
        .post(`${prefix}/update`, controllerInstance.update)
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/block`, controllerInstance.block)
        .post(`${prefix}/import`, controllerInstance.import)
        .post(`${prefix}/login`, controllerInstance.login)
        .post(`${prefix}/forget`, controllerInstance.forget)
        .post(`${prefix}/logout`, controllerInstance.logout);
};
