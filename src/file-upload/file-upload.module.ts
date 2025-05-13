import { multerConfig } from '@/config/multer.config';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register(multerConfig)],
  exports: [MulterModule],
})
export class FileUploadModule {}
