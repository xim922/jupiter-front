import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import axios from "axios"
import { Navigate } from "react-router-dom"



const VacantesPublicas = () => {

    const [vacantes, setVacantes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [titulo, setTitulo] = useState("")

    // Informacion del usuario que aplicara a la vacante
    const [cc, setCc] = useState("")
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [foto, setFoto] = useState("")
    const [salary, setSalary] = useState("")
    const [job_id, setJob_id] = useState(0)
    const [persons_id, setPersons_id] = useState(0)


// Limpiar los campos del formulario después de enviada la info
      const limpiarCampos = () => {
          setCc('')
          setCorreo('')
          setNombre('')
          setFoto('')
          setJob_id(0)
          setPersons_id(0)
          setSalary(0)

      }
  
// Registro de los datos del formulario 
     const aplicar = async (e) => {
      e.preventDefault()
  
      // OBJETO CON TODA LA INFORMACION
    let persona = { dni:cc, name:nombre,email:correo,img:foto}
  
    // VALIDACIONES
    if([cc,nombre,correo,foto].includes('')){
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
        const {data} = await axios.post(`persons`,persona)
        let idPersona
      try{
        // SE CREA UNA SESIÓN y TRAE EL ID DEL USUARIO
        idPersona = await data.data.insertId
      }catch(err){
        idPersona = await data.persons_id
      }

      // Ajustes para evitar la doble postulacion a una misma vacante
      const respuesta = await axios.post(`apply`,{
        job_id,
        persons_id: idPersona,
        salary
      })

        Swal.fire({
          position: "center",
          icon: 'success',
          title: respuesta.data.message,
          showConfirmButton: false,
          timer: 1500
        })    
             // Limpia los campos del formulario
    limpiarCampos()
  
    }catch(err){
      Swal.fire({
        position: "top-end",
        icon: 'error',
        title: err.message.includes("400")?"Ya aplicó a una vacante":err.message,
        showConfirmButton: false,
        timer: 1500
      })
    }
    setLoading(false)
    limpiarCampos()

  }

  const getVacantes = async () => {
    try {
      const { data } = await axios.get(`job/all/1/5`);
      setVacantes(data);
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: err.message.includes("401") ? "Datos incorrectos" : err.message,
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };


// Captura el evento extrae la información y la pasa
  const readImg = async (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setFoto(reader.result);
    }
  }

  // función para eliminar la foto
  const limpiarFoto = () =>{
    setFoto("")
  }

    //   Esta pendiente de las vacantes y las va a listar
      useEffect(() => {
        getVacantes()
      }, [vacantes])



  return (
        <>
        <div className="row " >
        <div className="col-md-10 mx-auto">
        { vacantes.map((item)=>{
            return(
            
                  <div className="card my-3" key={item.job_id}>
                    <div className="card-body d-flex flex-grow">
                    <div className="flex-grow-1">
                      <div className="">
                    <h5 className="card-title text-center">{item.title}</h5>
                      <p className="card-text ">
                      <h5 className="text-primary"><strong>{item.company}</strong></h5>
                     <div className="d-flex flex-grow"> <img src={item.logo} width={44} />{" "}
                     </div>
                        {"  "}
                        <p>
                        Ubicación: <strong>{item.city}{" "} - {item.job_type}</strong></p>
                        {" "}
                        Experiencia requerida (años): <strong>{item.experience} </strong></p>
                        <p>
                        <span className="text-info-emphasis"><strong>Oferta cerrará en: </strong>{item.dias} días</span>
                        </p>
                      </div>
                      </div>

                      <a href="#"  onClick={()=> {
                        setJob_id(item.job_id)
                        setTitulo(item.title)
                      }} className="btn btn-lg btn-primary my-auto " data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">
                        Aplicar a Vacante
                        </a>
                    </div>
                  </div>
            )
          })}
        </div>
        </div>




{/* Ventana modal para aplicar a la vacante */}

<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Aplicar a la vacante <span className="text-primary">{titulo}</span></h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <form>
          {/* Si hay foto, devuelva todo eso */}
          {
            foto && (
              <div className="mb-3 ">
              <img src={foto}  height={100}/>
              <button title="Quitar foto"  type="button" className="btn-close" onClick={limpiarFoto}></button>
              </div>
            )
          }
          <div className="mb-3">
            <label for="recipient-name" className="col-form-label">Documento:</label>
            <input type="number" value={cc} placeholder="Ingrese su cédula sin puntos o comas" className="form-control" 
            onChange={(e) => {
              setCc(e.target.value);
            }}
            />
          </div>
          <div className="mb-3">
            <label for="recipient-name" className="col-form-label">Nombre completo:</label>
            <input type="text" value={nombre} placeholder="Ingrese su nombre" className="form-control" 
                onChange={(e) => {
                  setNombre(e.target.value)
                }}/>
          </div>
          <div className="mb-3">
            <label for="recipient-name" className="col-form-label">Correo electrónico:</label>
            <input type="email" value={correo}  placeholder="Ingrese su correo" className="form-control" 
                onChange={(e) => {
                  setCorreo(e.target.value);
                }}
            />
          </div>
          <div className="mb-3">
            <label for="recipient-name" className="col-form-label">Salario en pesos:</label>
            <input type="number" value={salary}  placeholder="Ingrese el salario al que aspira" className="form-control"
                onChange={(e) => {
                  setSalary(e.target.value);
                }}
            />
          </div>
          <div className="mb-3">
            <label for="recipient-name" className="col-form-label">Foto:</label>
            <input type="file" className="form-control" onChange={readImg}/>
          </div>
        
        </form>
      </div>
 
    {/* Esto nos permite cerrar la ventana del modal: data-bs-dismiss="modal"  */}
      <div className="modal-footer">
        <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={aplicar}>Aplicar a la vacante</button>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
        </>
  )
}

export default VacantesPublicas