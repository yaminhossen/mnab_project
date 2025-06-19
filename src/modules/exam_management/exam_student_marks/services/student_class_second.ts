import db from '../models/db';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { responseObject } from '../../../common_types/object';
import response from '../helpers/response';
import error_trace from '../helpers/error_trace';
import custom_error from '../helpers/custom_error';

async function student_class_second(
    fastify_instance: FastifyInstance,
    req: FastifyRequest,
): Promise<responseObject> {
    let models = await db();
    let branchClassSubjectsModel = models.BranchClassSubjectsModel;
    // let branchClassRoutinesModel = models.BranchClassRoutinesModel;
    // let branchClassRoutineDayTimesModel =
    //     models.BranchClassRoutineDayTimesModel;
    // let buildingRoomsModel = models.BranchBuildingRoomsModel;
    // let hallGuardPlansModel = models.ExamGuardPlansModel;
    let examsModel = models.ExamsModel;
    let examMarksModel = models.ExamStudentMarksModel;
    let branchClassesModel = models.BranchClassesModel;
    let params = req.params as any;
    let user = (req as any).user;
    // let auth_user = await models.BranchAdminsModel.findOne({
    //     where: {
    //         user_admin_id: (req as any).user?.id || null,
    //     },
    // });
    console.log('class user', user);

    try {
        let data = await examMarksModel.findAll({
            where: {
                // class_id: 1,
                student_id: params?.id,
            },
            include: [
                {
                    model: branchClassesModel,
                    as: 'a_class',
                    attributes: {
                        include: [
                            // Subquery to count students for each class
                            [
                                models.sequelize.literal(`(
                                    SELECT COUNT(*)
                                    FROM user_student_informations
                                    WHERE user_student_informations.s_class = a_class.id
                                )`),
                                'student_count',
                            ],
                        ],
                    },
                },
            ],
            attributes: {
                exclude: ['password'],
            },
        });
        if (data) {
            const groupedData = data.reduce((acc: any, item: any) => {
                const classId = item.a_class.id;

                if (!acc[classId]) {
                    acc[classId] = item.a_class;
                }

                return acc;
            }, {});

            const responseData = Object.values(groupedData);

            return response(200, 'data found', responseData);
        } else {
            throw new custom_error('not found', 404, 'data not found');
        }
    } catch (error: any) {
        let uid = await error_trace(models, error, req.url, req.params);
        if (error instanceof custom_error) {
            error.uid = uid;
        } else {
            throw new custom_error('server error', 500, error.message, uid);
        }
        throw error;
    }
}

export default student_class_second;
