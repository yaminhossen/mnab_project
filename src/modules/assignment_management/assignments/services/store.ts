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

async function validate(req: Request) {
    await body('class')
        .not()
        .isEmpty()
        .withMessage('the class field is required')
        .run(req);

    await body('subject')
        .not()
        .isEmpty()
        .withMessage('the subject field is required')
        .run(req);

    await body('title')
        .not()
        .isEmpty()
        .withMessage('the title field is required')
        .run(req);
    await body('attachment')
        .not()
        .isEmpty()
        .withMessage('the attachment field is required')
        .run(req);
    await body('mark')
        .not()
        .isEmpty()
        .withMessage('the mark field is required')
        .run(req);
    await body('deadline')
        .not()
        .isEmpty()
        .withMessage('the deadline field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}

async function store(
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
    let data = new models.AssignmentsModel();
    let image_path = '';
    let user = (req as any).user;
    // console.log('auth user', user);

    let auth_user = await models.BranchTeachersModel.findOne({
        where: {
            user_teacher_id: user?.id || null,
        },
    });

    if (body['attachment']?.ext) {
        image_path =
            'uploads/teachers/' +
            moment().format('YYYYMMDDHHmmss') +
            body['attachment'].name;
        await (fastify_instance as any).upload(body['attachment'], image_path);
    }

    let inputs: InferCreationAttributes<typeof data> = {
        branch_id: auth_user?.branch_id || 1,
        title: body.title,
        description: body.description,
        // assignment_categories_id: body.assignment_categories_id,
        attachment: image_path,
        image: body.image,
        mark: body.mark,
        class_id: body.class,
        subject_id: body.subject,
        teacher_id: user?.id || null,
        deadline: body.deadline,
        creator: user?.id || null,
    };

    console.log('update body', body);
    console.log('attachemetn', image_path);

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        (await data.update(inputs)).save();
        // let task = await data.save();
        return response(200, 'data created', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
