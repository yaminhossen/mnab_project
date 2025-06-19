import React, { useRef } from 'react';
import { anyObject } from '../../../../../common_types/object';
import setup from '../../config/setup';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import DestroyButton from './DestroyButton';
import RestoreButton from './RestoreButton';
import active_row from '../../helpers/table_active_row';
export interface Props {
    item: anyObject;
}
const TableRowAction: React.FC<Props> = ({ item }: Props) => {
    const toggle_icon = useRef<HTMLElement | null>(null);

    return (
        <>
            <span
                className="icon"
                ref={toggle_icon}
                onClick={(e) => active_row(toggle_icon, e)}
            />
            <div className="table_action_btns">
                <ul>
                    <li>
                        <Link to={`/students/single/student/${item.branch_student_id}`}>
                            Show
                        </Link>
                    </li>
                    <li>
                        <Link to={`/students/edit/${item.branch_student_id}`}>
                            Edit
                        </Link>
                    </li>
                    <li>
                        <DeleteButton item={item} />
                    </li>
                    <li>
                        <DestroyButton item={item} />
                    </li>
                    <li>
                        <RestoreButton item={item} />
                    </li>
                </ul>
            </div>
        </>
    );
};

export default TableRowAction;
