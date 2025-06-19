import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../../../../../store';
import { initialState } from '../inital_state';
import axios from 'axios';
import setup from '../../setup';
import { end_point } from '../../../../../../config/api';
import storeSlice from '..';
import { all } from './all';
import { anyObject } from '../../../../../../common_types/object';
import { class_details1 } from './class_details1';

type ReturnType = void;
type PayloadType = { [key: string]: any };
type ThunkArgument = {
    dispatch: AppDispatch;
    state: typeof initialState;
};

const api_prefix = setup.api_prefix;
const store_prefix = setup.store_prefix;

const fetch_api = async (param, thunkAPI) => {
    const state = thunkAPI.getState();
    const dispatch = thunkAPI.dispatch;

    dispatch(storeSlice.actions.set_is_loading(true));
    dispatch(storeSlice.actions.set_loading_text('destroying..'));

    const response = await axios.post(`${end_point}/${api_prefix}/destroy`, {
        id: param.id,
    });

    let row = document.querySelector(`.table_row_${param.id}`);
    if (row) {
        row.classList.add('hide');
    }
    // await dispatch(all({}));
    await dispatch(class_details1({ id: param.class }) as any);
    dispatch(storeSlice.actions.set_is_loading(false));
    (window as anyObject).toaster(
        `${response.status} - ${response.data.message}`,
    );
    return response.data;
    // thunkAPI.dispatch(storeSlice.actions.my_action())
};

export const destroy = createAsyncThunk<ReturnType, PayloadType, ThunkArgument>(
    `${store_prefix}/destroy`,
    fetch_api,
);
