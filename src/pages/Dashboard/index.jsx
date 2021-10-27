import { Redirect } from "react-router";
import { Container, InputContainer } from "./styles";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { FiEdit2 } from "react-icons/fi";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { TaskContainer } from "./styles";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function Dashboard({ authenticated }) {
  const { register, handleSubmit } = useForm();
  const [task, setTask] = useState([]);
  const [token] = useState(
    JSON.parse(localStorage.getItem("@Doit:token")) || ""
  );

  function loadTasks() {
    api
      .get("/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        params: {
          completed: false,
        },
      })
      .then((response) => {
        const apiTasks = response.data.data.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        }));
        setTask(apiTasks);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const onSubmit = ({ task }) => {
    if (!task) {
      return toast.error("Complete o campo para enviar uma tarefa");
    }

    api
      .post(
        "/task",
        {
          description: task,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => loadTasks());
  };

  const handleCompleted = (id) => {
    const newTasks = task.filter((task) => task._id !== id);

    api
      .put(
        `/task/${id}`,
        { completed: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((reponse) => setTask(newTasks));
  };

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <Container>
      <InputContainer onSubmit={handleSubmit(onSubmit)}>
        <time>7 de maio de 2021</time>
        <section>
          <Input
            icon={FiEdit2}
            register={register}
            name="task"
            error=""
            placeHolder="Nova Tarefa"
          />
          <Button type="submit">Adicionar</Button>
        </section>
      </InputContainer>
      <TaskContainer>
        {task.map((task) => (
          <Card
            key={task._id}
            title={task.description}
            date={task.createdAt}
            onClick={() => handleCompleted(task._id)}
          />
        ))}
      </TaskContainer>
    </Container>
  );
}

export default Dashboard;
