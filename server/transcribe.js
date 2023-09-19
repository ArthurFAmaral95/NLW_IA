import { pipeline } from '@xenova/transformers'

import { transcriptionExample } from './utils/transcription.js'

//função também tem que ser assíncrona
export async function transcribe(audio) {
  try {
    //return transcriptionExample -> mock

    console.log('Realizando a transcrição...')

    //função pipeline que vai fazer a transcrição do vídeo
    //como argumento, o que queremos que seja feito e o modelo que queremos usar
    const transcribe = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-small'
    )

    //como argumento, um objeto com propriedades para configurar a transcrição
    const transcription = await transcribe(audio, {
      chunk_length_s: 30,
      stride_length_s: 2,
      language: 'portuguese',
      task: 'transcribe'
    })

    console.log('Transcrição finalizada')


    //o retorno da IA é um objeto e a transcrição está na propriedade text
    //a ? é para caso o retorno seja nulo, não tenhamos erro na aplicação
    //oo replace é para se o vídeo tiver música não apareça a palavra música na transcrição
    return transcription?.text.replace('[Música]', '')
  } catch (error) {
    throw new Error(error)
  }
}
