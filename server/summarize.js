import { pipeline } from '@xenova/transformers'

import { summaryExample } from './utils/summary.js'

export async function summarize(text) {
  try {
    //return summaryExample
    console.log('Realizando o resumo...')

    //como argumento, definimos o que queremos fazer (o resumo do vídeo) e o modelo que queremos para fazer isso
    const generator = await pipeline(
      'summarization',
      'Xenova/distilbart-cnn-12-6'
    )

    const output = await generator(text)
    console.log('Resumo gerado com sucesso!')
    
    //o retorno é uma lista e o resumo está na primeira posição na propriedade summary_text
    return output[0].summary_text
  } catch (error) {
    console.log('Não foi possivel realizar o resumo.', error)
    throw new Error(error)
  }
}
