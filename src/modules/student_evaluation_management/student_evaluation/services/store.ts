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
async function validate(req: Request) {
    // await body('branch_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the branch_id field is required')
    //     .run(req);

    // await body('branch_student_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the branch_student_id field is required')
    //     .run(req);

    // await body('student_evaluation_criteria_id')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the student_evaluation_criteria_id field is required')
    //     .run(req);

    // await body('score')
    //     .not()
    //     .isEmpty()
    //     .withMessage('the score field is required')
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
    let data = new models.StudentEvaluationsModel();
    let user = (req as any).user;
    let auth_user = await models.BranchTeachersModel.findOne({
        where: {
            user_teacher_id: (req as any).user?.id || null,
        },
    });

    let student_evaluation: anyObject[] = [];
    for (let i = 0; i < parseInt(body.criteria_count); i++) {
        student_evaluation.push({
            student_evaluation_criteria_id: body[`criteria_id${i}`],
            score: body[`score${i}`],
        });
    }
    console.log('studnet evaluation ', body.student_id);
    let today = moment().format('YYYY-MM-DD');

    /** print request data into console */
    // console.clear();
    // (fastify_instance as any).print(inputs);

    /** store data into database */
    try {
        // ✅ First delete existing evaluations for that student and teacher
        await models.StudentEvaluationsModel.destroy({
            where: {
                branch_student_id: body.student_id,
                branch_teacher_id: user?.id,
            },
        });

        // ✅ Then insert fresh data
        for (const ss of student_evaluation) {
            await models.StudentEvaluationsModel.create({
                branch_id: auth_user?.branch_id || 1,
                branch_student_id: body.student_id,
                branch_teacher_id: user?.id || null,
                student_evaluation_criteria_id:
                    ss.student_evaluation_criteria_id,
                score: ss.score || null,
                creator: user?.id || null,
            });
        }
        /** ✅ Calculate total score */
        const all_evaluations = await models.StudentEvaluationsModel.findAll({
            where: {
                branch_student_id: body.student_id,
            },
        });

        let total_score = all_evaluations.reduce(
            (acc, curr) => acc + (curr.score || 0),
            0,
        );

        /** ✅ Divide by 5 */
        let final_score = total_score / 5;

        /** ✅ Insert or update overall evaluation */
        await models.StudentOverallEvaluationsModel.destroy({
            where: {
                branch_student_id: body.student_id,
            },
        });

        await models.StudentOverallEvaluationsModel.create({
            branch_id: auth_user?.branch_id || 1,
            branch_student_id: body.student_id,
            score: final_score,
            evaluation_date: today,
            creator: user?.id || null,
        });
        return response(201, 'Data created successfully', {});
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.body);
        throw new custom_error('server error', 500, error.message, uid);
    }
}

export default store;
