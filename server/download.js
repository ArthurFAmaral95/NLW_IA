//importamos as bibliotecas precisamos
import ytdl from 'ytdl-core'
import fs from 'fs'

//exportamos uma constante para podermos usá-la em outros arquivos
//essa constante guarda um função que é responsável por fazer o download do vídeo
//recebe como parâmetro o id do vídeo que estará como parâmetro da requisição
export const download = videoId =>

  // transformamos o download em uma função assíncrona fazendo ela retornar uma promise
  new Promise((resolve, reject) => {
    //colocamos em uma constante a URL padrão de vídeos shorts do youtube que depois vamos passar como argumento para a biblioteca ytdl que vai fazer o download do vídeo
    //a URL do youtube pode vir com outros parâmetros que não queremos, por isso definimos como precisamos
    //única parte que muda é o id do vídeo
    const videoURL = `https://www.youtube.com/shorts/${videoId}`

    //bom colocar esses logs ao longo do código para vermos no servidor em que parte da execução estamos
    console.log('Downloading video:', videoId)

    //esse método aceita um objeto como argumento com propriedades que vão configurar o arquivo baixado
    ytdl(videoURL, { quality: 'lowestaudio', filter: 'audioonly' })
      //o on vai acompanhar cada etapa do download do vídeo para depois executar o que queremos em cada etapa
      //o primeiro argumento vai ser a ação do processo e o segundo argumento é a função que vai ser executada a partir dessa ação
      //nessa etapa o vídeo está sendo baixado
      .on('info', info => {
        //uma das informações que recebemos é a duração do vídeo
        const seconds = info.formats[0].approxDurationMs / 1000

        //validação que a duração do vídeo é menor que 60 segundos (short)
        if (seconds > 60) {
          throw new Error('Duração do video maior do que 60 segundos.')
        }
      })
      //quando o vídeo terminda de baixar entramos nessa etapa
      .on('end', () => {
        console.log('Download concluído')
        //retorno da promisse quando ela é bem sucedida
        //o retorno é vazio, apenas informamos que a promise foi resolvida com sucesso
        resolve()
      })
      //se temos algum erro durante o download entramos nessa etapa
      .on('error', error => {
        console.log(
          'Não foi possível fazer o download do vídeo. Detalhes do erro:',
          error
        )
        //retorno da promisse se temos alguma falha
        reject(error)
      })
      //pipe é o método responsável por recupar o conteúdo do vídeo e salvar
      //fs vai manipular o arquivo
      //createWriteStream vai transcrever o vídeo e salvar na pasta com o nome e extenção que passamos com argumento. o vídeo tem que ser .mp4
      .pipe(fs.createWriteStream('./temp/audio.mp4'))
  })
