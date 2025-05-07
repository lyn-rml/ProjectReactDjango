import React from 'react'
import { BsDownload } from "react-icons/bs";
import { Form,Button } from 'react-bootstrap';
const Main1stage = ({checked,label,id,name,onChange,type,value,supers,name1,name2,type1,type2,min,max,value1,value2,id1,id2,pattern,required,accept,checkbox,file,readonly,onClick,onlod,linkto,browse_edit,browseval}) => {
  return (
       <Form.Group className="d-flex flex-column pt-1 pb-1 pl-1  w-50 w-md-20 ">
        {browse_edit?
         <Form.Label htmlFor={name} style={{color:"white",marginLeft:"17%"}} className=" align-self-center text-nowrap">{label}:</Form.Label>
        : <Form.Label htmlFor={name} style={{color:"white"}} className="align-self-center text-nowrap">{label}:</Form.Label>}
       {/* browse input + readonly input for previous pdf file */}
       {browse_edit?
       <Form.Group 
       className="d-flex flex-column flex-xl-row ml-17">
         <div className="d-flex flex-column"> 
          {(value2!=="")?<Form.Control autocomplete="false" type={type1} className= {`${supers} w-full h-50 w-lg-40  align-self-center`} size="sm" value={value1} id={id1} onLoad={onlod}
        accept={accept} readOnly={readonly} required={required} name={name1} pattern={pattern}
        onChange={onChange} />
        :""}
        {/* <div style={{display:"flex",flexDirection:"row"}}
        className=" w-full w-xl-40"> */}
        {/* style={{width:"80%",marginLeft:"1rem"}} */}
        {(browseval!==0 && value2!=="")?<Form.Control autocomplete="false" type={type2}  onLoad={onlod} class= {`${supers} h-40 mt-3 w-full d-none d-xl-block w-100`} value={value2} id={id2}
        accept={accept} readOnly={readonly} required={required} name={name} pattern={pattern}
        onChange={onChange}/>
        :
        // <Form.Control autocomplete="false" type={type2}  onLoad={onlod} className= {`${supers} h-40 mt-3 w-full d-none d-xl-block w-100`} value={value2} id={id2}
        // accept={accept} readOnly={readonly} required={required} name={name} pattern={pattern}
        // onChange={onChange}/>}
        ""}
         </div>  
       {(browseval!==0)?<span style={{height:"120%",background:"white",padding:"1rem",borderRadius:"10px",marginLeft:"1rem"}}
        className="d-none d-xl-block"><a href={linkto} target="blank" style={{width:"10%",height:"50%"}}><BsDownload/></a></span>:""}
        {(browseval!==0)?<Button  className="text-white bg-warning d-xl-none w-full" size="sm" href={linkto}>
          Download
        </Button>:""}
       </Form.Group>
       // {/*checkbox input */}
        :
        // class= {`${checkbox} ${supers}`}
       checkbox?<input autocomplete="false" type={type} className="w-50"  onLoad={onlod} value={value} id={id}
        accept={accept} required={required} name={name} checked={checked} pattern={pattern} onChange={onChange} />
        //Normal input
        :<a href={linkto} target="blank"><input autocomplete="false" type={type} min={min} max={max} onLoad={onlod} class= {`form-control ${supers}`} value={value} id={id}
         files={file} accept={accept} readOnly={readonly} required={required} name={name} pattern={pattern}
          onChange={onChange} /></a>}
    </Form.Group>
    
  )
}

export default Main1stage