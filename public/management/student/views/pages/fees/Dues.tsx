import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
export interface Props {}
export interface FeesInfo {
    account: { title: string };
    class: object;
    type: 'income' | 'expense';
    amount: number;
}

const Dues: React.FC<Props> = (props: Props) => {
    const [feesTypes, setFeesTypes] = useState<FeesInfo[]>([]);
    const [totalAmount, setTotalAmount] = useState();
    const [error, setError] = useState(null);

    const fetchTypes = async () => {
        try {
            const response2 = await axios.get(
                `/api/v1/user-students/fees-categories-student`,
            );
            setFeesTypes(response2.data?.data?.idWiseTotals);
            setTotalAmount(response2.data?.data?.summeries);
        } catch (error) {
            setError(error);
        }
    };

    async function initdependancy() {
        await (fetchTypes() as any);
    }

    useEffect(() => {
        initdependancy();
    }, []);
    return (
        <div className="admin_dashboard">
            <h3 className="table_heading">Dues</h3>
            <div className="content_body">
                <div className="data_list">
                    <div className="table_responsive  custom_scroll">
                        <table className="">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Fees</th>
                                    <th>Paying</th>
                                    <th>Due amount</th>
                                    <th>Advanced</th>
                                    <th>Payable</th>
                                    {/* <th>Given Amount</th> */}
                                </tr>
                            </thead>
                            <tbody id="all_list">
                                {/* <input
                                    type="hidden"
                                    name="total_fees_count"
                                    value={feesTypes.length}
                                /> */}
                                {feesTypes?.length &&
                                    feesTypes?.map(
                                        (i: { [key: string]: any }, index) => {
                                            return (
                                                <tr>
                                                    <td>{i.name}</td>
                                                    <td>
                                                        <input
                                                            type="hidden"
                                                            name={`fees_amount_${index}`}
                                                            value={i.fee_amount}
                                                        />
                                                        {i.fee_amount}
                                                    </td>
                                                    <td>{i.total}</td>
                                                    <td>
                                                        {i.due_amount < 0
                                                            ? i.due_amount
                                                            : '0'}
                                                    </td>
                                                    <td>
                                                        {i.due_amount >= 0
                                                            ? i.due_amount
                                                            : '0'}
                                                    </td>
                                                    <td></td>
                                                    {/* <td>
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
                                                    </td> */}
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
                                    <td></td>
                                    <td></td>
                                    <td>
                                        {totalAmount?.['fee_amount'] -
                                            totalAmount?.['total']}
                                    </td>
                                    {/* <td>
                                        {totalAmount2}
                                        <input
                                            type="hidden"
                                            name="total_amount"
                                            value={totalAmount2}
                                        />
                                    </td> */}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dues;
