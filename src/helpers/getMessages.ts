import { messages } from './messages'

export const getMessages = (errorCode: string): string => {
  return messages[errorCode]
}
