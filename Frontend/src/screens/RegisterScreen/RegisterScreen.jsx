import React from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import { register } from '../../services/authService'
import useRequest from '../../hooks/useRequest'
import './RegisterScreen.css'

function RegisterScreen() {

  const initial_state = { name: '', email: '', password: '' }
  const { formState, handleChangeInput } = useForm(initial_state)
  const { loading, response, error, sendRequest } = useRequest()

  async function handleSubmit(event) {
    event.preventDefault()
    sendRequest(
      () => register(formState.name, formState.email, formState.password)
    )
    console.log('Usuario intenta registrarse', formState)
  }


  return (
    <div className='auth-page'>
      <main className='auth-card'>
        <div className='register-head'>
          <h1 className='register-title'>Registro de usuario</h1>
          <p className='register-subtitle'>
            Creá tu cuenta y empezá a colaborar con tu equipo.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='field'>
            <label className='field-label' htmlFor='name'>Nombre:</label>
            <input
              className='field-input'
              name='name'
              id='name'
              type='text'
              autoComplete='name'
              placeholder='Tu nombre'
              value={formState.name}
              onChange={handleChangeInput}
            />
          </div>

          <div className='field'>
            <label className='field-label' htmlFor='email'>Email:</label>
            <input
              className='field-input'
              name='email'
              id='email'
              type='email'
              autoComplete='email'
              placeholder='tu@email.com'
              value={formState.email}
              onChange={handleChangeInput}
            />
          </div>

          <div className='field'>
            <label className='field-label' htmlFor='password'>Password:</label>
            <input
              className='field-input'
              name='password'
              id='password'
              type='password'
              autoComplete='new-password'
              placeholder='••••••••'
              value={formState.password}
              onChange={handleChangeInput}
            />
          </div>

          {
            error
            &&
            !loading
            &&
            <span className='form-error' role='alert'>{error}</span>
          }

          {
            loading
              ? <button className='btn-primary' type='submit' disabled={true}>Cargando...</button>
              : <button className='btn-primary' type='submit'>Registrarse</button>
          }

          {
            response
            &&
            !loading
            &&
            <span className='form-success' role='status'>Registro exitoso</span>
          }
        </form>

        <p className='form-footer'>
          ¿Ya tenés una cuenta?{' '}
          <Link className='link' to='/login'>Iniciá sesión</Link>
        </p>
      </main>
    </div>
  )
}

export default RegisterScreen