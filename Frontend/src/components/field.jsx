import 'bootstrap/dist/css/bootstrap.min.css';
import './field.css';
import PropTypes from 'prop-types';

const Field=({textField,type,loginIcon})=>{
  return (
   <div className="input-group mb-3">
     {loginIcon && (
        <span className="input-group-text" id="basic-addon1">
          <img src={loginIcon} alt="Icon" style={{ width: '20px', height: '20px' }} />
        </span>
      )}
     <input type={`${type}`} className="form-control" placeholder={`${textField}`} aria-label="Username" aria-describedby="basic-addon1"/>
  </div>
)
}

Field.propTypes={
  textField: PropTypes.string.isRequired,
  loginIcon: PropTypes.string,
  type: ProtoType.string
}

Field.defaultProps={
  textField:'Enter Text Here',
  type: 'text',
  loginIcon: null
}

export default Field