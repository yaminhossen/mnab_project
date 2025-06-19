import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import response from '../helpers/response';
import { InferCreationAttributes, Op } from 'sequelize';
import custom_error from '../helpers/custom_error';
import error_trace from '../helpers/error_trace';
import moment from 'moment/moment';

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

    await body('email')
        .not()
        .isEmpty()
        .withMessage('the email field is required')
        .run(req);

    await body('email')
        .custom(async (email, { req }) => {
            const teacherId = req.body.id; // the ID of the user being updated
            console.log('validation teacherId', teacherId);

            const existing = await models.UserParentsModel.findOne({
                where: {
                    email,
                    id: { [Op.ne]: teacherId }, // EXCLUDE self
                },
            });

            if (existing) {
                throw new Error('Email already exists');
            }

            return true;
        })
        .run(req);

    // await body('phone_number')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the phone_number field is required')
    //     .run(req);

    await body('phone_number')
        .not()
        .isEmpty()
        .withMessage('the phone_number field is required')
        .bail()
        .matches(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/)
        .withMessage('Phone number must be a valid Bangladeshi number')
        .run(req);

    // await body('image')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the image field is required')
    //     .run(req);

    let result = await validationResult(req);

    return result;
}

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
    let model = new models.UserParentsModel();

    let password = null;
    if (body.password) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        password = await bcrypt.hash(body.password, saltRounds);
    }

    let image_path = '';

    if (body['image']?.ext) {
        image_path =
            'uploads/parents/' +
            moment().format('YYYYMMDDHHmmss') +
            body['image'].name;
        await (fastify_instance as any).upload(body['image'], image_path);
    }

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        let data = await models.UserParentsModel.findByPk(body.id);
        if (data) {
            let inputs: InferCreationAttributes<typeof model> = {
                id: body.id,
                name: body.name,
                email: body.email,
                phone_number: body.phone_number,
                image: image_path || data.image,
            };
            if (password) {
                inputs.password = password || data.password;
            }
            (await data.update(inputs)).save();
            let data2 = await models.UserParentInformationsModel.findOne({
                where: {
                    user_parent_id: body.id,
                },
            });
            if (data2) {
                let inputs2: InferCreationAttributes<typeof data2> = {
                    id: body.id,
                    parmenent_address:
                        body.parmenent_address || data2.parmenent_address,
                    present_address:
                        body.present_address || data2.present_address,
                    occupation: body.occupation || data2.occupation,
                };
                (await data2.update(inputs2)).save();
            }
            return response(200, 'data updated', data);
        } else {
            throw new custom_error(
                'data not found',
                404,
                'operation not possible',
            );
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default update;
