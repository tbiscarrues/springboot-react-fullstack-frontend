// StudentDrawerForm.js

import { LoadingOutlined } from '@ant-design/icons';
import { Drawer, Input, Col, Select, Form, Row, Button, Spin } from 'antd';
import { useState } from 'react';
import { addNewStudent, updateStudent } from './client';
import { errorNotification, successNotification } from './Notification';

const { Option } = Select;

function StudentDrawerForm({ showDrawer, setShowDrawer, fetchStudents, student, setStudent }) {
    const [form] = Form.useForm();
    form.setFieldsValue(student);

    const onClose = () => {
        setShowDrawer(false);
        form.setFieldValue(null);
        if (setStudent) setStudent(null);
    }
    const [submitting, setSubmiting] = useState(false);



    const onFinish = values => {
        console.log(JSON.stringify(values, null, 2));

        setSubmiting(true);

        if (student) {
            values.id = student.id;
            updateStudent(values).then(() => {
                console.log("student updated");
                successNotification("Student succesfully updated", `${values.name} was updated in the system`)
                form.resetFields();
                fetchStudents();
                onClose();
            }).catch(err => {
                console.log(err.response);
                err.response.json().then(res => {
                    console.log(res);
                    var msg = res.message + "."
                    if (res.errors) {
                        for (var i in res.errors) {
                            msg = msg + res.errors[i].defaultMessage + ";"
                        }
                    }
                    errorNotification("There was an error", msg);
                });
            }).finally(() => setSubmiting(false))
        }
        else {
            addNewStudent(values).then(() => {
                console.log("student added");
                successNotification("Student succesfully added", `${values.name} was added to the system`)
                form.resetFields();
                fetchStudents();
                onClose();
            }).catch(err => {
                console.log(err.response);
                err.response.json().then(res => {
                    console.log(res);
                    var msg = res.message + "."
                    if (res.errors) {
                        for (var i in res.errors) {
                            msg = msg + res.errors[i].defaultMessage + ";"
                        }
                    }
                    errorNotification("There was an error", msg);
                });
            }).finally(() => setSubmiting(false))
        }


    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return <Drawer
        title={student ? "Edit student" : "Create new student"}
        width={720}
        onClose={onClose}
        visible={showDrawer}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onClose} style={{ marginRight: 8 }}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical"
            form={form}
            onFinishFailed={onFinishFailed}
            onFinish={onFinish}
            hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter student name' }]}
                    >
                        <Input placeholder="Please enter student name" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please enter student email' }]}
                    >
                        <Input placeholder="Please enter student email" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="gender"
                        label="gender"
                        rules={[{ required: true, message: 'Please select a gender' }]}
                    >
                        <Select placeholder="Please select a gender">
                            <Option value="MALE">MALE</Option>
                            <Option value="FEMALE">FEMALE</Option>
                            <Option value="OTHER">OTHER</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin indicator={antIcon} />}
            </Row>
        </Form>
    </Drawer>
}

export default StudentDrawerForm;