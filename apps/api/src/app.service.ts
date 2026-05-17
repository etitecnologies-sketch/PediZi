import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getRoot() {
    return {
      name: 'PEDIZI API',
      version: '1.0.0',
      description: 'O delivery da sua cidade.',
    }
  }
}
