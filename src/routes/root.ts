'use strict';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import check_auth_and_redirect from '../modules/auth_management/authetication/services/check_auth_and_redirect';
import minified_view from '../helpers/minified_view';
import check_auth from '../modules/auth_management/authetication/services/check_auth';
import check_account_auth from '../modules/auth_management/authetication/services/check_account_auth';
import check_teacher_auth from '../modules/auth_management/authetication/services/check_teacher_auth';
import check_staff_auth from '../modules/auth_management/authetication/services/check_staff_auth';
import check_parent_auth from '../modules/auth_management/authetication/services/check_parent_auth';
import check_student_auth from '../modules/auth_management/authetication/services/check_student_auth';
import auth_middleware from '../modules/auth_management/authetication/services/auth_middleware';
import { request } from 'http';
// import check_is_admin_and_redirect from '../modules/user_management/user_admin/services/check_is_admin_and_redirect';
// const fs = require('node:fs');
module.exports = async function (fastify: FastifyInstance) {
    fastify
        .get('/', async (_req: FastifyRequest, reply: FastifyReply) => {
            return reply.view('auth/sms_home.ejs');
            // return reply.redirect('auth/account_login.ejs');
        })
        .get('/login', async (_req: FastifyRequest, reply: FastifyReply) => {
            // return reply.view('website/pages/login.ejs');
            console.log('super admin login url', request);

            return reply.view('auth/admin_login.ejs');
        })

        .get(
            '/super-admin',
            { preHandler: auth_middleware },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/super_admin_uni.ejs');
            },
        )

        .get(
            '/super-admin/login',
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('auth/super_admin_login.ejs');
            },
        )
        .get(
            '/admin',
            { preHandler: auth_middleware },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/admin.ejs');
            },
        )

        .get(
            '/admin/login',
            // { preHandler: check_is_admin_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('auth/admin_login.ejs');
            },
        )
        .get(
            '/student',
            // { preHandler: check_auth_and_redirect },
            // { preHandler: check_student_auth },
            { preHandler: auth_middleware },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/student_uni.ejs');
            },
        )
        .get(
            '/student/login',
            // { preHandler: check_auth_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('auth/student_login.ejs');
            },
        )
        .get(
            '/teacher',
            // { preHandler: check_auth_and_redirect },
            // { preHandler: check_teacher_auth },
            { preHandler: auth_middleware },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/teacher_uni.ejs');
            },
        )
        .get(
            '/teacher/login',
            // { preHandler: check_auth_and_redirect },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('auth/teacher_login.ejs');
            },
        )
        .get(
            '/admission-officer',
            // { preHandler: check_auth_and_redirect },
            // { preHandler: check_auth },
            { preHandler: auth_middleware },
            async (_req: FastifyRequest, reply: FastifyReply) => {
                return reply.view('dashboard/admission_officer_uni.ejs');
            },
        )

        .get(
            '/admission-officer/login',
            async (_req: FastifyRequest, reply: FastifyReply) => {
                // return reply.view('website/pages/login.ejs');
                return reply.view('auth/admission_officer_login.ejs');
            },
        );
};
