import React from 'react';
import { initialState } from '../../config/store/inital_state';
import setup from '../../config/setup';
import { RootState } from '../../../../../../store';
import { useSelector } from 'react-redux';
import { CsvBuilder } from 'filefy';
import { anyObject } from '../../../../../../common_types/object';
import moment from 'moment/moment';

export interface Props {}

const ExportSelected: React.FC<Props> = () => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    function handle_export(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();

        // You can customize these columns including nested keys
        const columns = [
            'ID',
            'Name',
            'Email',
            'Phone',
            'Present Address',
            'Permanent Address',
            'Relative no',
            'District',
            'Post Code',
            'Gender',
            'Qualification',
            'Blood Group',
            'Is Married',
            'Joining Date',
        ];

        const rows: string[][] = state.selected.map((data: anyObject) => [
            `${data.id}`,
            data.name || '',
            data.email || '',
            data.phone_number || '',
            // data.role || '',
            data.teacher_infos?.present_address || 'N/A',
            data.teacher_infos?.parmenent_address || 'N/A',
            data.teacher_infos?.guardian_contact_number || 'N/A',
            data.teacher_infos?.district || 'N/A',
            data.teacher_infos?.post_code || 'N/A',
            data.teacher_infos?.gender || 'N/A',
            data.teacher_infos?.qualification || 'N/A',
            data.teacher_infos?.blood_group || 'N/A',
            data.teacher_infos?.is_married === true ? 'Married' : 'UnMarried',
            data.teachers?.joining_date || 'N/A',
            // data.staffs?.joining_date
            //     ? moment(data.staffs?.joining_date).format('YYYY-MM-DD')
            //     : 'N/A',
        ]);

        new CsvBuilder(`${setup.module_name}.csv`)
            .setColumns(columns)
            .addRows(rows)
            .exportFile();
    }

    if (!state.selected || state.selected.length === 0) {
        return null;
    }

    return (
        <a href="#" onClick={handle_export}>
            <span className="material-symbols-outlined fill">download</span>
            <div className="text">Export ({state.selected.length})</div>
        </a>
    );
};

export default ExportSelected;
