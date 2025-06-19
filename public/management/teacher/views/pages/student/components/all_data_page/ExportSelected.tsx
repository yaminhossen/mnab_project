import React from 'react';
import { initialState } from '../../config/store/inital_state';
import setup from '../../config/setup';
import { RootState } from '../../../../../store';
import { useSelector } from 'react-redux';
import { CsvBuilder } from 'filefy';
import { anyObject } from '../../../../../common_types/object';
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
            'Serial',
            'Name',
            'Email',
            'Phone',
            'Present Address',
            'Permanent Address',
            'Id',
            'Blood Group',
            'Roll',
            'Section',
            'Class',
        ];

        const rows: string[][] = state.selected.map(
            (data: anyObject, index) => [
                `${index + 1}`,
                data.branchstudent?.name || 'not found',
                data.branchstudent?.email || 'not found',
                data.branchstudent?.phone_number || 'not found',
                data.infostudent?.present_address || 'not found',
                data.infostudent?.permanent_address || 'not found',
                data.infostudent?.student_id || 'not found',
                data.infostudent?.blood_group || 'not found',
                data.infostudent?.role_no || 'not found',
                data.infostudent?.section || 'not found',
                data.infostudent.class?.name || 'not found',
                // data.staffs?.joining_date
                //     ? moment(data.staffs?.joining_date).format('YYYY-MM-DD')
                //     : 'N/A',
            ],
        );

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
