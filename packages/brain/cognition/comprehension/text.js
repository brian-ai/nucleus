import { NLP } from '@brian-ai/services'

const classifySubjects = sentence => {
  const { classify, LanguageProcessor } = NLP
  classify(sentence, LanguageProcessor)
}

export default classifySubjects
