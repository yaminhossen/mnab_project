'use strict';
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { responseObject } from '../../common_types/object';
import login from './services/login';
import admission_login from './services/admission_login';
import account_login from './services/account_login';
import admin_login from './services/admin_login';
import super_admin_login from './services/super_admin_login';
import staff_login from './services/staff_login';
import teacher_login from './services/teacher_login';
import register from './services/register';
import forget from './services/forget';
import auth_user from './services/auth_user';
import logout from './services/logout';
import parent_login from './services/parent_login';
import student_login from './services/student_login';
const { serialize, parse } = require('@fastify/cookie');

export default function (fastify: FastifyInstance) {
    return {
        login: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await login(fastify, req);

            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 60_000,
            });
            // const cookie2 = serialize('token', 'kdlsfjdklsj', {
            //     maxAge: 60_000,
            // });

            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        admission_login: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data: responseObject = await admission_login(fastify, req);
            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 172800,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });

            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        account_login: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await account_login(fastify, req);
            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 172800,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });

            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        admin_loign: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await admin_login(fastify, req);
            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 172800,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });

            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        super_admin_login: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data: responseObject = await super_admin_login(fastify, req);
            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 172800,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });

            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        parent_login: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await parent_login(fastify, req);
            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 172800,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });

            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        student_login: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await student_login(fastify, req);
            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 172800,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });
            console.log('auth user middle check', req);
            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        staff_login: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await staff_login(fastify, req);
            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 172800,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });

            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        teacher_login: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await teacher_login(fastify, req);
            const cookie = serialize('token', 'Bearer ' + data.data.token, {
                maxAge: 172800,
                path: '/',
                httpOnly: false,
                sameSite: 'lax',
            });

            res.header('Set-Cookie', cookie);
            // res.header('Set-Cookie', cookie2);
            res.code(data.status).send(data);
        },

        logout: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await logout(fastify, req);
            res.clearCookie('token');
            res.code(data.status).send(data);
        },

        auth_user: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await auth_user(fastify, req);
            res.code(200).send(data);
        },

        register: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await register(fastify, req);
            res.code(data.status).send(data);
        },

        forget: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await forget(fastify, req);
            res.code(data.status).send(data);
        },
    };
}
