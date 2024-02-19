import { BsFillXOctagonFill } from "react-icons/bs";


const Error = (props) => {
  return (
    <div 
    className='alert alert-danger text-center'
    role='alert'>
    <BsFillXOctagonFill/>
    {props.mensaje  || 'Error'}

    </div>
  )
}

export default Error