import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import setup from './config/setup';
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
    const { id } = useParams();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const idd = searchParams.get('idd');
    console.log('params qurey idd', idd);

    const fetchTypes = async () => {
        try {
            const response2 = await axios.get(
                `/api/v1/user-students/fees-dues-student/${id}`,
            );
            setFeesTypes(response2.data?.data?.idWiseTotals);
            setTotalAmount(response2.data?.data?.summeries);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);
    return (
        <div className="admin_dashboard">
            <div className="dues_back_btn">
                <h3 className="table_heading">Dues</h3>
                <button className="back_btn">
                    <Link to={`/${setup.route_prefix}/class-details/${idd}`}>
                        <span className="material-symbols-outlined fill">
                            arrow_back
                        </span>
                        <div className="text">Back</div>
                    </Link>
                </button>
            </div>
            <div className="content_body">
                <div className="data_list">
                    <div className="table_responsive  custom_scroll">
                        <table className="account_table">
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
                                {feesTypes.length > 0 ? (
                                    feesTypes.map(
                                        (
                                            i: { [key: string]: any },
                                            index: number,
                                        ) => (
                                            <tr key={index}>
                                                <td className="due_td">
                                                    {i.name}
                                                </td>
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
                                            </tr>
                                        ),
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            style={{ textAlign: 'center' }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: '24px',
                                                }}
                                                className="not_found f-size-4 m-2"
                                            >
                                                No dues
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {/* <tbody id="all_list">
                                {feesTypes?.length &&
                                    feesTypes?.map(
                                        (i: { [key: string]: any }, index) => {
                                            return (
                                                <tr>
                                                    <td className="due_td">
                                                        {i.name}
                                                    </td>
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
                                                </tr>
                                            );
                                        },
                                    )}
                            </tbody> */}
                            <tfoot>
                                <tr className="total_row">
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
