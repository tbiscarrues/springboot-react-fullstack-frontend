// Final App.js

import { useState, useEffect } from 'react'
import { deleteStudent, getAllStudents } from "./client";
import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Tag,
    Badge,
    Avatar,
    Radio,
    Popconfirm,
    Image,
} from 'antd';

import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";

import './App.css';
import { errorNotification, successNotification } from './Notification';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const TheAvatar = ({ name }) => {
    let trim = name.trim();
    let split = trim.split(" ");
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined />} />
    }
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }

    return <Avatar>
        {`${name.charAt(0)}${name.charAt(name.length - 1)}`}
    </Avatar>

}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId).then(() => {
        successNotification("Student deleted", `Student with ${studentId} was deleted`);
        callback();
    }).catch(err => {
        console.log(err.response);
        err.response.json().then(res => {
            console.log(res);
            errorNotification("There was an error", res.message);
        });
    })
}

const editStudent = (student, setStudent, callback, showDrawer, setShowDrawer) => {
    setStudent(student)
    setShowDrawer(!showDrawer)
}

const columns = (fetchStudents, setStudent, showDrawer, setShowDrawer) => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => {
            return <TheAvatar name={student.name} />
        }
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, student) => {
            return <Radio.Group>
                <Popconfirm
                    placement='topRight'
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText='Yes'
                    cancelText='No'>
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small" onClick={() => editStudent(student, setStudent, fetchStudents, showDrawer, setShowDrawer)}>Edit</Radio.Button>
            </Radio.Group>
        }
    },
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
    const [student, setStudent] = useState([]);
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>        
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
            }).catch(err => {
                console.log(err.response);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("There was an error", res.message);
                });
            }).finally(() => {
                setStudent(null);
                setFetching(false);
            })

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon} />
        }
        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined />} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty />
            </>;
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
                student={student}    
                setStudent={setStudent}           
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudents, setStudent, showDrawer, setShowDrawer)}
                bordered
                title={() =>
                    <>
                        <Layout style={{ background: 'transparent' }}>
                            <Content style={{ background: 'transparent' }}>
                                <Button
                                    onClick={() => setShowDrawer(!showDrawer)}
                                    type="primary" shape="round" icon={<PlusOutlined />} size="small">
                                    Add New Student
                                </Button>
                            </Content>
                            <Sider style={{ background: 'transparent' }}>
                                <Tag color="green">
                                    Total
                                    <Badge count={students.length} className="site-badge-count-4" />
                                </Tag>
                            </Sider>
                        </Layout>



                    </>
                }
                pagination={{ pageSize: 50 }}
                scroll={{ y: 500 }}
                rowKey={student => student.id}
            />
        </>

    }

    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed}
            onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
               <Image width={200}
               src={"https://www.sgv.es/pics/sinimagen.png"}></Image>
                </Footer>
        </Layout>
    </Layout>
}

export default App;
