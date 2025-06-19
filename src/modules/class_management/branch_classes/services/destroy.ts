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

async function validate(req: Request) {
    await body('id')
        .notEmpty()
        .withMessage('The id field is required')
        .run(req);
    return validationResult(req);
}

async function destroy(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    const validate_result = await validate(req as Request);
    if (!validate_result.isEmpty()) {
        return response(422, 'Validation error', validate_result.array());
    }

    const models = await db();
    const body = req.body as { [key: string]: any };

    const transaction = await models.sequelize.transaction();

    try {
        const classData = await models.BranchClassesModel.findOne({
            where: { id: body.id },
            transaction,
        });

        if (!classData) {
            throw new custom_error(
                'Class not found',
                404,
                'Operation not possible',
            );
        }

        const studentInfos = await models.UserStudentInformationsModel.findAll({
            where: { s_class: body.id },
            transaction,
        });

        for (const info of studentInfos) {
            const studentId = info.user_student_id;

            const parents = await models.UserStudentParentsModel.findAll({
                where: { user_student_id: studentId },
                transaction,
            });

            for (const parent of parents) {
                const parentId = parent.user_parent_id;

                await models.UserParentsModel.destroy({
                    where: { id: parentId },
                    transaction,
                });
                await models.UserParentInformationsModel.destroy({
                    where: { user_parent_id: parentId },
                    transaction,
                });
                await parent.destroy({ transaction });
            }

            await Promise.all([
                models.UserStudentComplainReviewsModel.destroy({
                    where: { user_student_id: studentId },
                    transaction,
                }),
                models.UserStudentContactNumbersModel.destroy({
                    where: { user_student_id: studentId },
                    transaction,
                }),
                models.UserStudentDocumentTitlesModel.destroy({
                    where: { user_student_id: studentId },
                    transaction,
                }),
                models.UserStudnetDocumentValuesModel.destroy({
                    where: { user_student_id: studentId },
                    transaction,
                }),
                models.UserStudentEducationBackgroundsModel.destroy({
                    where: { user_student_id: studentId },
                    transaction,
                }),
                models.UserStudentHostelsModel.destroy({
                    where: { user_student_id: studentId },
                    transaction,
                }),
                models.UserStudentLanguagesModel.destroy({
                    where: { user_student_id: studentId },
                    transaction,
                }),
                models.UserStudentSkillsModel.destroy({
                    where: { user_student_id: studentId },
                    transaction,
                }),
            ]);

            await info.destroy({ transaction });
        }

        const routines = await models.BranchClassRoutinesModel.findAll({
            where: { branch_class_id: body.id },
            transaction,
        });

        for (const routine of routines) {
            await models.BranchClassRoutineDayTimesModel.destroy({
                where: { branch_class_routine_id: routine.id },
                transaction,
            });

            await routine.destroy({ transaction });
        }

        await Promise.all([
            models.BranchClassSubjecsModel.destroy({
                where: { branch_class_id: body.id },
                transaction,
            }),
            models.BranchClassSubjectTeachersModel.destroy({
                where: { branch_class_id: body.id },
                transaction,
            }),
            models.BranchClassStudentsModel.destroy({
                where: { branch_class_id: body.id },
                transaction,
            }),
            models.BranchClassSectionsModel.destroy({
                where: { branch_class_id: body.id },
                transaction,
            }),
            models.BranchClassResourcesModel.destroy({
                where: { branch_class_id: body.id },
                transaction,
            }),
            models.BranchClassFeesModel.destroy({
                where: { branch_class_id: body.id },
                transaction,
            }),
            models.BranchClassFeesTypesModel.destroy({
                where: { branch_class_id: body.id },
                transaction,
            }),
            models.ExamRoutinesModel.destroy({
                where: { class_id: body.id },
                transaction,
            }),
        ]);

        await classData.destroy({ transaction });

        await transaction.commit();
        return response(200, 'Data permanently deleted', {});
    } catch (error: any) {
        await transaction.rollback();

        const uid = await error_trace(models, error, req.url, req.body);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('Server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default destroy;
