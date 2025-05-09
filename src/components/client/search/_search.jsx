import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Drawer, Select, Space } from 'antd';
import {  useState } from 'react'
import './_search.css'

const Search = ({total , isMobile}) => {
    const [open, setOpen] = useState(false);
   
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    return (
        <div className='section_shop' >
            <h2 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Shop </h2><span>({total}) loại vaccine</span>
            <div className='filter' >
                <div className='search_group' >
                    <button
                        style={{
                            padding: '6px 12px',
                            borderRadius: '8px 0 0 8px',
                            border: '1px solid #ddd',
                            borderRight: 'none',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        <SearchOutlined />
                    </button>
                    <input
                        type='text'
                        placeholder='Search...'
                        style={{
                            padding: '6px 12px 6px 0px',
                            borderRadius: '0 8px 8px 0',
                            border: '1px solid #ddd',
                            borderLeft: 'none',
                            outline: 'none',
                        }}
                    />
                </div>
                <div className='filter_group' >
                    <Space>
                        <Select
                            prefix='Sort by : '
                            defaultValue='default'
                            style={{
                                width: 200,
                            }}
                            onChange={handleChange}
                            options={[
                                {
                                    value: 'jack',
                                    label: 'Jack',
                                },
                                {
                                    value: 'lucy',
                                    label: 'Lucy',
                                },
                                {
                                    value: 'Yiminghe',
                                    label: 'yiminghe',
                                },
                            ]}
                        />


                        <Button onClick={showDrawer}>
                            <Space>
                                Filters
                                <FilterOutlined />
                            </Space>
                        </Button>

                        <Drawer title='Basic Drawer' onClose={onClose} open={open} width={isMobile ? 250 : '500'}>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                        </Drawer>
                    </Space>
                </div>
            </div>
        </div>
    )
}

export default Search