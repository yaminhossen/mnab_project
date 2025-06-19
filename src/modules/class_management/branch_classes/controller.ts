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
import all_class from './services/all_class';
import data_import from './services/import';
import branch_class_wise_student from './services/branch_class_wise_student';
import class_routine from './services/class_routine';
import class_wise_subject from './services/class_wise_subject';
import class_routine_auth from './services/class_routine_auth';

export default function (fastify: FastifyInstance) {
    return {
        all: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await all(fastify, req);
            res.code(data.status).send(data);
        },

        all_class: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await all_class(fastify, req);
            res.code(data.status).send(data);
        },

        branch_class_wise_student: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data: responseObject = await branch_class_wise_student(
                fastify,
                req,
            );
            res.code(data.status).send(data);
        },

        find: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await details(fastify, req);
            res.code(data.status).send(data);
        },

        class_routine: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await class_routine(fastify, req);
            res.code(data.status).send(data);
        },

        class_routine_auth: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data = await class_routine_auth(fastify, req);
            res.code(data.status).send(data);
        },

        class_wise_subject: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data = await class_wise_subject(fastify, req);
            res.code(data.status).send(data);
        },

        store: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await store(fastify, req);
            res.code(data.status).send(data);
        },

        update: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await update(fastify, req);
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
