import { useState } from "react"
import {Navigate} from 'react-router-dom'
import Titulo from "./common/Titulo"
import axios from 'axios'
import Swal from 'sweetalert2'
import Error from './common/Error'
import md5 from 'md5'


const Register = () => {

    // Capturar datos del formulario
    const [logo, setLogo] = useState()
    const [company, setCompany] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [goLogin, setGoLogin] = useState(false)




      // Cargar y previsualizar el logo de la empresa
      const prevLogo = (e) => {
        e.preventDefault();
        let lector = new FileReader()
        lector.readAsDataURL(e.target.files[0])
        lector.onload = () => {
      document.getElementById('logo').src = lector.result    
      setLogo(lector.result)
    }
  }

      // Limpiar los campos del formulario después de enviada la info
       const limpiarCampos = () => {
        setCompany('')
        setEmail('')
        setUsername('')
        setPassword('')
        setPasswordConfirm('')
        setLogo('')
      }

    // Registro de los datos del formulario
  const registro = async (e) => {
    e.preventDefault()

    // OBJETO CON TODA LA INFORMACION
  let dataCom = { company, username,email,logo}

  // VALIDACIONES
  if([company, username, email, password, logo, passwordConfirm].includes('') || [company, username, email, logo, password, passwordConfirm].includes('#')){
    setError(true)
    Swal.fire({
      position: "center",
      icon: 'error',
      title: 'Debe llenar todos los campos',
      showConfirmButton: false,
      timer: 1500
    })
    return 
  }else if(password!==passwordConfirm){
    setPassword('')
    setPasswordConfirm('')
    Swal.fire({
      position: "center",
      icon: 'warning',
      title: 'Las contraseñas no coinciden',
      showConfirmButton: false,
      timer: 1500
    })
    setError(true)
    return 
  }else setError(false)


setLoading(true)
    try{
      const {data} = await axios.post(
        `company`,
        {
          company,
          username, 
          email,
          password,
          logo
        })
        // Mensaje de que han sido guardados los cambios exitosamente
      Swal.fire({
        position: "top-end",
        icon: 'success',
        title: data.message,
        showConfirmButton: false,
        timer: 1500
      })

      // SE CREA UNA SESIÓN y TRAE EL ID DEL USUARIO
      dataCom.id = await data.data.insertId
      const idSession = await md5(dataCom.id+dataCom.email+dataCom.username)
      localStorage.setItem('user', JSON.stringify(dataCom))
      localStorage.setItem('idSession', idSession )
      // si todo está correcto...
      setGoLogin(true)


  }catch(err){
    Swal.fire({
      position: "top-end",
      icon: 'error',
      title: err.message,
      showConfirmButton: false,
      timer: 1500
    })
  }
  limpiarCampos(e)

}
// Si el registro es correcto, entrará a administrar Mis Vacantes
if(goLogin){
  return<
  Navigate to='/mis-vacantes'
  />
}


  return (
    <>
    <Titulo titulo='Registro de Empresas'/>
    <form 
    onSubmit={registro}>
      {/* Imagen slider */}
    <div className="container">
    <div className="row">
    <div className="col-md">
    <img
    width='100%'
    className='mt-4'
    src="/registrofoto.jpg"/>
    </div>


    <div className="col-md card mt-4">
    <h4 className="card-header text-center text-bg-primary">Formulario de Registro</h4>
        
    {/* Formulario de registro de las empresas */}
      <div className="card-body">
        {/* Aquí carga el logo de la empresa */}
          <div className="text-center mt-2 mb-3">
          <img
          id='logo'
          width='150px'
          src='/espacio12.png'/>
          </div>

          {/* Espacio para subir logo de la empresa */}
          <div className="mb-3">
          <label className="form-label">
          Logo de la Empresa
            </label>
          <input
          type="file"
          onChange={prevLogo}                
          className="form-control"
          aria-describedby="emailHelp" />
          </div>

      {/* Campos del formulario  */}
          <div className="mb-3">
          <label className="form-label">
            Nombre de la Empresa
            </label>
          <input
          type="text"
          placeholder="Nombre de la empresa"
          className="form-control"
          aria-describedby="emailHelp"
          onChange={(e) => setCompany(e.target.value)}
          value={company}
          />
          </div>

          <div className="mb-3">
          <label className="form-label">
            Nombre de Usuario
            </label>
          <input
          type="text"
          placeholder="Nombre de usuario"
          className="form-control"
          aria-describedby="emailHelp"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          />
          </div>

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

          <div className="mb-3">
          <label  className="form-label">
          Confirmar Contraseña
          </label>
          <input
          type="password"
          placeholder="Repita la contraseña"
          className="form-control"
          aria-describedby="emailHelp"
          onChange={(e) => setPasswordConfirm(e.target.value)}
          value={passwordConfirm}
          />
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                <button 
                type="submit"
                className="btn btn-success me-md-2">
                Registrar Empresa
                </button>
                
                <button
                className="btn btn-primary" 
                type="button"
                onClick={limpiarCampos}
                >
                Cancelar
                </button>
              </div>

          
      </div>
    </div> 
  </div>
</div>


    </form>
  </>  )
}

export default Register