import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

export type UploadFolder = 'restaurants/logos' | 'restaurants/covers' | 'menu/items' | 'users/avatars'

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name)
  private readonly useCloudinary: boolean

  constructor(private readonly configService: ConfigService) {
    const cloudName = configService.get<string>('CLOUDINARY_CLOUD_NAME')
    const apiKey = configService.get<string>('CLOUDINARY_API_KEY')
    const apiSecret = configService.get<string>('CLOUDINARY_API_SECRET')

    this.useCloudinary = !!(cloudName && apiKey && apiSecret)

    if (this.useCloudinary) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
      this.logger.log('☁️  Cloudinary configurado')
    } else {
      this.logger.warn('⚠️  Cloudinary não configurado — uploads desabilitados em produção')
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: UploadFolder,
    options?: { width?: number; height?: number; quality?: number },
  ): Promise<{ url: string; publicId: string; width: number; height: number }> {
    if (!file?.buffer) throw new BadRequestException('Arquivo inválido')

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) throw new BadRequestException('Imagem muito grande. Máximo 5MB.')

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Formato inválido. Use JPEG, PNG, WebP ou GIF.')
    }

    if (!this.useCloudinary) {
      // Em desenvolvimento local, retorna uma URL fake
      return {
        url: `https://via.placeholder.com/${options?.width ?? 800}x${options?.height ?? 600}`,
        publicId: `dev/${Date.now()}`,
        width: options?.width ?? 800,
        height: options?.height ?? 600,
      }
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `pedizi/${folder}`,
          transformation: [
            {
              width: options?.width ?? 1200,
              height: options?.height ?? 1200,
              crop: 'limit',
              quality: options?.quality ?? 'auto:good',
              fetch_format: 'auto',
            },
          ],
          resource_type: 'image',
        },
        (error: Error | null, result?: UploadApiResponse) => {
          if (error) {
            this.logger.error('Cloudinary upload error:', error)
            reject(new BadRequestException('Erro ao fazer upload da imagem'))
            return
          }
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
            width: result!.width,
            height: result!.height,
          })
        },
      ).end(file.buffer)
    })
  }

  async deleteImage(publicId: string): Promise<void> {
    if (!this.useCloudinary) return
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      this.logger.error(`Erro ao deletar imagem ${publicId}:`, error)
    }
  }

  // Gera URL com transformações dinâmicas (ex: thumbnail 200x200)
  getTransformedUrl(publicId: string, width: number, height: number): string {
    if (!this.useCloudinary) return `https://via.placeholder.com/${width}x${height}`
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    })
  }
}
