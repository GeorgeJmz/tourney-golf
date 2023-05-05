import { messages } from '../../../helpers/messages'

export const getMessage = (errorCode: string): string => {
  return messages[errorCode]
}
