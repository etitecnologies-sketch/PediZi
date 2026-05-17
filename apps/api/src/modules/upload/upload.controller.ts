import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UploadService, UploadFolder } from './upload.service'

const VALID_FOLDERS: UploadFolder[] = [
  'restaurants/logos',
  'restaurants/covers',
  'menu/items',
  'users/avatars',
]

@ApiTags('upload')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@Controller({ path: 'upload', version: '1' })
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @ApiOperation({ summary: 'Upload de imagem via Cloudinary (otimização automática)' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'menu/items',
  ) {
    const validFolder = VALID_FOLDERS.includes(folder as UploadFolder)
      ? (folder as UploadFolder)
      : 'menu/items'

    return this.uploadService.uploadImage(file, validFolder)
  }
}
