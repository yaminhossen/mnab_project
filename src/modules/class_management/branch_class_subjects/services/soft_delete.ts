import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import { responseObject, Request } from '../../../common_types/object';
import response from '../helpers/response';
import custom_error from '../helpers/custom_error';
import error_trace from '../helpers/error_trace';

/** validation rules */
async function validate(req: Request) {
    await body('id')
        .not()
        .isEmpty()
        .withMessage('the id field is required')
        .run(req);

    let result = await validationResult(req);

    return result;
}

async function soft_delete(
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
    let body = req.body as { [key: string]: any };

    try {
        // Fetch all related data
        const subject = await models.BranchClassSubjectsModel.findOne({
            where: { id: body.id },
        });

        const routine = await models.BranchClassRoutinesModel.findOne({
            where: { branch_class_subject_id: body.id },
        });

        const dayTimes = await models.BranchClassRoutineDayTimesModel.findAll({
            where: { branch_class_subject_id: body.id },
        });

        const examRoutines = await models.ExamRoutinesModel.findAll({
            where: { subject_id: body.id },
        });

        // Check if the main subject exists
        if (!subject) {
            throw new custom_error(
                'data not found',
                404,
                'operation not possible',
            );
        }

        // Deactivate main subject
        subject.status = 'deactive';
        await subject.save();

        // Deactivate routine if exists
        if (routine) {
            routine.status = 'deactive';
            await routine.save();
        }

        // Deactivate all dayTimes entries
        if (dayTimes && dayTimes.length > 0) {
            for (const dayTime of dayTimes) {
                dayTime.status = 'deactive';
                await dayTime.save();
            }
        }

        // Deactivate all dayTimes entries
        if (examRoutines && examRoutines.length > 0) {
            for (const routine of examRoutines) {
                routine.status = 'deactive';
                await routine.save();
            }
        }

        return response(205, 'All related data deactivated', subject);
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

export default soft_delete;
