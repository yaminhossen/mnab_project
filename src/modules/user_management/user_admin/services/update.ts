import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import response from '../helpers/response';
import { InferCreationAttributes } from 'sequelize';
import custom_error from '../helpers/custom_error';
import error_trace from '../helpers/error_trace';
import moment from 'moment/moment';

/** validation rules */
async function validate(req: Request, models: any) {
    await body('id')
        .not()
        .isEmpty()
        .withMessage('the id field is required')
        .run(req);

    await body('name')
        .not()
        .isEmpty()
        .withMessage('the name field is required')
        .run(req);

    if (req.body?.email)
        await body('phone_number')
            .not()
            .isEmpty()
            .withMessage('the phone_number field is required')
            .bail()
            .matches(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/)
            .withMessage('Phone number must be a valid Bangladeshi number')
            .run(req);

    if (req.body?.password) {
        await body('password')
            .not()
            .isEmpty()
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters')
            // .withMessage('the password field is required')
            .run(req);
    }

    let result = await validationResult(req);

    return result;
}

// async function update(
//     fastify_instance: FastifyInstance,
//     req: FastifyRequest,
// ): Promise<responseObject> {
//     throw new Error('500 test');
// }

async function update(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** validation */
    let models = await db();
    let validate_result = await validate(req as Request, models);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    /** initializations */
    let body = req.body as anyObject;
    let model = new models.UserAdminsModel();
    let t_model = new models.UserTeachersModel();
    let s_model = new models.UserStaffsModel();

    let password = null;
    if (body.password) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        password = await bcrypt.hash(body.password, saltRounds);
    }
    let image_path = '';

    if (body['image']?.ext) {
        image_path =
            'uploads/admins/' +
            moment().format('YYYYMMDDHHmmss') +
            body['image'].name;
        await (fastify_instance as any).upload(body['image'], image_path);
    }

    // if (password) {
    //     inputs.password = password;
    // }

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        const data = await models.UserAdminsModel.findByPk(body.id);

        if (!data) {
            throw new custom_error(
                'User not found',
                404,
                'operation not possible',
            );
        }

        if (data.type === 'admin') {
            const inputs: InferCreationAttributes<typeof model> = {
                branch_id: data.branch_id || 1,
                name: body.name || data.name,
                email: body.email || data.email,
                role: 'admin',
                type: 'admin',
                phone_number: body.phone_number || data.phone_number,
                image: image_path || data.image,
                password: password || data.password,
            };

            await data.update(inputs);
            return response(201, 'Admin data updated', data);
        }

        if (data.type === 'teacher') {
            const teacher = await models.UserTeachersModel.findByPk(
                data.teacher_id,
            );
            if (!teacher) {
                throw new custom_error(
                    'Admin not found',
                    404,
                    'operation not possible',
                );
            }

            const t_inputs: InferCreationAttributes<typeof t_model> = {
                name: body.name || teacher.name,
                email: body.email || teacher.email,
                phone_number: body.phone_number || teacher.phone_number,
                image: image_path || teacher.image,
                role_2: body.role || data.role,
                password: password || teacher.password,
            };

            await teacher.update(t_inputs);

            const inputs: InferCreationAttributes<typeof model> = {
                branch_id: body.branch_id || data.branch_id,
                name: body.name || data.name,
                email: body.email || data.email,
                role: body.role || data.role,
                type: 'teacher',
                phone_number: body.phone_number || data.phone_number,
                image: image_path || data.image,
                password: password || data.password,
            };

            await data.update(inputs);

            return response(201, 'Admin updated', data);
        }
        if (data.type === 'staff') {
            const staff = await models.UserStaffsModel.findByPk(data.staff_id);
            if (!staff) {
                throw new custom_error(
                    'Admin not found',
                    404,
                    'operation not possible',
                );
            }

            const s_inputs: InferCreationAttributes<typeof s_model> = {
                name: body.name || staff.name,
                email: body.email || staff.email,
                phone_number: body.phone_number || staff.phone_number,
                image: image_path || staff.image,
                role_2: body.role || data.role,
                password: password || staff.password,
            };

            await staff.update(s_inputs);

            const inputs: InferCreationAttributes<typeof model> = {
                branch_id: body.branch_id || data.branch_id,
                name: body.name || data.name,
                email: body.email || data.email,
                role: body.role || data.role,
                type: 'staff',
                phone_number: body.phone_number || data.phone_number,
                image: image_path || data.image,
                password: password || data.password,
            };

            await data.update(inputs);

            return response(201, 'Admin updated', data);
        }

        // If none matched
        throw new custom_error(
            'User type not handled',
            400,
            'operation not possible',
        );
    } catch (error: any) {
        const uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
            throw error;
        } else {
            throw new custom_error('Server error', 500, error.message, uid);
        }
    }
}

export default update;
