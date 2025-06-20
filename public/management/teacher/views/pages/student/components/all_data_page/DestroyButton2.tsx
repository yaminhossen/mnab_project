import React from 'react';
import setup from '../../config/setup';
import { anyObject } from '../../../../../common_types/object';
import { useAppDispatch } from '../../../../../store';
import { destroy } from '../../config/store/async_actions/destroy';
export interface Props {
    item: anyObject;
}

const DestroyButton2: React.FC<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    async function handle_delete(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();

        let confirm = await (window as anyObject).s_confirm(
            'Delete permanently.',
        );
        if (confirm) {
            dispatch(destroy({ id: props.item.branch_student_id }) as any);
        }
    }
    return (
        <>
            <a
                onClick={(e) => handle_delete(e)}
                href={`/${setup.route_prefix}/destroy/${props.item.branch_student_id}`}
            >
                Destroy
            </a>
        </>
    );
};

export default DestroyButton2;
