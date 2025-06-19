'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/tasks';
    const controllerInstance = controller(fastify);

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .get(
            `${prefix}/pending`,
            { preHandler: [auth_middleware] },
            controllerInstance.teacher_pending,
        )
        .get(
            `${prefix}/teachers`,
            { preHandler: [auth_middleware] },
            controllerInstance.teacher_tasks,
        )
        .get(
            `${prefix}/staffs`,
            { preHandler: [auth_middleware] },
            controllerInstance.staff_task,
        )
        .get(
            `${prefix}/complete`,
            { preHandler: [auth_middleware] },
            controllerInstance.teacher_complete,
        )
        .get(
            `${prefix}/staff-pending`,
            { preHandler: [auth_middleware] },
            controllerInstance.staff_pending,
        )
        .get(
            `${prefix}/staff-complete`,
            { preHandler: [auth_middleware] },
            controllerInstance.staff_complete,
        )
        .post(
            `${prefix}/teacher-update/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.teacher_update,
        )
        .post(
            `${prefix}/staff-update/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.staff_update,
        )
        .get(`${prefix}/:id`, controllerInstance.find)
        .get(`${prefix}/task-details/:id`, controllerInstance.task_details)
        .post(`${prefix}/store`, controllerInstance.store)
        .post(`${prefix}/task-assign`, controllerInstance.task_assign)
        .post(
            `${prefix}/task-assign-update`,
            { preHandler: [auth_middleware] },
            controllerInstance.task_assign_updated,
        )
        .post(`${prefix}/update`, controllerInstance.update)
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import);

    // .get(`${prefix}/teacher/all`, controllerInstance.all)
    // .get(`${prefix}/teacher/:id`, controllerInstance.find)
    // .post(`${prefix}/teacher/seen`, controllerInstance.store)
    // .post(`${prefix}/teacher/unseen`, controllerInstance.update)
};
