import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  message,
  notification,
  Popconfirm,
  Space,
  Tooltip,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';
import queryString from 'query-string';

import { callDeleteVaccine } from '../../config/api.vaccine';
import DataTable from '../../components/data-table';
import { fetchVaccine } from '../../redux/slice/vaccineSlice';
import ModalVaccine from '../../components/modal/modal.vaccine';

const VaccinePage = () => {
  const tableRef = useRef();
  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const [dataInit, setDataInit] = useState(null);

  const isFetching = useSelector((state) => state.vaccine.isFetching);
  const meta = useSelector((state) => state.vaccine.meta);
  const centers = useSelector((state) => state.vaccine.result);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);

  const handleDeleteVaccine = async (id) => {
    if (id) {
      const res = await callDeleteVaccine(id);
      if (res && +res.statusCode === 200) {
        message.success('Vaccine deleted successfully');
        reloadTable();
      } else {
        notification.error({
          message: 'An error occurred',
          description: res.message,
        });
      }
    }
  };

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 50,
      align: 'center',
      render: (text, record, index) => {
        return <>{index + 1 + (meta.page - 1) * meta.pageSize}</>;
      },
      hideInSearch: true,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      hideInSearch: true,
      render: (text) => (
        <img
          src={'http://localhost:8080/storage/vaccine/' + text}
          alt='center'
          style={{
            width: '50px',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render: (text) => (
        <Tooltip title={text}>
          {text.length > 20 ? text.slice(0, 20) + '...' : text}
        </Tooltip>
      ),
    },
    {
      title: 'Factory',
      dataIndex: 'manufacturer',
      sorter: true,
    },
    {
      title: 'Disease',
      dataIndex: 'disease',
      render: (text) => (
        <Tooltip title={text}>
          {text.length > 20 ? text.slice(0, 20) + '...' : text}
        </Tooltip>
      ),
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      hideInSearch: true,
    },
    {
      title: 'AgeRange',
      dataIndex: 'ageRange',
      hideInSearch: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: 'Doses',
      dataIndex: 'requiredDoses',
      hideInSearch: true,
    },
    {
      title: 'Actions',
      hideInSearch: true,
      width: 50,
      render: (_value, entity) => (
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

          <Popconfirm
            placement='leftTop'
            title='Confirm delete company' // or 'Confirm delete vaccine'
            description='Are you sure you want to delete this vaccine?'
            onConfirm={() => handleDeleteVaccine(entity.vaccineId)}
            okText='Confirm'
            cancelText='Cancel'
          >
            <span style={{ cursor: 'pointer', margin: '0 10px' }}>
              <DeleteOutlined
                style={{
                  fontSize: 20,
                  color: '#ff4d4f',
                }}
              />
            </span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const buildQuery = (params, sort) => {
    const clone = { ...params };
    const q = {
      page: params.current,
      size: params.pageSize,
      filter: '',
    };

    if (clone.name)
      q.filter = `${sfLike('name', clone.name)}`;
    if (clone.manufacturer) {
      q.filter = clone.name
        ? q.filter + ' and ' + `${sfLike('manufacturer', clone.manufacturer)}`
        : `${sfLike('manufacturer', clone.manufacturer)}`;
    }
    if (clone.disease) {
      q.filter = q.filter
        ? `${q.filter} and ${sfLike('disease', clone.disease)}`
        : `${sfLike('disease', clone.disease)}`;
    }

    if (!q.filter) delete q.filter;

    let temp = queryString.stringify(q);

    let sortBy = '';
    if (sort && sort.name) {
      sortBy =
        sort.name === 'ascend'
          ? 'sort=name,asc'
          : 'sort=name,desc';
    }
    if (sort && sort.manufacturer) {
      sortBy =
        sort.manufacturer === 'ascend'
          ? 'sort=manufacturer,asc'
          : 'sort=manufacturer,desc';
    }

    if (sort && sort.price) {
      sortBy = sort.price === 'ascend' ? 'sort=price,asc' : 'sort=price,desc';
    }
    if (sort && sort.stockQuantity) {
      sortBy =
        sort.stockQuantity === 'ascend'
          ? 'sort=stockQuantity,asc'
          : 'sort=stockQuantity,desc';
    }
    temp = `${temp}&${sortBy}`;

    return temp;
  };

  return (
    <>
      <DataTable
        actionRef={tableRef}
        headerTitle='Vaccine List'
        rowKey='vaccineId'
        loading={isFetching}
        columns={columns}
        dataSource={centers}
        request={async (params, sort, filter) => {
          const query = buildQuery(params, sort, filter);
          dispatch(fetchVaccine({ query }));
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
                {range[0]}-{range[1]} of {total} rows
              </div>
            );
          },
        }}
        rowSelection={false}
        toolBarRender={() => {
          return (
            <Button
              icon={<PlusOutlined />}
              type='primary'
              onClick={() => setOpenModal(true)}
            >
              Add new
            </Button>
          );
        }}
      />
      <ModalVaccine
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </>
  );
};
export default VaccinePage;