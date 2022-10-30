import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';  
import cadastro from './assets/cadastro.png';

function App() {

  //url para pegar todos os dados cadastrados.
  const baseUrl= "https://localhost:44395/api/DestinoApi";

  const [data, setData] = useState([]);

  const[updateData, setUpdateData] = useState(true);

  //controle da janela modal cadastrar
  const [modalIncluir,setModalIncluir]= useState(false);

  //controle da janela modal editar
  const [modalEditar, setModalEditar]=useState(false);

  //Controle de janela modal excluir
  const [modalExcluir, setModalExcluir]=useState(false);

  const [destinoSelecionado, setDestinoSelecionado]=useState({
    id: '',
    cidadeNome: '',
    pais: ''
  })

  //Excluir
  const abrirFecharModalExcluir=()=>{
    setModalExcluir(!modalExcluir);
  }

  //Selecionar e excluir  
  const selecionarDestino = (destino, opcao)=>{
    setDestinoSelecionado(destino);
    (opcao === "Editar") ? abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  //alterna entre estados aberto e fechado
  const abrirFecharModalIncluir=()=>{
    setModalIncluir(!modalIncluir);
  }

  //editar
  const abrirFecharModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const handleChange = e =>{
    const {name,value} = e.target;
    setDestinoSelecionado({
      ...destinoSelecionado,
      [name]: value
    });
    console.log(destinoSelecionado);
  }

  //Get  
  const pedidoGet = async()=>{
    await axios.get(baseUrl)
    .then(response =>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  //post
  const pedidoPost= async()=>{
    delete destinoSelecionado.id;
      await axios.post(baseUrl, destinoSelecionado)
      .then(response=>{
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      }).catch(error=>{
        console.log(error);
      })
  }

  //Put
  const pedidoPut=async()=>{
    await axios.put(baseUrl+"/"+destinoSelecionado.id, destinoSelecionado)
    .then(response=>{
      var resposta=response.data;
      var dadosAuxiliar=data;
      dadosAuxiliar.map(destino=>{
        if(destino.id===destinoSelecionado.id){
          destino.cidadeNome=resposta.cidadeNome;
          destino.pais=resposta.pais;
        }
      });
      setUpdateData(true);
      abrirFecharModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  //Delete
  const pedidoDelete = async()=>{
    await axios.delete(baseUrl+"/"+destinoSelecionado.id)
    .then(response=>{
      setData(data.filter(destino => destino.id !== response.data));
        setUpdateData(true);
        abrirFecharModalExcluir();
    }).catch(error=>{
      console.log(error);
    })
  }

  useEffect(()=>{
    if(updateData){
      pedidoGet();
      setUpdateData(false);
    }
  },[updateData])

  return (

    <div className="destino-container">
      <h1>Destinos</h1>
      <hr className='container'/>
      <h3>Cadastro de Lugares</h3>

      <header>
        <img src={cadastro} alt="Cadastro"/>
        <button className="btn btn-success" onClick={()=>abrirFecharModalIncluir()}>Incluir novo destino</button>
      </header>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Cidade</th>
            <th>País</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(destino=>(
            <tr key={destino.id}>
              <td>{destino.id}</td>
              <td>{destino.cidadeNome}</td>
              <td>{destino.pais}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>selecionarDestino(destino,"Editar")}>Editar</button>{" "}
                <button className="btn btn-danger" onClick={()=>selecionarDestino(destino,"Excluir")}>Excluir</button>
              </td>
            </tr>
          ))}
        
        </tbody>
      </table>
      
      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Destino</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Cidade: </label>
            <br/>
            <input type="text" name="cidadeNome" onChange={handleChange} className="form-control"/>
            <br/>
            <label>País: </label>
            <br/>
            <input type="text" name="pais" onChange={handleChange} className="form-control"/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={()=>pedidoPost()}>Cadastrar</button>{" "}
          <button className="btn btn-danger" onClick={()=>abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Destino</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id: </label>
            <input type="text" className="form-control" readOnly value={destinoSelecionado && destinoSelecionado.id}/>
            <br />
            <label>Cidade: </label>
            <br/>
            <input type="text" name="cidadeNome" onChange={handleChange} className="form-control"
            value={destinoSelecionado && destinoSelecionado.cidadeNome}/>
            <br/>
            <label>País: </label>
            <br/>
            <input type="text" name="pais" onChange={handleChange} className="form-control"
            value={destinoSelecionado && destinoSelecionado.pais}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={()=>pedidoPut()}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={()=>abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>    

      <Modal isOpen={modalExcluir}>

        <ModalBody>
          Comfirma a exclusão deste destino : {destinoSelecionado && destinoSelecionado.cidadeNome}?    
        </ModalBody>

        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>pedidoDelete()}> Sim </button>
          <button className="btn btn-secondary" onClick={()=>abrirFecharModalExcluir()}> Não </button>
        </ModalFooter>

      </Modal>  


    </div>
  );
}

export default App;
