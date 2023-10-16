import { defineStore } from 'pinia'
import { Options, INavBarInfo } from '@/types/system'

const useSystem = defineStore({
  /** 区分不通状态的唯一标识 */
  id: 'system',
  /** 状态 */
  state: () => ({
    options: {} as Options,
    navBarInfo: {} as INavBarInfo,
  }),
  actions: {
    init(options: Options, navBarInfo: INavBarInfo) {
      this.options = options
      this.navBarInfo = navBarInfo
    },
  },
})
export { useSystem }
