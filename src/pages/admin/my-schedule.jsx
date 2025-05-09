/* eslint-disable no-undef */
import { useEffect, useRef, useState } from 'react'
import queryString from 'query-string';
import { Badge, Popconfirm, Space, message, notification } from 'antd';
import { sfLike } from 'spring-filter-query-builder';
import { CheckSquareOutlined, CloseCircleOutlined } from '@ant-design/icons';

import DataTable from '../../components/data-table';
import { callCancelAppointment, callCompleteAppointment, callMySchedule } from '../../config/api.appointment';

const MySchedulePage = () => {
    const tableRef = useRef();

    const reloadTable = () => {
        tableRef?.current?.reload();
    };

    const [isFetching, setFetching] = useState(false);
    const [listSchedule, setListSchedule] = useState([]);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    });

    const handleCancel = async (id) => {
        if (id) {
            const res = await callCancelAppointment(id);
            if (res && +res.statusCode === 200) {
                message.success('Appointment cancelled successfully');
                reloadTable();
            } else {
                notification.error({
                    message: res.error,
                    description: res.message,
                });
            }
        }
    };

    const handleComplete = async (id) => {
        if (id) {
            const res = await callCompleteAppointment(id);
            if (res && +res.statusCode === 200) {
                message.success('Appointment completed successfully');
                reloadTable();
            } else {
                notification.error({
                    message: res.error,
                    description: res.message,
                });
            }
        }
    };

    // Fetch danh sách bác sĩ
    useEffect(() => {
        fetchMySchedule();
    }, []); // Empty dependency array để chỉ chạy một lần khi component mount

    const fetchMySchedule = async () => {
        setFetching(true); // Bắt đầu quá trình fetching

        // Giả lập quá trình fetching mất 1.5 giây
        setTimeout(async () => {
            const res = await callMySchedule(); // Gọi API
            if (res && res.data) {
                setMeta(res.data.meta);
                setListSchedule(res.data.result);
            }
            setFetching(false); // Kết thúc quá trình fetching
        }, 500); // Trì hoãn 1.5 giây
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: 'center',
            render: (text, record, index) => {
                return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
            },
            hideInSearch: true,
        },
        {
            title: 'VaccineName',
            dataIndex: 'vaccineName',
            sorter: true,
        },{
            title: 'Cashier',
            dataIndex: 'cashierName',
        },
        {
            title: 'Patient',
            dataIndex: 'patientName',
            sorter: true,
        },
        {
            title: 'Date',
            dataIndex: 'appointmentDate',
            sorter: true,
        },
        {
            title: 'Time',
            dataIndex: 'appointmentTime',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: true,
            render: (_value, entity) => {
                let color;
                switch (entity.status) {
                    case 'CANCELLED':
                        color = '#f50';
                        break;
                    case 'COMPLETED':
                        color = '#1890ff';
                        break;
                    case 'PROCESSING':
                        color = '#52c41a';
                        break;
                }
                return <Badge count={entity.status} showZero color={color} />;
            },
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity) => (
                entity.status === 'PROCESSING' ? (
                    <Space>
                        <CheckSquareOutlined
                            style={{
                                fontSize: 20,
                                color: '#1be632',
                            }}
                            onClick={() =>
                                handleComplete(entity.appointmentId)
                            }
                        />

                        <Popconfirm
                            placement="leftTop"
                            title="Confirm cancel appointment"
                            description="Are you sure you want to cancel this appointment?"
                            onConfirm={() => handleCancel(entity.appointmentId)}
                            okText="Confirm"
                            cancelText="Cancel"
                        >
                            <span style={{ cursor: 'pointer', margin: '0 10px' }}>
                                <CloseCircleOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#e22929',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Space>) : null
            ),
        },
    ]

    const buildQuery = (params, sort) => {
        const clone = { ...params };
        const q = {
            page: params.current,
            size: params.pageSize,
            filter: '',
        };

        if (clone.vaccineName) q.filter = `${sfLike('vaccineName', clone.vaccineName)}`;
        if (clone.patientName) {
            q.filter = clone.vaccineName
                ? q.filter + ' and ' + `${sfLike('patientName', clone.patientName)}`
                : `${sfLike('patientName', clone.patientName)}`;
        }

        if (!q.filter) delete q.filter;

        const temp = queryString.stringify(q);

        let sortBy = '';
        if (sort && sort.patientName) {
            sortBy = sort.patientName === 'ascend' ? 'sort=patientName,asc' : 'sort=patientName,desc';
        }
        if (sort && sort.address) {
            sortBy = sort.address === 'ascend' ? 'sort=vaccineName,asc' : 'sort=vaccineName,desc';
        }

        return temp;
    };

    return (
        <>
            <DataTable
                actionRef={tableRef}
                headerTitle='Lịch tiêm chủng của bác sĩ hôm nay'
                rowKey='appointId'
                loading={isFetching}
                columns={columns}
                dataSource={listSchedule}
                request={async (params, sort, filter) => {
                    const query = buildQuery(params, sort, filter);
                    await fetchMySchedule({ query });
                }}
                scroll={{ x: true }}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (
                            <div>
                                {range[0]}-{range[1]} trên {total} rows
                            </div>
                        );
                    },
                }}
                rowSelection={false}
            />

        </>


    )
}

export default MySchedulePage