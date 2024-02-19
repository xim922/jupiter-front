import {BrowserRouter, Route, Routes, Link} from 'react-router-dom'
import Login from "./components/Login"
import Vacantes from './components/Vacantes'
import Register from './components/Register'
import MisVacantes from './components/MisVacantes'
import { useState, useEffect } from 'react'

const App = () => {

  const [user, setUser] = useState(undefined)
  const [pagina, setPagina] = useState(1)

  // Funcion para CERRAR SESION
  const logOut = () => {
    localStorage.clear()
    setUser(undefined)
  }

  // la app estara pendiente de los cambios en user y pagina
    useEffect(() => {
    }, [user, pagina])

  return (
    <BrowserRouter>

  {/* HEADER DE LA PAGINA INICIO- OFERTAS */}
  <nav className="py-2 bg-body-tertiary border-bottom">
    <div className="container d-flex flex-wrap">
      <ul className="nav me-auto">
        <li className="nav-item">
        <Link to= "/" className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis">
        <img src="logohor.png"  className="bi me-2 w-25" />
      </Link>
        </li>
        <li className="nav-item "><Link to= '/' className="nav-link link-body-emphasis px-2"><strong>Inicio</strong></Link></li>
        <li className="nav-item "><Link to= '/' className="nav-link link-body-emphasis px-2">Vacantes</Link></li>
        <li className="nav-item"><a href="#" className="nav-link link-body-emphasis px-2">Ayuda</a></li>
      </ul>
      <ul className="nav">
        {
          user!==undefined?(
            <>
            <li className="nav-item"><Link
             to= '/mis-vacantes' 
             className="nav-link link-body-emphasis px-2">
              Usuario Actual: <strong>{user.username} - {user.company.toUpperCase()} </strong>
              </Link></li>

              <li className="nav-item"><Link
             to= '/login' 
             onClick={logOut} className="nav-link link-body-emphasis px-2 text-danger">
              Cerrar Sesión
              </Link></li>
              </>

          ):(
            <>
            <li className="nav-item"><Link to= '/login' className="nav-link link-body-emphasis px-2">Iniciar Sesión</Link></li>
            <li className="nav-item"><Link to= '/register' className="nav-link link-body-emphasis px-2">Registro</Link></li>
            </>
          )}
      </ul>
    </div>
  </nav>


  {/* ESPACIO DEL CARRUSEL */}
  <div id="myCarousel" className="carousel slide mb-2 " data-bs-ride="carousel">
    <div className="carousel-indicators">
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2" className="active" aria-current="true"></button>
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3" className=""></button>
    </div>
    <div className="carousel-inner">
      <div className="carousel-item active">
        <img src="/slider1.png" className="bd-placeholder-img" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false" />
        <div className="container">
          <div className="carousel-caption text-start ">
            <h1><strong className='.text-primary'>El trabajo de tus sueños está aquí</strong></h1>
            <p className="opacity-75">Encuentra las ofertas que más se ajustan a tu perfil profesional</p>
          </div>
        </div>
      </div>
      <div className="carousel-item ">
      <img src="/slider2.png" className="bd-placeholder-img" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false" />
        <div className="container">
          <div className="carousel-caption">
          </div>
        </div>
      </div>
      <div className="carousel-item">
      <img src="/slider3.png" className="bd-placeholder-img" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false" />
        <div className="container">
          <div className="carousel-caption text-end">
          </div>
        </div>
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>


{/* RUTAS DE LA APLICACION */}
  <div className="container">
      <Routes>
      <Route path="/" element={<Vacantes/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path="/mis-vacantes" element={<MisVacantes pagina={pagina} setPagina={setPagina} setUser={setUser}/>}/>
    </Routes>
  </div>
    </BrowserRouter>
  )
}

export default App
