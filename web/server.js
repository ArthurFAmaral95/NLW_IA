import axios from 'axios'

//configuração do axios
//colocamos o pedaço da url que vai ser padrão para todas as requisições
export const server = axios.create({
  baseURL: 'http://localhost:3333'
})
