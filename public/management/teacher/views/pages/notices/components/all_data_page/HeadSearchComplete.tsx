import React, { ReactNode, Ref, useRef, useState } from 'react';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../../../store';
import setup from '../../config/setup';
import storeSlice from '../../config/store';
import { all } from '../../config/store/async_actions/all';
import { useDebouncedCallback } from 'use-debounce';
import { teacher_complete } from '../../config/store/async_actions/teacher_complete';

export interface Props {}

const HeadSearchComplete: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();
    const search_input = useRef<HTMLInputElement>(null);

    const search_handle = useDebouncedCallback(() => {
        let search_key: string = '';
        if (search_input.current) {
            search_key = search_input.current.value;
            dispatch(storeSlice.actions.set_search_key(search_key) as any);
            dispatch(teacher_complete({}) as any);
        }
    }, 1000);

    return (
        <>
            {/* <a href="#">
                <span className="material-symbols-outlined fill">search</span>
            </a> */}
            <input
                ref={search_input}
                onChange={search_handle}
                className="search"
                placeholder="search.."
                id="table_search_box"
                type="search"
            />
        </>
    );
};

export default HeadSearchComplete;
