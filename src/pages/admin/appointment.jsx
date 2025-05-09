/* eslint-disable no-unused-vars */
import { useRef, useState } from 'react'
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { sfLike } from 'spring-filter-query-builder';
import { Badge, Space, Table, Tag } from 'antd';
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons';

import { fetchAppointment } from '../../redux/slice/appointmentSlice';
import DataTable from '../../components/data-table';
import ModalAppointment from '../../components/modal/modal.appointment';

const AppointmentPage = () => {
  const tableRef = useRef();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const [dataInit, setDataInit] = useState(null);

  const isFetching = useSelector((state) => state.appointment.isFetching);
  const meta = useSelector((state) => state.appointment.meta);
  const appointments = useSelector((state) => state.appointment.result);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
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
    },
    {
      title: 'Patient',
      dataIndex: 'patientName',
      sorter: true,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      render: (_value, entity) => {
        return entity.doctorName || (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Update Now
          </Tag>
        );
      },
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
          case 'PENDING':
            color = '#faad14';
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

        entity.status === 'PENDING' ? (
          <Space>
            <EditOutlined
              style={{
                fontSize: 20,
                color: '#ffa500',
              }}
              onClick={() => {
                setOpenModal(true);
                setDataInit(entity);
              }}
            />
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
        headerTitle='Danh sách Lịch tiêm chủng'
        rowKey='appointId'
        loading={isFetching}
        columns={columns}
        dataSource={appointments}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchAppointment({ query }));
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
      <ModalAppointment
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </>


  )
}

export default AppointmentPage


