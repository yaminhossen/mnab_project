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
    // await body('branch_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the branch_id field is required')
    //     .run(req);

    // await body('assignment_categories_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the assignment_categories_id field is required')
    //     .run(req);

    // await body('class_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the class_id field is required')
    //     .run(req);
    // await body('student_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the student_id field is required')
    //     .run(req);
    // await body('assignment_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the assignment_id field is required')
    //     .run(req);
    await body('attachment')
        .not()
        .isEmpty()
        .withMessage('the attachment field is required')
        .run(req);
    // await body('image')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the image field is required')
    //     .run(req);
    // await body('marks')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the marks field is required')
    //     .run(req);
    // await body('text')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the text field is required')
    //     .run(req);
    // await body('comments')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the comments field is required')
    //     .run(req);
    await body('submission_date')
        .not()
        .isEmpty()
        .withMessage('the submission_date field is required')
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
    let data = new models.AssignmentSubmissionsModel();
    let image_path = '';
    let params = req.params as any;
    let user = (req as any).user;

    if (body['attachment']?.ext) {
        image_path =
            'uploads/assignments/' +
            moment().format('YYYYMMDDHHmmss') +
            body['attachment'].name;
        await (fastify_instance as any).upload(body['attachment'], image_path);
    }
    let data1 = await models.AssignmentsModel.findOne({
        where: {
            id: body.id,
        },
    });
    console.log(
        'params i-----------------------------------------------------------------------------------d',
        params,
    );

    let inputs: InferCreationAttributes<typeof data> = {
        branch_id: data1?.branch_id,
        // assignment_categories_id: data1?.assignment_categories_id,
        class_id: data1?.class_id,
        student_id: user?.id || null,
        teacher_id: data1?.teacher_id,
        subject_id: data1?.subject_id,
        assignment_id: body.id,
        attachment: image_path,
        // text: body.text,
        // image: body.image,
        comments: body.comments,
        marks: body.marks,
        submission_date: body.submission_date,
    };

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        let data2 = await models.AssignmentSubmissionsModel.findOne({
            where: {
                student_id: user?.id,
                assignment_id: body.id,
            },
            attributes: {
                exclude: ['password'],
            },
        });
        if (data2) {
            if (data2.marks > 0) {
                return response(200, 'already marked', data2);
            } else {
                await data2.update(inputs);
                return response(200, 'data updated', data2);
            }
        } else {
            (await data.update(inputs)).save();
        }
        return response(200, 'data created', data);
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
