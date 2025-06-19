'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/user-teachers';
    const controllerInstance = controller(fastify);

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .get(`${prefix}/teacher-all`, controllerInstance.teacher_all)
        .get(
            `${prefix}/teacher-all-task/:id`,
            controllerInstance.teacher_all_task_user,
        )
        .get(`${prefix}/:id`, controllerInstance.find)
        .get(
            `${prefix}/basic-information`,
            { preHandler: [auth_middleware] },
            controllerInstance.basic_information,
        )
        .get(
            `${prefix}/basic-information/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.basic_informations_second,
        )
        .post(
            `${prefix}/profile-update`,
            { preHandler: [auth_middleware] },
            controllerInstance.profile_update,
        )
        .post(`${prefix}/store`, controllerInstance.store)
        .post(`${prefix}/update`, controllerInstance.update)
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import)
        .post(`${prefix}/login`, controllerInstance.login)
        .post(`${prefix}/forget`, controllerInstance.forget)
        .post(`${prefix}/logout`, controllerInstance.logout);
};
