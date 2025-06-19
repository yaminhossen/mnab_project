'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/leave-applications';
    const controllerInstance = controller(fastify);

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .get(`${prefix}/:id`, controllerInstance.find)
        .get(
            `${prefix}/approved`,
            { preHandler: [auth_middleware] },
            controllerInstance.approved,
        )
        .get(
            `${prefix}/pending`,
            { preHandler: [auth_middleware] },
            controllerInstance.pending,
        )
        .get(
            `${prefix}/rejected`,
            { preHandler: [auth_middleware] },
            controllerInstance.rejected,
        )
        .get(
            `${prefix}/teacher-approved`,
            { preHandler: [auth_middleware] },
            controllerInstance.teachers_approved,
        )
        .get(
            `${prefix}/teacher-rejected`,
            { preHandler: [auth_middleware] },
            controllerInstance.teachers_rejected,
        )
        .get(
            `${prefix}/teacher-pending`,
            { preHandler: [auth_middleware] },
            controllerInstance.teachers_pending,
        )
        .get(
            `${prefix}/staff/:type`,
            { preHandler: [auth_middleware] },
            controllerInstance.staff_leave,
        )
        .post(`${prefix}/store`, controllerInstance.store)
        .post(
            `${prefix}/student-store`,
            { preHandler: [auth_middleware] },
            controllerInstance.student_store,
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
