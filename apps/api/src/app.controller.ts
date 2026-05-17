import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'PEDIZI API',
      version: '1.0.0',
      description: 'O delivery da sua cidade.',
      docs: '/api/docs',
      health: '/api/v1/health',
    }
  }
}
