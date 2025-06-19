'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/branch-classes';
    const controllerInstance = controller(fastify);

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .get(`${prefix}/all-class`, controllerInstance.all_class)
        .post(
            `${prefix}/branch-class-wise-student`,
            controllerInstance.branch_class_wise_student,
        )
        .get(
            `${prefix}/class-routine-auth`,
            { preHandler: [auth_middleware] },
            controllerInstance.class_routine_auth,
        )
        .post(`${prefix}/class-routine`, controllerInstance.class_routine)
        .get(`${prefix}/:id`, controllerInstance.find)
        .post(`${prefix}/store`, controllerInstance.store)
        .post(`${prefix}/update`, controllerInstance.update)
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import)
        .get(
            `${prefix}/class-wise-subject/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.class_wise_subject,
        );
};
