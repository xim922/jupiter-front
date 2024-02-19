import { BsEyeFill, BsFillPencilFill } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";


/* eslint-disable react/prop-types */
const ListaVacantes = ({setSelected_job, vacantes, pagina, setPagina, setVacante, setEliminar}) => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Título</th>
            <th scope="col">Ciudad</th>
            <th scope="col">Experiencia</th>
            <th scope="col">Tipo de Trabajo</th>
  
          </tr>
        </thead>
        <tbody>
         { vacantes.map((item)=>{
            return(
              <tr key={item.job_id}>
              <td>{item.title}</td>
              <td>{item.city}</td>
              <td>{item.experience}</td>
              <td>{item.job_type}</td>
              <td><button type='button' className="btn btn-info" onClick={()=>setVacante(item)}><BsFillPencilFill/></button></td>
              <td><button type='button' className="btn btn-danger" onClick={()=>{setEliminar(item.job_id)}}><BsFillTrash3Fill /></button></td>
              <td><button type='button' className="btn btn-info" onClick={()=>{setSelected_job(item.job_id)}}><BsEyeFill /></button></td>
            </tr>
            )
          })}
          <tr>
            <td colSpan={5}>
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center mt-3">
                {
                    pagina === 1?
                   <li className="page-item disabled"><a className="page-link">Primera</a></li>
                   :
                   <li className="page-item"><a className="page-link"  onClick={()=>setPagina(1)}>Primera</a></li>              
  
                }
                                {
                  pagina > 1 &&
                <li className="page-item"><a className="page-link" onClick={()=>setPagina(pagina - 1)}>{pagina-1}</a></li>
                }

                <li className="page-item active" aria-current="page"><a className="page-link">{pagina}</a></li>
                
                {
                vacantes.length<5?(<></>):(<>
                <li className="page-item"><a className="page-link" onClick={()=>setPagina(pagina + 1)}>{pagina+1}</a></li></>)                
                }
                {
                vacantes.length<5? <li className="page-item disabled"><a  className="page-link">Siguiente</a></li>
                :<li className="page-item"><a  className="page-link" onClick={()=>setPagina(pagina+1)} >Siguiente</a></li>
                }
              </ul>
            </nav>
            </td>
          </tr>
          </tbody>
      </table>
    );
  };
  
  export default ListaVacantes;
  