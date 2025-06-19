import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { body, validationResult } from 'express-validator';
import {
    anyObject,
    responseObject,
    Request,
} from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';

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

async function destroy(
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
        const classData = await models.BranchClassesModel.findOne({
            where: { id: body.id },
        });

        if (!classData) {
            throw new custom_error(
                'Class not found',
                404,
                'Operation not possible',
            );
        }

        // 1. Get all student infos linked to this class
        const studentInfos = await models.UserStudentInformationsModel.findAll({
            where: { s_class: body.id },
        });

        for (const info of studentInfos) {
            const studentId = info.user_student_id;

            // 1. Get all student parents linked to this student
            const parents = await models.UserStudentParentsModel.findAll({
                where: { user_student_id: studentId },
            });
            for (const parent of parents) {
                const parent_id = parent.user_parent_id;
                // 1.1. Delete user parent
                await models.UserParentsModel.destroy({
                    where: { id: parent_id },
                });
                // 1.2. Delete  parent information
                await models.UserParentInformationsModel.destroy({
                    where: { user_parent_id: parent_id },
                });
                // 1.3. Delete user student parent
                await parent.destroy();
            }

            // Delete other student-related data
            await Promise.all([
                models.UserStudentComplainReviewsModel.destroy({
                    where: { user_student_id: studentId },
                }),
                models.UserStudentContactNumbersModel.destroy({
                    where: { user_student_id: studentId },
                }),
                models.UserStudentDocumentTitlesModel.destroy({
                    where: { user_student_id: studentId },
                }),
                models.UserStudnetDocumentValuesModel.destroy({
                    where: { user_student_id: studentId },
                }),
                models.UserStudentEducationBackgroundsModel.destroy({
                    where: { user_student_id: studentId },
                }),
                models.UserStudentHostelsModel.destroy({
                    where: { user_student_id: studentId },
                }),
                models.UserStudentLanguagesModel.destroy({
                    where: { user_student_id: studentId },
                }),
                models.UserStudentSkillsModel.destroy({
                    where: { user_student_id: studentId },
                }),
                info.destroy(),
            ]);
        }

        // 1. Get all student infos linked to this class
        const routines_info = await models.BranchClassRoutinesModel.findAll({
            where: { branch_class_id: body.id },
        });

        for (const routine of routines_info) {
            const routineId = routine.id;

            // 1. Get all student parents linked to this student
            const r_days = await models.BranchClassRoutineDayTimesModel.destroy(
                {
                    where: { branch_class_routine_id: routineId },
                },
            );

            // 4. Delete student info
            await routine.destroy();
        }

        /** Delete other related class data */
        await Promise.all([
            models.BranchClassSubjecsModel.destroy({
                where: { branch_class_id: body.id },
            }),
            models.BranchClassSubjectTeachersModel.destroy({
                where: { branch_class_id: body.id },
            }),
            models.BranchClassStudentsModel.destroy({
                where: { branch_class_id: body.id },
            }),
            models.BranchClassSectionsModel.destroy({
                where: { branch_class_id: body.id },
            }),
            models.BranchClassResourcesModel.destroy({
                where: { branch_class_id: body.id },
            }),
            models.BranchClassFeesModel.destroy({
                where: { branch_class_id: body.id },
            }),
            models.BranchClassFeesTypesModel.destroy({
                where: { branch_class_id: body.id },
            }),
        ]);
        // 7. Finally, delete the class itself
        await classData.destroy();
        return response(200, 'data permanently deleted', {});
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

export default destroy;
