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
    await body('name')
        .not()
        .isEmpty()
        .withMessage('the name field is required')
        .run(req);

    await body('email')
        .not()
        .isEmpty()
        .withMessage('the email field is required')
        .run(req);

    await body('email')
        .custom(async (email) => {
            const existing = await models.UserAdminsModel.findOne({
                where: { email },
            });
            if (existing) {
                throw new Error('Email already exists');
            }
            return true;
        })
        .run(req);

    await body('phone_number')
        .not()
        .isEmpty()
        .withMessage('the phone_number field is required')
        .bail()
        .matches(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/)
        .withMessage('Phone number must be a valid Bangladeshi number')
        .run(req);

    await body('password')
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        // .withMessage('the password field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}
// async function store(
//     fastify_instance: FastifyInstance,
//     req: FastifyRequest,
// ): Promise<responseObject> {
//     throw new Error('500 test');
// }
async function store(
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
    let data = new models.UserAdminsModel();
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    let password = await bcrypt.hash(body.password, saltRounds);
    let image_path = '';

    if (body['image']?.ext) {
        image_path =
            'uploads/admins/' +
            moment().format('YYYYMMDDHHmmss') +
            body['image'].name;
        await (fastify_instance as any).upload(body['image'], image_path);
    }

    let inputs: InferCreationAttributes<typeof data> = {
        branch_id: 1,
        name: body.name,
        email: body.email,
        role: 'admin',
        type: 'admin',
        phone_number: body.phone_number,
        image: image_path,
        password: password,
    };
    console.log('body darta', body);

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        (await data.update(inputs)).save();
        return response(201, 'data created', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
