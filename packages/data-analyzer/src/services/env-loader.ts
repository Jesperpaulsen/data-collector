import { EnvInjecter } from 'src/types/env-injecter'

import email from './email'

class EnvLoader {
  private classesToLoad: EnvInjecter[] = [email]

  loadEnvs = () => {
    for (const classToLoad of this.classesToLoad) {
      classToLoad.injectToken()
    }
  }
}

export default new EnvLoader()
