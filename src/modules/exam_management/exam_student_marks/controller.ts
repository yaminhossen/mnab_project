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
import mark_details from './services/exam_marks_details';
import mark_store from './services/mark_store';
import student_class from './services/student_class';
import class_wise_exam from './services/class_wise_exam';
import exam_wise from './services/exam_wise';
import student_class_second from './services/student_class_second';
import class_wise_exam_second from './services/class_wise_exam_second';
import exam_wise_second from './services/exam_wise_second';

export default function (fastify: FastifyInstance) {
    return {
        all: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await all(fastify, req);
            res.code(data.status).send(data);
        },

        find: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await details(fastify, req);
            res.code(data.status).send(data);
        },

        mark_details: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await mark_details(fastify, req);
            res.code(data.status).send(data);
        },

        student_class: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await student_class(fastify, req);
            res.code(data.status).send(data);
        },

        student_class_second: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data = await student_class_second(fastify, req);
            res.code(data.status).send(data);
        },

        class_wise_exam: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data = await class_wise_exam(fastify, req);
            res.code(data.status).send(data);
        },

        class_wise_exam_second: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data = await class_wise_exam_second(fastify, req);
            res.code(data.status).send(data);
        },

        exam_wise: async function (req: FastifyRequest, res: FastifyReply) {
            let data = await exam_wise(fastify, req);
            res.code(data.status).send(data);
        },

        exam_wise_second: async function (
            req: FastifyRequest,
            res: FastifyReply,
        ) {
            let data = await exam_wise_second(fastify, req);
            res.code(data.status).send(data);
        },

        store: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await store(fastify, req);
            res.code(data.status).send(data);
        },

        mark_store: async function (req: FastifyRequest, res: FastifyReply) {
            let data: responseObject = await mark_store(fastify, req);
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
