//manipula os arquivos no diretório
import fs from 'fs'
//converter o vídeo para formato wav
import wave from 'node-wav'
//manipular o audio
import ffmpeg from 'fluent-ffmpeg'
//aponta qual biblioteca da ffmpeg vamos usar
import ffmpegStatic from 'ffmpeg-static'

//local onde o vídeo a ser resumido está salvo
const filePath = './temp/audio.mp4'
// onde vamos salvar o arquivo convertido
//trocamos o formato do vídeo
const outputPath = filePath.replace('.mp4', '.wav')

//função que vai converter o vídeo.
//também vai retornar uma promise
export const convert = () =>
  new Promise((resolve, reject) => {
    console.log('Convertendo o vídeo...')

    //para podermos usar o ffmpeg
    ffmpeg.setFfmpegPath(ffmpegStatic)

    ffmpeg()
      //onde está o arquivo
      .input(filePath)
      //frequencia do audio
      .audioFrequency(16000)
      //vamos ter o retorno de uma lista e o audio vai estar na primeira posição
      .audioChannels(1)
      //formato do arquivo
      .format('wav')
      //o que a função vai fazer quando o processo terminar
      .on('end', () => {
        //ler o arquivo. argumento é o caminho do arquivo
        const file = fs.readFileSync(outputPath)
        //decodificamos o arquivo. pegamos o audio e transformamos em código
        const fileDecoded = wave.decode(file)
        //pegamos o audio
        const audioData = fileDecoded.channelData[0]
        //pegamos o audio e transformamos no objeto do tipo float 32 array que é o formato que a IA precisa
        const floatArray = new Float32Array(audioData)

        console.log('Vídeo convertido com sucesso!')

        //quando a promise for concluída com sucesso, retornamos o float array
        resolve(floatArray)

        //deleta o arquivo do vídeo depois que ele foi convertido
        fs.unlinkSync(outputPath)
      })
      .on('error', error => {
        console.log('Erro ao converter o vídeo', error)
        reject(error)
      })
      //se tudo der certo salvamos o arquivo
      .save(outputPath)
  })
