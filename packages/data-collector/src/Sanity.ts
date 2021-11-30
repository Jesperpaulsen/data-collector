import { Tip } from '@data-collector/types'
import sanityClient from '@sanity/client'

class Sanity {
  private client = sanityClient({
    projectId: 'u4tlz7dc',
    apiVersion: '2021-03-25',
    dataset: 'production'
  })

  fetchTips = async () => {
    const tips = await this.client.fetch<Tip[]>(
      `*[_type == "tip" && published == true] | order(_createdAt desc)`
    )
    return tips
  }
}

export default new Sanity()
