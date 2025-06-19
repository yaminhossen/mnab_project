'use strict';
import fastify, {
    FastifyReply,
    FastifyRequest,
    FastifyInstance,
} from 'fastify';
import all from './services/all';
import details from './services/details';
import soft_delete from './services/soft_delete';
import store from './services/store';
import { responseObject } from '../../common_types/object';
import update from './services/update';
import restore from './services/restore';
import destroy from './services/destroy';
import data_import from './services/import';
import task_assign from './services/task_assign';
import teacher_pending from './services/teacher_pending';
import teacher_complete from './services/teacher_complete';
import teacher_update from './services/teacher_update';
import task_assign_updated from './services/task_assign_update';
import task_details from './services/task_details';
import staff_pending from './services/staff_pending';
import staff_complete from './services/staff_complete';
import staff_update from './services/staff_update';
import teacher_tasks from './services/teacher_tasks';
import staff_task from './services/staff_task';

export default function (fastify: FastifyInstance) {
    return {
        all: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await all(fastify, req);
            res.code(data.status).send(data);
        },
        teacher_pending: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data: responseObject = await teacher_pending(fastify, req);
            res.code(data.status).send(data);
        },
        staff_pending: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await staff_pending(fastify, req);
            res.code(data.status).send(data);
        },
        teacher_tasks: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await teacher_tasks(fastify, req);
            res.code(data.status).send(data);
        },
        staff_task: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await staff_task(fastify, req);
            res.code(data.status).send(data);
        },
        staff_complete: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data: responseObject = await staff_complete(fastify, req);
            res.code(data.status).send(data);
        },
        teacher_complete: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data: responseObject = await teacher_complete(fastify, req);
            res.code(data.status).send(data);
        },

        find: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await details(fastify, req);
            res.code(data.status).send(data);
        },

        task_details: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await task_details(fastify, req);
            res.code(data.status).send(data);
        },

        store: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await store(fastify, req);
            res.code(data.status).send(data);
        },

        task_assign: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await task_assign(fastify, req);
            res.code(data.status).send(data);
        },

        task_assign_updated: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data: responseObject = await task_assign_updated(fastify, req);
            res.code(data.status).send(data);
        },

        update: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await update(fastify, req);
            res.code(data.status).send(data);
        },

        teacher_update: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data: responseObject = await teacher_update(fastify, req);
            res.code(data.status).send(data);
        },

        staff_update: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await staff_update(fastify, req);
            res.code(data.status).send(data);
        },

        soft_delete: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await soft_delete(fastify, req);
            res.code(data.status).send(data);
        },

        restore: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await restore(fastify, req);
            res.code(data.status).send(data);
        },

        destroy: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await destroy(fastify, req);
            res.code(data.status).send(data);
        },

        import: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await data_import(fastify, req);
            res.code(data.status).send(data);
        },

        // export: async function (req: FastifyRequest, res: FastifyReply) {},
    };
}
