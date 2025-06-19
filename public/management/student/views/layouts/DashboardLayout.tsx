import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './shared/TopHeader';
import SideBar from './shared/menu/SideBar';
import axios from 'axios';
import { DashboardContext } from './DashboardContext';

export interface Props {}

const DashboardLayout: React.FC<Props> = (props: Props) => {
    const [data, setData] = useState<any>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                '/api/v1/user-students/stu-information',
            );
            setData(response.data.data);
            // setData(response.data);
        } catch (error) {
            setError(error);
        }
    };
    // const fetchTypes = async () => {
    //     try {
    //         const response2 = await axios.get(
    //             `/api/v1/user-students/fees-categories-student`,
    //         );
    //         setFeesTypes(response2.data?.data?.idWiseTotals);
    //         setTotalAmount(response2.data?.data?.summeries);
    //     } catch (error) {
    //         setError2(error);
    //     }
    // };

    // useEffect(() => {
    //     fetchData();
    // }, []);
    async function initdependancy() {
        await (fetchData() as any);
        // await (fetchTypes() as any);
    }

    // useEffect(() => {
    //     initdependancy();
    // }, []);
    useEffect(() => {
        const init = async () => {
            await fetchData(); // your function
            setLoading(false); // allow children now
        };
        init();
    }, []);
    return (
        <div className="page-wrapper">
            {/*Page Header Start*/}
            <TopHeader></TopHeader>
            {/*Page Header Ends*/}

            {/*Page Body Start*/}
            <div className="page-body-wrapper">
                {/*Page Sidebar Start*/}
                <div className="page-sidebar custom-scrollbar">
                    <div className="sidebar-user text-center">
                        <div>
                            <img
                                className="img-50 rounded-circle"
                                src={
                                    data?.image || '/assets/dashboard_uni/1.jpg'
                                }
                                alt="Teacher"
                            />
                        </div>
                        <h6 className="mt-3 f-12">{data.name}</h6>
                    </div>
                    <SideBar />
                </div>
                {/*Page Sidebar Ends*/}
                <div
                    className="page-body custom_scroll"
                    style={{
                        height: 'calc(100vh - 80px)',
                        overflow: 'hidden',
                        overflowY: 'scroll',
                    }}
                >
                    <div className="row">
                        <div className="col-sm-12">
                            <DashboardContext.Provider value={{ loading }}>
                                <Outlet />
                            </DashboardContext.Provider>
                        </div>
                    </div>
                </div>
            </div>
            {/*Page Body Ends*/}
        </div>
    );
};
export default DashboardLayout;
