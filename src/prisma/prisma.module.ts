import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // make this module global-scoped
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
