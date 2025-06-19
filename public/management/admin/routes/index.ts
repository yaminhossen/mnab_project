import { NonIndexRouteObject } from 'react-router-dom';
import DashboardLayout from '../views/layouts/DashboardLayout';
import T1 from '../views/pages/T1';
import user_admins_routes from "../views/pages/user_management/user_admins/config/routes";
import user_teachers_routes from "../views/pages/user_management/user_teachers/config/routes";
import user_students_routes from "../views/pages/user_management/user_students/config/routes";
import user_branch_admins_routes from "../views/pages/user_management/user_branch_admins/config/routes";
import branch_classes_routes from "../views/pages/class_management/branch_classes/config/routes";
import branch_class_fee_types_routes from "../views/pages/class_management/branch_class_fee_types/config/routes";
import branch_class_fee_discounts_routes from "../views/pages/class_management/branch_class_fee_discounts/config/routes";
import branch_class_fee_waivers_routes from "../views/pages/class_management/branch_class_fee_waivers/config/routes";
import branch_class_fees_routes from "../views/pages/class_management/branch_class_fees/config/routes";
import branch_class_routine_day_times_routes from "../views/pages/class_management/branch_class_routine_day_times/config/routes";
import branch_class_resources_routes from "../views/pages/class_management/branch_class_resources/config/routes";
import branch_class_subjects_routes from "../views/pages/class_management/branch_class_subjects/config/routes";
import meeting_agendas_routes from "../views/pages/meeting_management/meeting_agendas/config/routes";
import meetings_routes from "../views/pages/meeting_management/meetings/config/routes";
// import journals_routes from "../views/pages/account_management/journals/config/routes";
import academic_calendars_routes from "../views/pages/calendar_management/academic_calendars/config/routes";
import academic_calendar_event_types_routes from "../views/pages/calendar_management/academic_calendar_event_types/config/routes";
import tasks_routes from "../views/pages/todo_management/tasks/config/routes";
import task_variants_routes from "../views/pages/todo_management/task_variants/config/routes";
import task_groups_routes from "../views/pages/todo_management/task_groups/config/routes";
import branch_class_sections_routes from "../views/pages/class_management/branch_class_sections/config/routes";
import notices_routes from "../views/pages/notice_management/notices/config/routes";
import notice_categorys_routes from "../views/pages/notice_management/notice_categorys/config/routes";
import faqs_routes from "../views/pages/notice_management/faqs/config/routes";
import settings_routes from "../views/pages/notice_management/settings/config/routes";
import student_overall_evaluation_routes from "../views/pages/student_kpi_management/student_overall_evaluations/config/routes";
import student_evaluation_criterias_routes from "../views/pages/student_kpi_management/student_evaluation_criterias/config/routes";
import exams_routes from "../views/pages/class_management/exams/config/routes";
import exam_routines_routes from "../views/pages/class_management/exam_routines/config/routes";
import policies_routes from "../views/pages/notice_management/policies/config/routes";
import contact_supports_routes from "../views/pages/notice_management/contact_supports/config/routes";
import leave_applications_routes from "../views/pages/notice_management/leave_applications/config/routes";
import leave_types_routes from "../views/pages/notice_management/leave_types/config/routes";

interface RouteTypes extends NonIndexRouteObject {
    
}
const router: RouteTypes[] = [
    {
        path: '/',
        element: <DashboardLayout/>,
        children: [
            {
                path: '',
                element: <T1/>
            },
            {
                path: '/management',
                element: <T1/>
            },
            user_admins_routes,
            user_teachers_routes,
            user_students_routes,
            user_branch_admins_routes,
            branch_classes_routes,
            branch_class_fee_types_routes,
            branch_class_fee_discounts_routes,
            branch_class_fee_waivers_routes,
            branch_class_fees_routes,
            branch_class_routine_day_times_routes,
            branch_class_subjects_routes,
            branch_class_resources_routes,
            meeting_agendas_routes,
            meetings_routes,
            academic_calendars_routes,
            academic_calendar_event_types_routes,
            tasks_routes,
            task_variants_routes,
            task_groups_routes,
            branch_class_sections_routes,
            notices_routes,
            notice_categorys_routes,
            faqs_routes,
            settings_routes,
            student_overall_evaluation_routes,
            student_evaluation_criterias_routes,
            exams_routes,
            exam_routines_routes,
            policies_routes,
            contact_supports_routes,
            leave_applications_routes,
            leave_types_routes,
        ],
    },
];

export default router;
