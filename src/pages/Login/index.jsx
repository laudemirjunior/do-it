import { AnimationContainer, Background, Container, Content } from "./styles";
import Button from "../../components/Button";
import { Link, Redirect } from "react-router-dom";
import Input from "../../components/Input";
import { FiMail, FiLock } from "react-icons/fi";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

function Login({ authenticated, setAuthenticated }) {
  const schema = yup.object().shape({
    email: yup.string().email("E-mail inválido").required("Campo Obrigatório!"),
    password: yup
      .string()
      .min(8, "Mínimo de 8 dígitos")
      .required("Campo Obrigatório!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const history = useHistory();

  const onSubmitFunction = (data) => {
    api
      .post("/user/login", data)
      .then((response) => {
        const { token } = response.data;

        localStorage.setItem("@Doit:token", JSON.stringify(token));

        setAuthenticated(true);

        return history.push("/dashboard");
      })
      .catch((err) => toast.error("Email ou senha inválidos"));
  };

  if (authenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <form onSubmit={handleSubmit(onSubmitFunction)}>
            <h1>Login</h1>
            <Input
              register={register}
              name="email"
              icon={FiMail}
              label="E-mail"
              placeholder="Seu melhor email"
              error={errors.email?.message}
            />
            <Input
              register={register}
              type="password"
              name="password"
              icon={FiLock}
              label="Senha"
              placeholder="Uma senha bem segura"
              error={errors.password?.message}
            />
            <Button type="submit">Enviar</Button>
            <p>
              Não tem uma conta? Faça seu <Link to="/signup">cadastro</Link>
            </p>
          </form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
}

export default Login;
