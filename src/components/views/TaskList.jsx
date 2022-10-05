import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";



export default function TaskList({token}) {
    const [tasks, setTasks] = useState([]);

    const location = useLocation();

    const newTaskInitialValues = {
        title: "", 
        desc: ""
    };

    let [newTaskValues, setNewTaskValues] = useState(newTaskInitialValues);

    useEffect(() => {
        fetchData();
      }, []);


    function fetchData(){
        fetch("http://demo2.z-bit.ee/tasks", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${location.state.token}`,
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            let newArray = response.slice();
            setTasks(newArray);
        })

    }
    const handleNameChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].name = event.target.value;
        });
        setTasks(newTasks);
    };

    const handleCompletedChange = (task, event) => {
        console.log(event)
        const newTasks = produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft[index].completed = event.target.checked;
        });
        setTasks(newTasks);
    };

    const handleAddTask = () => {
        setTasks(produce(tasks, draft => {
            draft.push({
                id: Math.random(),
                name: "",
                completed: false
            });

            fetch("http://demo2.z-bit.ee/tasks", {
                method: "POST",
                body: JSON.stringify()
            })
        }));
    };

    const handleDeleteTask = (task) => {
        setTasks(produce(tasks, draft => {
            const index = draft.findIndex(t => t.id === task.id);
            draft.splice(index, 1);
        }));
    };

    return (
        <Row type="flex" justify="center" style={{minHeight: '100vh', marginTop: '6rem'}}>
            <Col span={12}>
                <h1>Task List</h1>
                <Button onClick={handleAddTask}>Add Task</Button>
                <Divider />
                <List
                    size="small"
                    bordered
                    dataSource={tasks}
                    renderItem={(task) => <List.Item key={task.id}>
                        <Row type="flex" justify="space-between" align="middle" style={{width: '100%'}}>
                            <Space>
                                <Checkbox checked={task.marked_as_done} onChange={(e) => handleCompletedChange(task, e)} />
                                <Input value={task.title} onChange={(event) => handleNameChange(task, event)} />
                            </Space>
                            <Button type="text" onClick={() => handleDeleteTask(task)}><DeleteOutlined /></Button>
                        </Row>
                    </List.Item>}
                />
            </Col>
        </Row>
    )
}