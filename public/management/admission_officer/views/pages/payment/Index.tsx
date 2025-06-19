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
    account?: { title: string };
    class?: object;
    type?: 'income' | 'expense';
    amount?: number;
    id: number;
    name?: string;
    total?: number;
    fee_amount: number;
    due_amount: number;
    input_amount?: string;
    input_amount2?: string;
}

interface Summary {
    total: number;
    fee_amount: number;
    due_amount: number;
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
    const [totalAmount2, setTotalAmount2] = useState(0);
    const [totalAmount3, setTotalAmount3] = useState(0);
    const [totalAmount, setTotalAmount] = useState<Summary | null>(null);
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

        // Validate given amounts
        let isValid = true;
        feesTypes.forEach((fee: FeesInfo, index) => {
            if (!feesTypes2[index]) return; // Skip if feesTypes2[index] is undefined
            const maxAmount =
                fee.due_amount !== 0
                    ? Math.abs(fee.due_amount || 0)
                    : fee.fee_amount; // Use fee_amount if due_amount is 0
            const discount =
                parseFloat(feesTypes2[index].input_amount2 ?? '0') || 0;
            const payable = maxAmount - discount;
            const given = parseFloat(fee.input_amount ?? '0') || 0;
            if (given > payable) {
                isValid = false;
            }
        });
        if (!isValid) {
            (window as any).toaster(
                'Given amount cannot exceed payable amount',
            );
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
        type: 'discount' | 'given',
        index: number,
    ) => {
        const enteredValue = parseFloat(event.target.value) || 0;
        if (type === 'discount') {
            const absoluteValue = Math.abs(i.due_amount || 0);
            const maxDiscount =
                i.due_amount !== 0 ? absoluteValue : i.fee_amount; // Use fee_amount if due_amount is 0
            const newValue = Math.min(enteredValue, maxDiscount);
            const remaining = maxDiscount - newValue;
            setRemainingDue((prev) => ({
                ...prev,
                [i.id]: remaining,
            }));
            let temp = [...feesTypes2];
            temp[index]['input_amount2'] = newValue.toString();
            setFeesTypes2(temp);
        } else if (type === 'given') {
            if (!feesTypes2[index]) return; // Skip if feesTypes2[index] is undefined
            const absoluteValue =
                i.due_amount !== 0 ? Math.abs(i.due_amount) : i.fee_amount; // Use fee_amount if due_amount is 0
            const discount =
                parseFloat(feesTypes2[index].input_amount2 ?? '0') || 0;
            const payable = absoluteValue - discount;
            const newValue = Math.min(enteredValue, payable >= 0 ? payable : 0);
            let temp = [...feesTypes];
            temp[index]['input_amount'] = newValue.toString();
            setFeesTypes(temp);
            setRemainingDue((prev) => ({
                ...prev,
                [i.id]: payable - newValue,
            }));
        }
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
    // console.log('total amount', totalAmount2);

    useEffect(() => {
        const initialRemainingDue = feesTypes.reduce((acc, i, index) => {
            const maxAmount =
                i.due_amount !== 0 ? Math.abs(i.due_amount || 0) : i.fee_amount;
            const discount =
                parseFloat(feesTypes2[index]?.input_amount2 ?? '0') || 0;
            const payable = maxAmount - discount;
            return { ...acc, [i.id]: payable };
        }, {});
        setRemainingDue(initialRemainingDue);
    }, [feesTypes, feesTypes2]);

    return (
        <div className="admin_dashboard">
            <div className="content_body">
                <form
                    id="main_form"
                    onSubmit={(e) => e.preventDefault()}
                    className="form_6002 mx-auto pt-3"
                >
                    <div>
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
                                                ref={studentIdRef}
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
                                            <select
                                                name="account_period_id"
                                                id=""
                                            >
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
                                                    const maxAmount =
                                                        i.due_amount !== 0
                                                            ? Math.abs(
                                                                i.due_amount ||
                                                                      0,
                                                            )
                                                            : i.fee_amount; // Use fee_amount if due_amount is 0
                                                    const discount =
                                                        parseFloat(
                                                            feesTypes2[index]
                                                                ?.input_amount2 ??
                                                                '0',
                                                        ) || 0;
                                                    const payable =
                                                        maxAmount - discount;
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
                                                                {i.due_amount <
                                                                0
                                                                    ? Math.abs(
                                                                        i.due_amount,
                                                                    )
                                                                    : i.due_amount ||
                                                                      '0'}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    max={
                                                                        maxAmount
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
                                                                    ) =>
                                                                        handleFeeChange(
                                                                            event,
                                                                            i,
                                                                            'discount',
                                                                            index,
                                                                        )
                                                                    }
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
                                                                        (payable <=
                                                                        0
                                                                            ? 0
                                                                            : payable)
                                                                    }
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
                                                                    min="0"
                                                                    max={
                                                                        payable >=
                                                                        0
                                                                            ? payable
                                                                            : 0
                                                                    }
                                                                    value={
                                                                        feesTypes[
                                                                            index
                                                                        ]
                                                                            ?.input_amount ??
                                                                        ''
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        handleFeeChange(
                                                                            event,
                                                                            i,
                                                                            'given',
                                                                            index,
                                                                        )
                                                                    }
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
                                            <td>
                                                {totalAmount?.fee_amount ?? 0}
                                            </td>
                                            <td>{totalAmount?.total ?? 0}</td>
                                            <td>
                                                {totalAmount?.due_amount ?? 0}
                                            </td>
                                            <td>
                                                {totalAmount3}
                                                <input
                                                    type="hidden"
                                                    name="total_discount"
                                                    value={totalAmount3}
                                                />
                                            </td>
                                            <td>
                                                {totalPayable}{' '}
                                                {/* Use totalPayable for the Payable column */}
                                                <input
                                                    type="hidden"
                                                    name="total_payable"
                                                    value={totalPayable}
                                                />
                                            </td>
                                            <td>
                                                {totalAmount2} tk
                                                <input
                                                    type="hidden"
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
                        {totalAmount3 !== 0 && (
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
                        )}

                        <div className="form-group student_submit form-horizontal">
                            {/* <label></label> */}
                            <div className="mt-4">
                                <button
                                    onClick={handleSubmit}
                                    type="button"
                                    className="btn btn-sm btn-outline-info"
                                >
                                    submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Index;