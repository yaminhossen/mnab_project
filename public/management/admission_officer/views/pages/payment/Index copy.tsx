import React, { useState, useEffect, useRef } from 'react';
import { anyObject } from '../../../common_types/object';
import axios from 'axios';
import moment from 'moment/moment';
export interface Accountinfo {
    account: { title: string };
    type: 'income' | 'expense';
    amount: number;
}
export interface Categoryinfo {
    account: { title: string };
    type: 'income' | 'expense';
    amount: number;
}
export interface Periodinfo {
    account: { title: string };
    type: 'income' | 'expense';
    amount: number;
}
export interface ClassInfo {
    account: { title: string };
    class: object;
    type: 'income' | 'expense';
    amount: number;
    s_class: number;
}
export interface FeesInfo {
    account: { title: string };
    class: object;
    type: 'income' | 'expense';
    amount: number;
}
export interface Props {}

let convertamount = (window as any).convertAmount;
const Index: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [error2, setError2] = useState(null);
    const [data, setData] = useState('');
    const [accounts, setAccounts] = useState<Accountinfo[]>([]);
    const [categories, setCategories] = useState<Categoryinfo[]>([]);
    const [periods, setPeriods] = useState<Periodinfo[]>([]);
    const [classes, setClass] = useState<any>([]);
    const [feesTypes, setFeesTypes] = useState<FeesInfo[]>([]);
    const [feesTypes2, setFeesTypes2] = useState<FeesInfo[]>([]);
    const [totalAmount, setTotalAmount] = useState();
    const [totalAmount2, setTotalAmount2] = useState(0);
    const [totalAmount3, setTotalAmount3] = useState(0);
    const [remainingDue, setRemainingDue] = useState<{ [key: number]: number }>(
        {},
    );
    const [totalPayable, setTotalPayable] = useState(0);
    const handleSubmit = async (e) => {
        e.preventDefault();
        let form = document.getElementById('main_form') as HTMLFormElement;
        if (!form) {
            return;
        }

        let formData = new FormData(form);
        try {
            const response = await axios.post(
                '/api/v1/account-logs/fees-store',
                formData,
            );
            (window as any).toaster('submitted');
            form.reset();
        } catch (error) {
            // setError(error);
        }
    };
    const fetchAccounts = async () => {
        try {
            const response = await axios.get('/api/v1/accounts/accounts');
            setAccounts(response.data.data);
        } catch (error) {
            setError(error);
        }
    };
    const fetchAccountCategorys = async () => {
        try {
            const response = await axios.get('/api/v1/account-categories/all');
            setCategories(response.data.data);
        } catch (error) {
            setError(error);
        }
    };
    const fetchPeriods = async () => {
        try {
            const response = await axios.get('/api/v1/account-logs/periods');
            setPeriods(response.data.data);
        } catch (error) {
            setError(error);
        }
    };
    const studentIdRef = useRef<HTMLInputElement>(null);
    const fetchClass = async (id: string) => {
        try {
            const response = await axios.get(
                `/api/v1/user-students/student-class/${id}`,
            );
            setClass(response.data.data);
        } catch (error) {
            setError2(error.response?.data?.message);
            setClass([]);
            setFeesTypes([]);
            setFeesTypes2([]);
        }
    };
    const fetchTypes = async (id: string) => {
        try {
            const response2 = await axios.get(
                `/api/v1/user-students/fees-categories-student/${id}`,
            );
            setFeesTypes2(response2.data?.data?.idWiseTotals);
            setFeesTypes(response2.data?.data?.idWiseTotals);
            setTotalAmount(response2.data?.data?.summeries);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchAccountCategorys();
        fetchPeriods();
    }, []);
    const handleStudentIdBlur = () => {
        const id = studentIdRef.current?.value;

        if (id) {
            fetchClass(id);
        }
    };
    const handleStudentSubmit = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleStudentIdBlur();
        }
    };
    useEffect(() => {
        // if (classes) {
        //     let id = classes.s_class;
        //     if (id) {
        //         fetchTypes(id);
        //     }
        // }
        const id = studentIdRef.current?.value;
        if (id) {
            fetchTypes(id);
        }
    }, [classes]);

    useEffect(() => {
        let sum = feesTypes.reduce(
            (t, i: anyObject) => (t += +(i.input_amount || 0)),
            0,
        );
        setTotalAmount2(sum);
    }, [feesTypes]);

    useEffect(() => {
        let sum = feesTypes2.reduce(
            (t, i: anyObject) => (t += +(i.input_amount2 || 0)),
            0,
        );
        setTotalAmount3(sum);
    }, [feesTypes2]);
    if (totalAmount) {
        console.log(totalAmount);
    }
    const handleFeeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        i: any,
    ) => {
        let enteredValue = parseFloat(event.target.value) || 0; // Convert input to number
        let absolueValue = Math.abs(i.due_amount);
        if (absolueValue <= enteredValue) {
            enteredValue = Math.abs(i.due_amount);
            console.log('entered value111', enteredValue);
            console.log('absolute value111', absolueValue);
        }
        console.log('entered222 value', enteredValue);
        console.log('absolute222 value', absolueValue);
        const remaining = absolueValue - enteredValue; // Calculate remaining due amount
        setRemainingDue((prev) => ({
            ...prev,
            [i.id]: Math.abs(remaining), // Store remaining due amount with the corresponding fee ID
        }));
        // Calculate total payable sum whenever remainingDue changes
        useEffect(() => {
            const total = Object.values(remainingDue).reduce(
                (acc, val) => acc + val,
                0,
            );
            setTotalPayable(total);
        }, [remainingDue]);
    };
    // Calculate total payable sum whenever remainingDue changes
    useEffect(() => {
        const total = Object.values(remainingDue).reduce(
            (acc, val) => acc + val,
            0,
        );
        setTotalPayable(total);
    }, [remainingDue]);
    console.log('ramaing due array', remainingDue);

    // Function to update remaining due (assuming this is updated elsewhere)
    const handleFeeChange2 = (
        event: React.ChangeEvent<HTMLInputElement>,
        i: any,
    ) => {
        const enteredValue = parseFloat(event.target.value) || 0; // Convert input to number
        setRemainingDue((prev) => ({
            ...prev,
            [i.id]: enteredValue, // Store payable amount based on id
        }));
    };

    // Calculate total payable sum whenever remainingDue changes
    useEffect(() => {
        const total = Object.values(remainingDue).reduce(
            (acc, val) => acc + val,
            0,
        );
        setTotalPayable(total);
    }, [remainingDue]);
    console.log('total amount', totalAmount2);

    return (
        <div className="admin_dashboard">
            <div className="content_body">
                <form
                    id="main_form"
                    onSubmit={(e) => e.preventDefault()}
                    className="form_6002 mx-auto pt-3"
                >
                    <div className="student_form">
                        <div className="full_width">
                            <div className="form_section_heading">
                                <h2 className="">Fees Collection</h2>
                            </div>
                            <div className="d-flex">
                                <div className="form-group form-vertical">
                                    <label>Student Id</label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="student id"
                                            name="student_id"
                                            ref={studentIdRef} // Assign ref here
                                            onBlur={handleStudentIdBlur}
                                            onKeyUp={handleStudentSubmit}
                                        />
                                    </div>
                                </div>
                                <input
                                    type="hidden"
                                    placeholder="student Class"
                                    name="class"
                                    value={classes.s_class}
                                />
                                <div className="form-group form-vertical">
                                    <label>Date</label>
                                    <div className="form_elements">
                                        <input
                                            type="date"
                                            defaultValue={moment().format(
                                                'YYYY-MM-DD',
                                            )}
                                            name="date"
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-vertical">
                                    <label>Receipt No</label>
                                    <div className="form_elements">
                                        <input
                                            type="text"
                                            placeholder="enter receipt page no"
                                            name="receipt_no"
                                        />
                                    </div>
                                </div>
                                <div className="form-group form-vertical">
                                    <label>Account Category</label>
                                    <div className="form_elements">
                                        <select
                                            name="account_category_id"
                                            id=""
                                        >
                                            {categories?.length &&
                                                categories?.map(
                                                    (i: {
                                                        [key: string]: any;
                                                    }) => {
                                                        return (
                                                            <option
                                                                value={i.id}
                                                            >
                                                                {i.title}
                                                            </option>
                                                        );
                                                    },
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-vertical">
                                    <label>Account</label>
                                    <div className="form_elements">
                                        <select name="account_id" id="">
                                            {accounts?.length &&
                                                accounts?.map(
                                                    (i: {
                                                        [key: string]: any;
                                                    }) => {
                                                        return (
                                                            <option
                                                                value={i.id}
                                                            >
                                                                {i.title}
                                                            </option>
                                                        );
                                                    },
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group form-vertical">
                                    <label>Account Period</label>
                                    <div className="form_elements">
                                        <select name="account_period_id" id="">
                                            {periods?.length &&
                                                periods?.map(
                                                    (i: {
                                                        [key: string]: any;
                                                    }) => {
                                                        return (
                                                            <option
                                                                value={i.id}
                                                            >
                                                                {moment(
                                                                    i.year_month,
                                                                ).format(
                                                                    'YYYY-MM-DD',
                                                                )}
                                                            </option>
                                                        );
                                                    },
                                                )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="data_list">
                        <div className="table_responsive  custom_scroll">
                            <table className="mb-4">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    <tr>
                                        <td>Name</td>
                                        <td>{classes.student?.name}</td>
                                    </tr>
                                    <tr>
                                        <td>ID</td>
                                        <td>{classes.student_id}</td>
                                    </tr>
                                    <tr>
                                        <td>Class</td>
                                        <td>{classes.class?.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Addmission No</td>
                                        <td>{classes.addmission_no}</td>
                                    </tr>
                                    <tr>
                                        <td>Photo</td>
                                        <td>
                                            <img
                                                height="40px"
                                                src={classes.student?.image}
                                                alt=""
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Fees</th>
                                        <th>Paid</th>
                                        <th>Due amount</th>
                                        <th>Discount</th>
                                        <th>Payable</th>
                                        <th>Given Amount</th>
                                        <th>Paying</th>
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    <input
                                        type="hidden"
                                        name="total_fees_count"
                                        value={feesTypes.length}
                                    />
                                    {feesTypes?.length &&
                                        feesTypes?.map(
                                            (
                                                i: { [key: string]: any },
                                                index,
                                            ) => {
                                                return (
                                                    <tr>
                                                        <td>{i.name}</td>
                                                        <td>
                                                            <input
                                                                type="hidden"
                                                                name={`fees_amount_${index}`}
                                                                value={
                                                                    i.fee_amount
                                                                }
                                                            />
                                                            {i.fee_amount}
                                                        </td>
                                                        <td>{i.total}</td>
                                                        <td>
                                                            {i.due_amount < 0
                                                                ? Math.abs(
                                                                    i.due_amount,
                                                                )
                                                                : '0'}
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                max={
                                                                    i.due_amount
                                                                }
                                                                name={`fees_discount_${index}`}
                                                                value={
                                                                    feesTypes2[
                                                                        index
                                                                    ]
                                                                        ?.input_amount2 ??
                                                                    ''
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) => {
                                                                    let temp = [
                                                                        ...feesTypes2,
                                                                    ];
                                                                    temp[index][
                                                                        'input_amount2'
                                                                    ] =
                                                                        event?.target.value;
                                                                    setFeesTypes2(
                                                                        temp,
                                                                    );
                                                                    handleFeeChange(
                                                                        event,
                                                                        i,
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name={`payable[${index}]`}
                                                                value={
                                                                    remainingDue[
                                                                        i.id
                                                                    ] ??
                                                                    Math.abs(
                                                                        i.due_amount <=
                                                                            0
                                                                            ? i.due_amount
                                                                            : 0,
                                                                    )
                                                                } // Show updated value
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="hidden"
                                                                name={`fees_type_${index}`}
                                                                value={i.id}
                                                            />
                                                            <input
                                                                name={`fees_${index}`}
                                                                type="number"
                                                                onChange={(
                                                                    event,
                                                                ) => {
                                                                    let temp = [
                                                                        ...feesTypes,
                                                                    ];
                                                                    temp[index][
                                                                        'input_amount'
                                                                    ] =
                                                                        event?.target.value;
                                                                    setFeesTypes(
                                                                        temp,
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>Total</td>
                                        <td>{totalAmount?.['fee_amount']}</td>
                                        <td>{totalAmount?.['total']}</td>
                                        <td>{totalAmount?.['due_amount']}</td>
                                        {/* <td></td> */}
                                        <td>
                                            {totalAmount3}
                                            <input
                                                type="hidden"
                                                name="total_discount"
                                                value={totalAmount3}
                                            />
                                        </td>
                                        <td>
                                            {totalAmount3
                                                ? totalAmount?.['due_amount'] +
                                                  totalAmount3
                                                : totalAmount?.['due_amount'] -
                                                  totalAmount3}
                                        </td>
                                        {/* <td>
                                            {totalAmount?.['due_amount'] +
                                                totalAmount2}
                                        </td> */}
                                        <td>
                                            {totalAmount2} tk
                                            <input
                                                type="hidden"
                                                // name="total_amount"
                                                value={totalAmount2}
                                            />
                                        </td>
                                        <td>
                                            {totalAmount2} tk
                                            <input
                                                type="hidden"
                                                name="total_amount"
                                                value={totalAmount2}
                                            />
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div className="student_form mt-4">
                        <div className="full_width">
                            <div className="form_section_heading">
                                <h4 className="">Discount Document</h4>
                            </div>
                            <div className="d-flex">
                                <div className="form-group form-vertical">
                                    <label>Discount attachement</label>
                                    <div className="form_elements">
                                        <input
                                            type="file"
                                            name="discount_attachment"
                                        />
                                    </div>
                                </div>
                                <div className="form-group  form-vertical">
                                    <label>Discount Note</label>
                                    <div className="form_elements">
                                        <textarea
                                            style={{ resize: 'both' }}
                                            placeholder="write your discont reason"
                                            name="discount_note"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group student_submit form-horizontal">
                        <label></label>
                        <div className="form_elements">
                            <button
                                onClick={handleSubmit}
                                type="button"
                                className="btn btn-sm btn-outline-info"
                            >
                                submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Index;
