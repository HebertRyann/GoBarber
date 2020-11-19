/* eslint-disable camelcase */
import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background, AnimationContainer } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../Hooks/Toast';

interface SignUpDataForm {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignUpDataForm) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('email obrigatorio').email('digite um email valido'),
        password: Yup.string().min(6,'no minimo 6 caracteres'),
      });
      await schema.validate(data,{abortEarly: false});

      await api.post('/users', data);
      history.push('/')
      addToast({
        type: 'success',
        title: 'Cadastro Realizado',
        description: 'Voce Ja pode fazer seu logon no GoBarber'
      })
    } catch (err) {
      if(err instanceof Yup.ValidationError){

        const errros = getValidationErrors(err)
  
        formRef.current?.setErrors(errros);
        return; 
      }

      addToast({
        title: 'Erro no Cadastro',
        type: 'error',
        description: 'Erro ao Fazer o Cadastro Tente Novamente'
      });
    }

    
  }, [addToast, history]);

  return (
  <Container>
    <Background />
    <Content>
      <AnimationContainer>
        <img src={logoImg} />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu Cadastro</h1>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />
          <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
          <Button type="submit">Cadastrar</Button>
        </Form>
        <Link to="/">
          <FiArrowLeft />
            Voltar para Home
            </Link>
      </AnimationContainer>

    </Content>

  </Container>
  );
}


export default SignUp;