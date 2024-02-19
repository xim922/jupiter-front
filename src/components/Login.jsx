import { useState } from "react"
import Titulo from "./common/Titulo"
import {Navigate} from 'react-router-dom'
import Swal from "sweetalert2"
import md5 from 'md5'
import axios from "axios"
import Error from "./common/Error"



const Login = () => {

    // Capturar datos del formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [goMisVacantes, setGoMisVacantes] = useState(false)

  const login = async (e) => {
    e.preventDefault()

  // VALIDACIONES
  if([ email, password].includes('') || [email, password].includes('#')){
    setError(true)
    Swal.fire({
      position: "center",
      icon: 'error',
      title: 'Debe llenar todos los campos',
      showConfirmButton: false,
      timer: 1500
    })
    return 
  }else setError(false)


setLoading(true)
    try{
      const {data} = await axios.post(
        `login`,
        {
          email,
          password,
        })
        // Mensaje de que ha ingresado exitosamente
      Swal.fire({
        position: "top-end",
        icon: 'success',
        html: `Bienvenido a <strong>${data.company}</strong>`,
        showConfirmButton: false,
        timer: 2000
      })

      let dataCom = {email}

      // SE CREA UNA SESIÓN y TRAE EL ID DEL USUARIO
      dataCom.id = await data.company_id
      dataCom.company = await data.company
      dataCom.username = await data.username
      dataCom.email = await data.email
      dataCom.logo = await data.logo

      const idSession = await md5(dataCom.id+dataCom.email+dataCom.username)
      localStorage.setItem('user', JSON.stringify(dataCom))
      localStorage.setItem('idSession', idSession )
      // si todo está correcto...
      setGoMisVacantes(true)


  }catch(err){
    Swal.fire({
      position: "top-end",
      icon: 'error',
      title: err.message.includes('401')?'Verifique los datos de inicio de sesión': err.message,
      showConfirmButton: false,
      timer: 3000
    })
  }

}

if(goMisVacantes){
  return<
  Navigate to='/mis-vacantes'
  />
}

  return (
    <>
    <Titulo titulo='Iniciar Sesión'/>
    <form 
    onSubmit={login}>
      {/* Imagen vertical*/}
    <div className="container">
  <div className="row">
    <div className="col-md">
    <img
    width='100%'
    className='mt-4 w-75'
    src="/imglogin.svg"/>
    </div>


    <div className="col-md card mt-4">
    <h4 className="card-header text-center text-bg-primary">LOGIN</h4>
        
    {/* Formulario de registro de las empresas */}
      <div className="card-body">

      {/* Campos del formulario  */}

          <div className="mb-3">
          <label className="form-label">
            Correo Electrónico
            </label>
          <input
          type="email"
          placeholder="email"
          className="form-control"
          aria-describedby="emailHelp"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          />
          </div>
          
          <div className="mb-3">
          <label  className="form-label">
          Contraseña
          </label>
          <input
          type="password"
          placeholder="Contraseña"
          className="form-control"
          aria-describedby="emailHelp"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          />
          </div>

          {error && <Error
          mensaje='  ERROR Todos los campos son obligatorios  '
          />}

          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                <button 
                type="submit"
                className="btn btn-success me-md-2">
                Ingresar
                </button>
                
              </div>

          
      </div>
    </div> 
  </div>
</div>


    </form>
  </>
    )
}

export default Login