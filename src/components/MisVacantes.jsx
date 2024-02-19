import md5 from 'md5'
import { useEffect, useState } from 'react';
import {Navigate} from'react-router-dom'
import Error from './common/Error';
import Titulo from './common/Titulo';
import Swal from 'sweetalert2';
import axios from 'axios';
import ListaVacantes from './ListaVacantes';
import ListaPostulaciones from './ListaPostulaciones';


const MisVacantes = ({setUser, pagina, setPagina}) => {
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [goLogin, setGoLogin] = useState(false)
  const [title, setTitle] = useState('')
  const [city, setCity] = useState('')
  const [job_type, setJob_type] = useState('')
  const [experience, setExperience] = useState('')
  const [from_date, setFrom_date] = useState('')
  const [until_date, setUntil_date] = useState('')
  const [company_id, setCompany_id] = useState('')
  const [job_id, setJob_id] = useState('')
  const job_type_list = ['Remoto', 'Presencial', 'Semi-Presencial']

  const [vacantes, setVacantes] = useState([])
  const [postulaciones, setPostulaciones] = useState([])
  const [vacante, setVacante] = useState()
  const [eliminar, setEliminar] = useState()
  const [selected_job, setSelected_job] = useState()

    const loadData = async () => {
      try{
        const {email, username, id, company} = await JSON.parse(localStorage.getItem('user'));
        const idSession =  localStorage.getItem('idSession')
        // setUser me permite llevar la informacion de user
        setUser(JSON.parse(localStorage.getItem('user')))
        setNombre(company)
        setCompany_id(id)
        // Si la contraseña es incorrecta, devuelvase al LOGIN
        if(idSession!==md5(id+email+username)){
          // limpie todos los campos del formulario
          localStorage.clear()
          setGoLogin(true)
        }else{
          getVacantesApi()
        }
        // Si hay algun problema, devuelvase al LOGIN
      }catch(err){
        setGoLogin(true)
        localStorage.clear()

      }
    }

// Para validar la sesión del usuario
    const validarSession = async () => {
      try{
        const {email, username, id, company} = await JSON.parse(localStorage.getItem('user'));
        const idSession =  localStorage.getItem('idSession')
        // setUser me permite llevar la informacion de user
        setUser(JSON.parse(localStorage.getItem('user')))
        setNombre(company)
        setCompany_id(id)
        // Si la contraseña es incorrecta, devuelvase al LOGIN
        if(idSession!==md5(id+email+username)){
          // limpie todos los campos del formulario
          localStorage.clear()
          setGoLogin(true)
          return
        }
        // Si hay algun problema, devuelvase al LOGIN
      }catch(err){
        setGoLogin(true)
        localStorage.clear()
        return

      }
    }

    // Para registrar una nueva vacante
    const registro = async (e) => {
      e.preventDefault()
      validarSession()
      let obj = {title, city, job_type, from_date, until_date, experience, company_id}
      // Validacion para que escoja un tipo de trabajo obligatoriamente y llene todos los campos
     if([title, city, job_type, from_date, until_date, experience, company_id].includes('')){
          Swal.fire({
                  position: "top-end",
                  icon: 'warning',
                  title: 'Debe llenar todos los campos',
                  showConfirmButton: false,
                  timer: 1500
              })
              return

      }else if (!job_type_list.includes(job_type)){
              Swal.fire({
                position: "top-end",
                icon: 'warning',
                title: 'Debe seleccionar el tipo de trabajo',
                showConfirmButton: false,
                timer: 1500
              })
              return
      }else{
            setLoading(true)
            let data
            // para actualizar la vacante
            try{
              if(vacante!==undefined){

                data = await axios.put(`job/${vacante.job_id}`, obj)
              }else{
                data = await axios.post(`job`, obj)
              }
                // Mensaje de que ha guardadao la info exitosamente
              Swal.fire({
                position: "top-end",
                icon: 'success',
                html: `<strong>${data.data.message}</strong>`,
                showConfirmButton: false,
                timer: 2000
              })     

              limpiarCampos()
              getVacantesApi()
        
          }catch(err){
            Swal.fire({
              position: "top-end",
              icon: 'error',
              title: err.message.includes('401')?'Datos incorrectos': err.message,
              showConfirmButton: false,
              timer: 3000
            })
          }
          setLoading(false)

      }
    }
// Metodo para eliminar las vacantes listadas
    const borrar =  () => {
      Swal.fire({
        title: "¿Está seguro?",
        text: "La vacante se eliminará ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#298A08",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, la quiero borrar."
      }).then( async (result) => {
        if (result.isConfirmed) {
          try{
          const {id} = await JSON.parse(localStorage.getItem('user'));
          let obj = await {company_id:id}
          const {data} = await  axios.delete(`job/${eliminar}`, {data:obj})

          Swal.fire(
            "Eliminada",
            data.message,
            "success"
          )
        }catch(e){
          "Eliminada",
          e.message,
          "error"
        }
        }else{
          setEliminar()
        }
      });
    }

    // Para consultar las vacantes por id de empresa
    const getVacantesApi = async () => {
      validarSession()
      try{
        const {email, username, id, company} = await JSON.parse(localStorage.getItem('user'));
          const {data} = await axios.get(`job/all/${id}/${pagina}/5`)
          setVacantes(data)
        }catch(err){
          Swal.fire({
            position: "top-end",
            icon: 'error',
            title: err.message.includes('401')?'Datos incorrectos': err.message,
            showConfirmButton: false,
            timer: 3000
          })
        } 
    }


    // Para consultar las postulaciones de las vacantes
    const getPostulacionesApi = async () => {
      try{
        const {data} = await axios.get(`applications/${selected_job}`)
          setPostulaciones(data)

      }catch(err){
        setPostulaciones([])
        Swal.fire({
          position: "top-end",
          icon: 'warning',
          title: err.message.includes('400')?'No hay postulaciones': err.message,
          showConfirmButton: false,
          timer: 3000
        })
       } 
        }


    //  Para limpiar los campos del formulario de registro de la vacante
    const limpiarCampos = () => {
      setCity('')
      setTitle('')
      setExperience('')
      setFrom_date('')
      setUntil_date('')
      setJob_type('')
      setJob_id('')
      setVacante()
    }
       
    // Está atento a los cambios que haya en las vacantes
    useEffect(() => {
      loadData()
    }, [vacantes])

    useEffect(() =>{
      if(selected_job>0){
        getPostulacionesApi() 
      }
    }, [selected_job])

    useEffect(() => {
      getVacantesApi()
    }, [pagina])

    useEffect(() => {
      if(eliminar>0){
        borrar()
      }     
    }, [eliminar])

    useEffect(() => {
      if(vacante)
      {
      setCity(vacante.city)
      setTitle(vacante.title)
      setExperience(vacante.experience)
      setFrom_date(vacante.from_date.slice(0,10))
      setUntil_date(vacante.until_date.slice(0,10))
      setJob_type(vacante.job_type)
      setJob_id(vacante.job_id)
    }
    }, [vacante])

    // Si goLogin es verdadero, vaya al LOGIN
    if(goLogin){
      return <Navigate to='/login' />
    }


  return (
    <div>
      <>
    <form 
    onSubmit={registro}>
    <div className="container">
    <div className="row">

    <div className="col-md-4">
      {/* Formulario para agregar las vacantes */}
    <Titulo titulo='Gestionar Vacantes' /> 
        <div className="card border mb-3">
          <div className="card-body">
            <h5 className='card-title text-center  mb-3'>Ingrese la Información</h5>

          {/* Campos del formulario  */}
              <div className="mb-3">
              <input
              type="text"
              placeholder="Nombre de la Vacante ej: Developer Jr."
              className="form-control"
              aria-describedby="emailHelp"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              />
              </div>
              
              <div className="mb-3">
              <input
              type="text"
              placeholder="Ciudad"
              className="form-control"
              aria-describedby="emailHelp"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              />
              </div>

              <div className="mb-3">
              <input
              type="number"
              placeholder="Experiencia (años)"
              className="form-control"
              aria-describedby="emailHelp"
              min='1'
              onChange={(e) => setExperience(e.target.value)}
              value={experience}
              />
              </div>

              <div className="mb-3">
              <select
              className="form-select"
              aria-describedby="emailHelp"
              min='1'
              onChange={(e) => setJob_type(e.target.value)}
              value={job_type}
              >
                <option value=''>Tipo de Trabajo</option>
                {
                  job_type_list.map((item, index) =>{
                    return <option key={index} value={item}>{item}</option>
                  })
                }
              </select>
              </div>

              <div className="mb-3">
              <label className="form-label">
              Fecha Publicación de la Vacante
            </label>
              <input
              type="date"
              placeholder={Date.now()}
              className="form-control"
              aria-describedby="emailHelp"
              min={new Date().toISOString().slice(0,10)}
              onChange={(e) => setFrom_date(e.target.value)}
              value={from_date}
              />
              </div>

              <div className="mb-3">
              <label className="form-label">
              Fecha Cierre de la Vacante
            </label>
              <input
              type="date"
              className="form-control"
              aria-describedby="emailHelp"
              min={new Date().toISOString().slice(0,10)}
              onChange={(e) => setUntil_date(e.target.value)}
              value={until_date}
              />
              </div>

              {error && <Error
              mensaje='  ERROR Todos los campos son obligatorios  '
              />}

              <div className="d-grid">
                {
                  loading?
                  <>
                    <div className="spinner-border text-primary text-center mx-auto" role="status">
                    </div>        
                  </>
                :(
                  <>
                  {
                    vacante?<button type="submit" className="btn btn-warning text-bg-warning me-md-2">Guardar Cambios</button>:<button type="submit" className="btn btn-success text-bg-warning me-md-2">Publicar Vacante</button>  
  
                  }
                   
                    {/* Limpia los campos del formulario */}
                    <button 
                    onClick={limpiarCampos}
                    type="button"
                    className="btn btn-info mt-2 me-md-2"
                   
                    >
                    Cancelar
                    </button>  
                  </>
                )       
              }
                  </div>
          </div>
          </div>
      </div> 

      <div className="col-md-8">
     
      <Titulo titulo='Postulaciones' /> 
      <div className='card border mb-3'>
        <div className='card-body'>
          <ListaPostulaciones  postulaciones={postulaciones}/>
        </div>
      </div>

      <Titulo titulo='Listado de Vacantes' /> 
      <div className='card border mb-3'>
        <div className='card-body'>
          <ListaVacantes setSelected_job={setSelected_job} setEliminar={setEliminar} pagina={pagina} setPagina={setPagina} vacante={vacante}  setVacante={setVacante} vacantes={vacantes}/>
        </div>
      </div>
 
      </div>

      

  </div>
</div>


    </form>
      </>


    </div>
  )
}

export default MisVacantes