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

/** validation rules */
async function validate(req: Request) {
    // await body('name')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the name field is required')
    //     .run(req);

    // await body('email')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the email field is required')
    //     .run(req);

    // await body('password')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the password field is required')
    //     .run(req);

    let result = await validationResult(req);

    return result;
}
// async function store(
//     fastify_instance: FastifyInstance,
//     req: FastifyRequest,
// ): Promise<responseObject> {
//     throw new Error('500 test');
// }
async function make_admin(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    /** validation */
    let validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'validation error', validate_result.array());
    }

    /** initializations */
    let models = await db();
    let body = req.body as anyObject;
    let data = new models.UserAdminsModel();
    let u_staff = new models.UserStaffsModel();
    let param = req.params as any;
    // const bcrypt = require('bcrypt');
    // const saltRounds = 10;
    // let password = await bcrypt.hash(body?.password, saltRounds);

    console.log('make admin run', param);

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** make_admin data into database */
    try {
        let staff = await models.UserStaffsModel.findOne({
            where: {
                id: param.id,
            },
        });
        let inputs2: InferCreationAttributes<typeof u_staff> = {
            role_2: 'admin',
        };
        if (staff) {
            let b_staff = await models.BranchStaffsModel.findOne({
                where: {
                    user_staff_id: param.id,
                },
            });
            let inputs: InferCreationAttributes<typeof data> = {
                branch_id: b_staff?.branch_id || 0,
                staff_id: param.id,
                name: staff?.name,
                email: staff?.email,
                phone_number: staff?.phone_number,
                image: staff?.image,
                password: staff?.password,
                role: 'admin',
                type: 'staff',
            };
            (await data.update(inputs)).save();
            (await staff.update(inputs2)).save();
        }

        return response(201, 'data created', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default make_admin;
