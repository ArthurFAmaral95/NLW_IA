//importando a constante que usa o axios
import { server } from './server.js'

const form = document.querySelector('#form')
const input = document.querySelector('#url')
const content = document.querySelector('#content')

//a função tem que ser assíncrona porque vamos trabalhar com promisses. fazemos requisições pro server e temos que esperar as respostas antes de continuar para a próxima etapa
form.addEventListener('submit', async e => {
  //impede que a página seja recarragada assim que o form é enviado
  e.preventDefault()

  //adiciona a classe placeholder no parágrafo para garantir que toda vez que o form foi enviado não seja possível selecionar o conteúdo do parágrafo
  content.classList.add('placeholder')

  const videoURL = input.value

  //verifica se o vídeo é um short
  if (!videoURL.includes('shorts')) {
    //usamos o return para quando essa condição for atendida o resto do código que está fora do if não seja executado
    return (content.textContent = 'Esse vídeo não parece ser um short.')
  }

  //colocar a variável entre colchetes é uma notação para atribuir cada posição do array à uma variável
  //como o que nos interessa é a segunda posicão do array que vai retornar do split, usamos _ para nomear a primeira variável
  const [_, params] = videoURL.split('/shorts/')

  //usamos o split novamente porque o parâmetro pode vir com mais informações que somente o id do vídeo
  //como só queremos a primeira posição do array só precisamos nomear ela, por isso só temos uma variável entre colchetes
  const [videoId] = params.split('?si')

  content.textContent = 'Obtendo o texto do audio...'

  //usamos o get como tipo de requisição
  //summary é a rota que usamos no server
  //temos que usar o await para esperar essa etapa terminar entes de passar pra próxima etapa
  const transcription = await server.get('/summary/' + videoId)

  content.textContent = 'Realizando o resumo...'

  //usamos o post como tipo de requsição. mesmo método usado no index.js para fazer o resumo do vídeo
  //passamos o argumento da função summarize (texto transcito) como um objeto que tem a propriedade texto
  const summary = await server.post('/summary', {
    text: transcription.data.result
  })

  content.textContent = summary.data.result

  //remove a classe placeholder no parágrafo para liberar o texto resumo ser selecionado pelo usuário
  content.classList.remove('placeholder')
})
