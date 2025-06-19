'use strict';
import { FastifyInstance } from 'fastify';
import controller from './controller';
import check_staff_auth from '../../auth_management/authetication/services/check_staff_auth';
import check_auth from '../../auth_management/authetication/services/check_auth';
import auth_middleware from '../../auth_management/authetication/services/auth_middleware';

module.exports = async function (fastify: FastifyInstance) {
    let prefix: string = '/user-students';
    const controllerInstance = controller(fastify);

    fastify
        .get(`${prefix}`, controllerInstance.all)
        .get(
            `${prefix}/classes`,
            { preHandler: [auth_middleware] },
            controllerInstance.classes,
        )
        .get(`${prefix}/just-check/:id`, controllerInstance.just_check)
        .get(
            `${prefix}/children-details/:id`,
            controllerInstance.children_details,
        )
        .get(
            `${prefix}/pre-info`,
            { preHandler: [auth_middleware] },
            controllerInstance.pre_info,
        )
        .get(
            `${prefix}/fees-categories-student/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.fees_categories_second,
        )
        .get(
            `${prefix}/fees-dues-student/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.fees_categories_one,
        )
        .get(
            `${prefix}/fees-categories-student`,
            { preHandler: [auth_middleware] },
            controllerInstance.fees_categories_third,
        )
        .get(
            `${prefix}/fees-categories/:id`,
            // { preHandler: [auth_middleware] },
            controllerInstance.fees_categories,
        )
        .get(
            `${prefix}/student-class/:id`,
            // { preHandler: [auth_middleware] },
            controllerInstance.student_class,
        )
        .get(
            `${prefix}/shifts`,
            { preHandler: [auth_middleware] },
            controllerInstance.shifts,
        )
        .get(
            `${prefix}/branches`,
            { preHandler: [auth_middleware] },
            controllerInstance.branches,
        )
        .get(
            `${prefix}/sections`,
            { preHandler: [auth_middleware] },
            controllerInstance.sections,
        )
        .get(
            `${prefix}/all-class`,
            { preHandler: [auth_middleware] },
            controllerInstance.all_class,
        )
        .get(
            `${prefix}/all-class-admin`,
            { preHandler: [auth_middleware] },
            controllerInstance.all_class_admin,
        )
        .get(
            `${prefix}/class-routine/:id`,
            controllerInstance.class_routine_details,
        )
        .get(
            `${prefix}/class-wise-student/:id`,
            controllerInstance.class_wise_student,
        )
        .get(
            `${prefix}/parent/childrens`,
            { preHandler: [auth_middleware] },
            controllerInstance.childrens,
        )
        .get(`${prefix}/:id`, controllerInstance.find)
        .get(`${prefix}/class-details/:id`, controllerInstance.class_details)
        .get(`${prefix}/students/:id`, controllerInstance.find_student)
        .get(
            `${prefix}/academic-information/:id`,
            controllerInstance.academic_informations,
        )
        .get(
            `${prefix}/basic-information`,
            { preHandler: [auth_middleware] },
            controllerInstance.basic_informations,
        )
        .get(
            `${prefix}/basic-information/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.basic_informations_second,
        )
        .get(
            `${prefix}/stu-information`,
            { preHandler: [auth_middleware] },
            controllerInstance.stu_information,
        )
        .get(
            `${prefix}/documents`,
            { preHandler: [auth_middleware] },
            controllerInstance.documents,
        )
        .get(
            `${prefix}/documents/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.documents,
        )
        .get(
            `${prefix}/single-student-details/:id`,
            controllerInstance.single_student_details,
        )
        .get(`${prefix}/parents/:id`, controllerInstance.parents)
        .get(`${prefix}/skills/:id`, controllerInstance.skills)
        .get(`${prefix}/languages/:id`, controllerInstance.languages)
        .get(
            `${prefix}/contact-number`,
            { preHandler: [auth_middleware] },
            controllerInstance.contact_numbers,
        )
        .get(
            `${prefix}/contact-number/:id`,
            { preHandler: [auth_middleware] },
            controllerInstance.contact_numbers,
        )
        .get(
            `${prefix}/educational-background/:id`,
            controllerInstance.educational_backgrounds,
        )
        .get(
            `${prefix}/full-details`,
            { preHandler: [auth_middleware] },
            controllerInstance.full_details,
        )
        .get(
            `${prefix}/full-details/:id`,
            // { preHandler: [auth_middleware] },
            controllerInstance.full_details_second,
        )
        .post(`${prefix}/store`, controllerInstance.store)
        // .post(`${prefix}/update`, controllerInstance.update)
        .post(
            `${prefix}/update`,
            { preHandler: [auth_middleware] },
            controllerInstance.full_details_update,
        )
        .post(
            `${prefix}/profile-update`,
            { preHandler: [auth_middleware] },
            controllerInstance.profile_update,
        )
        .post(`${prefix}/soft-delete`, controllerInstance.soft_delete)
        .post(`${prefix}/restore`, controllerInstance.restore)
        .post(`${prefix}/destroy`, controllerInstance.destroy)
        .post(`${prefix}/import`, controllerInstance.import)
        .post(`${prefix}/login`, controllerInstance.login)
        .post(`${prefix}/forget`, controllerInstance.forget)
        .post(`${prefix}/change-password`, controllerInstance.change_password)
        .post(`${prefix}/logout`, controllerInstance.logout)
        .post(
            `${prefix}/admit`,
            { preHandler: [auth_middleware] },
            controllerInstance.admit_student,
        )
        .get(`${prefix}/:id/profile`, controllerInstance.profile);
};
