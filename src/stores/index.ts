import { App } from 'vue'
import { createPinia } from 'pinia'
export { useCounter } from './count'
export { useSystem } from './system'
export { useUser } from './user'
export { usePerson } from './person'
export { useDictionary } from './dictionary'
export { useRecite } from './reciteWords'
export { useAuthoritative } from './authoritative'
export { useIntelligentQuestion } from './intelligentQuestion'
export { useAnswerPk } from './answerPk'



export const store = createPinia()

export function setupStore(app: App) {
  app.use(store)
}
