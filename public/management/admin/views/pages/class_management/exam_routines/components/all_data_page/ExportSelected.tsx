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
        const columns = ['ID', 'Class', 'Date'];

        const rows: string[][] = state.selected.map((data: anyObject) => [
            `${data.id}`,
            data.class?.name || 'Not found',
            data.date || '',
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
