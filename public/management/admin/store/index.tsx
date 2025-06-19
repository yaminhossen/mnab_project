import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import commonStore from './slices/common_slice';
import user_admins_slice from '../views/pages/user_management/user_admins/config/store';
import user_teachers_slice from '../views/pages/user_management/user_teachers/config/store';
import user_students_slice from '../views/pages/user_management/user_students/config/store';
import user_branch_admins_slice from '../views/pages/user_management/user_branch_admins/config/store';
import branch_classes_slice from '../views/pages/class_management/branch_classes/config/store';
import branch_class_fee_types_slice from '../views/pages/class_management/branch_class_fee_types/config/store';
import branch_class_fee_discounts_slice from '../views/pages/class_management/branch_class_fee_discounts/config/store';
import branch_class_fee_waivers_slice from '../views/pages/class_management/branch_class_fee_waivers/config/store';
import branch_class_fees_slice from '../views/pages/class_management/branch_class_fees/config/store';
import branch_class_routine_day_times_slice from '../views/pages/class_management/branch_class_routine_day_times/config/store';
import branch_class_resources_slice from '../views/pages/class_management/branch_class_resources/config/store';
import branch_class_subjects_slice from '../views/pages/class_management/branch_class_subjects/config/store';
import meeting_agendas_slice from '../views/pages/meeting_management/meeting_agendas/config/store';
import meetings_slice from '../views/pages/meeting_management/meetings/config/store';
// import fees_collections_slice from '../views/pages/account_management/fees_collections/config/store';
// import journals_slice from '../views/pages/account_management/journals/config/store';
import academic_calendars_slice from '../views/pages/calendar_management/academic_calendars/config/store';
import academic_calendar_event_types_slice from '../views/pages/calendar_management/academic_calendar_event_types/config/store';
import tasks_slice from '../views/pages/todo_management/tasks/config/store';
import tasks_variant_slice from '../views/pages/todo_management/task_variants/config/store';
import tasks_group_slice from '../views/pages/todo_management/task_groups/config/store';
import branch_class_sections_slice from '../views/pages/class_management/branch_class_sections/config/store';
import notices_slice from '../views/pages/notice_management/notices/config/store';
import notice_categorys_slice from '../views/pages/notice_management/notice_categorys/config/store';
import faqs_slice from '../views/pages/notice_management/faqs/config/store';
import student_overall_evaluations_slice from '../views/pages/student_kpi_management/student_overall_evaluations/config/store';
import student_evaluation_criterias_slice from '../views/pages/student_kpi_management/student_evaluation_criterias/config/store';
import exams_slice from '../views/pages/class_management/exams/config/store';
import exam_routines_slice from '../views/pages/class_management/exam_routines/config/store';
import policies_slice from '../views/pages/notice_management/policies/config/store';
import contact_supports_slice from '../views/pages/notice_management/contact_supports/config/store';
import leave_applications_slice from '../views/pages/notice_management/leave_applications/config/store';
import leave_types_slice from '../views/pages/notice_management/leave_types/config/store';

const store = configureStore({
    reducer: {
        common_store: commonStore.reducer,
        user_admins: user_admins_slice.reducer,
        user_teachers: user_teachers_slice.reducer,
        user_students: user_students_slice.reducer,
        user_branch_admins: user_branch_admins_slice.reducer,
        branch_classes: branch_classes_slice.reducer,
        branch_class_fee_types: branch_class_fee_types_slice.reducer,
        branch_class_fee_discounts: branch_class_fee_discounts_slice.reducer,
        branch_class_fee_waivers: branch_class_fee_waivers_slice.reducer,
        branch_class_fees: branch_class_fees_slice.reducer,
        branch_class_routine_day_times:
            branch_class_routine_day_times_slice.reducer,
        branch_class_resources: branch_class_resources_slice.reducer,
        branch_class_subjects: branch_class_subjects_slice.reducer,
        meeting_agendas: meeting_agendas_slice.reducer,
        meetings: meetings_slice.reducer,
        // fees_collections: fees_collections_slice.reducer,
        // journals: journals_slice.reducer,
        academic_calendars: academic_calendars_slice.reducer,
        academic_calendar_event_types:
            academic_calendar_event_types_slice.reducer,
        tasks: tasks_slice.reducer,
        task_variants: tasks_variant_slice.reducer,
        task_groups: tasks_group_slice.reducer,
        branch_class_sections: branch_class_sections_slice.reducer,
        notices: notices_slice.reducer,
        notice_categorys: notice_categorys_slice.reducer,
        faqs: faqs_slice.reducer,
        student_overall_evaluations: student_overall_evaluations_slice.reducer,
        student_evaluation_criterias:
            student_evaluation_criterias_slice.reducer,
        exams: exams_slice.reducer,
        exam_routines: exam_routines_slice.reducer,
        policies: policies_slice.reducer,
        contact_supports: contact_supports_slice.reducer,
        leave_applications: leave_applications_slice.reducer,
        leave_types: leave_types_slice.reducer,
    },
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export default store;
