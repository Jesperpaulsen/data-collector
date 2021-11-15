/* eslint-disable camelcase */
import { Response } from 'node-fetch'

declare module 'mailersend' {
  export type Tags = [string, string, string, string, string]

  export interface Substitution {
    var: string
    value: string
  }

  export interface Variables {
    email: string
    substitutions: Substitution[]
  }

  export interface Personalization {
    email: string
    data: Record<string, unknown>
  }

  export interface MailerSendOptions {
    /**
     * Your MailerSend API Key
     * @required
     */
    api_key: string
  }

  export interface EmailParamsOptions {
    from: string
    fromName: string
    recipients: Recipient[]
    cc?: Recipient[]
    bcc?: Recipient[]
    attachments?: Attachment[]
    subject: string
    html: string
    text: string
    templateId?: string
    variables?: Variables[]
    personalization?: Personalization[]
    tags?: Tags
  }

  export default class MailerSend {
    constructor(options: MailerSendOptions)

    send(options: EmailParams): Promise<Response>
  }

  export class Recipient {
    constructor(email: string, name: string)
  }

  export class EmailParams {
    constructor(options?: EmailParamsOptions)

    setFrom(from: string): EmailParams
    setFromName(fromName: string): EmailParams
    setRecipients(recipients: Recipient[]): EmailParams
    setCc(cc: Recipient[]): EmailParams
    setBcc(bcc: []): EmailParams
    setAttachments(attachments: Attachment[]): EmailParams
    setSubject(subject: string): EmailParams
    setHtml(html: string): EmailParams
    setText(text: string): EmailParams
    setTemplateId(templateId: string): EmailParams
    setVariables(variables: Variables[]): EmailParams
    setPersonalization(personalization: Personalization[]): EmailParams
    setTags(tags: Tags): EmailParams
  }

  export class Attachment {
    constructor(content: string, filename: string)

    setContent(content: string): Attachment
    setFilename(filename: string): Attachment
  }
}
