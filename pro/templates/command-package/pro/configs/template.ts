import type { SdinTemplateMeta } from 'sdin'

export const sdinTemplateMeta: SdinTemplateMeta = {
  name: 'command-package',
  description: 'dedicated to command-line interaction',
  questions: [
    {
      type: 'input',
      name: 'commandName',
      message: "What's your project main command name?",
      required: true,
      validate: (str: string) => {
        return /^[a-z0-9][a-z0-9\-]{0,28}[a-z0-9]$/.test(str)
      }
    }
  ]
}
