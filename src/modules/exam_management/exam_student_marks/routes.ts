'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/exam-student-marks';
    const controllerInstance = controller(fastify);

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .get(`${prefix}/:id`, controllerInstance.find)
        .get(`${prefix}/mark-details/:class`, controllerInstance.mark_details)
        .get(
            `${prefix}/student-class`,
            { preHandler: [auth_middleware] },
            controllerInstance.student_class,
        )
        .get(
            `${prefix}/student-class/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.student_class_second,
        )
        .get(
            `${prefix}/class-wise-exam/:class`,
            { preHandler: [auth_middleware] },
            controllerInstance.class_wise_exam,
        )
        .get(
            `${prefix}/class-wise-exam/:id/:classid`,
            { preHandler: [auth_middleware] },
            controllerInstance.class_wise_exam_second,
        )
        .get(
            `${prefix}/exam-wise/:termid/:classid`,
            { preHandler: [auth_middleware] },
            controllerInstance.exam_wise,
        )
        .get(
            `${prefix}/exam-wise/:id/:termid/:classid`,
            { preHandler: [auth_middleware] },
            controllerInstance.exam_wise_second,
        )
        .post(`${prefix}/store`, controllerInstance.store)
        .post(`${prefix}/mark-store`, controllerInstance.mark_store)
        .post(`${prefix}/update`, controllerInstance.update)
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import);
};
