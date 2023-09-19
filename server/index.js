//importamos as duas bibliotecas
import cors from 'cors'
import express from 'express'

//importamos as funções dos outros arquivos que vamos usar nesse
//não esquecer do .js se não vai dar erro
import { convert } from './convert.js'
import { download } from './download.js'
import { transcribe } from './transcribe.js'
import { summarize } from './summarize.js'

//iniciamos o express e colocamos dentro de uma constante
const app = express()

//comando para informar ao express que ele também vai receber conteúdo no formato json
app.use(express.json())

//usamos o método use e o cors para habilitar a conexão entre front end e back end
app.use(cors())

//especificamos qual a ação (método) da solicitação (get)
//depois colocamos o recurso e a função a ser executada
//recurso é o /summary
//para passar um parâmatro no request temos que usar o : antes do nome do parâmetro
app.get('/summary/:id', async (request, response) => {
  try {
    //request é o pedido para o servido, params são todos os parâmetros desse request (no caso id) e id é o nome do parâmetro
    //chamamos a função download e passamos o argumento necessário (videoId)
    await download(request.params.id)

    //chamamos a função que vai converter o vídeo
    const audioConverted = await convert()

    //chamamos a função que vai transcrever o audio passando o audio convertido como parâmetro
    const result = await transcribe(audioConverted)

    //retono da requisição bem sucedida. objeto com o resultado: audio transcrito
    //usamos o json para retornar um objeto e no front end podermos acessar a propriedade result
    //quando criamos o objeto passando apenas o nome de uma variável, o js entende que o nome da chave vai ser o nome da variável e o valor vai ser o conteúdo da variável
    return response.json({ result })
  } catch (error) {
    return response.json({ error })
  }
})

//usamos a rota post para resumir o vídeo
app.post('/summary', async (request, response) => {
  try {
    //chamamos a função de resumo do vídeo e passamos para ela o texto transcrito que vai estar no corpo da requisição
    const result = await summarize(request.body.text)
    return response.json({ result })
  } catch (error) {
    return response.json({ error })
  }
})

//iniciamos o servidor
//aqui ele fica escutando a porta especificada (3333)
//assim que o servidor começar a rodar ele vai executar a função
//o console é o do servidor, não o do navegador. mensagem vai aparecer no terminal quando executarmos o servidor por lá
app.listen(3333, () => {
  console.log('Server is running on port 3333')
})
