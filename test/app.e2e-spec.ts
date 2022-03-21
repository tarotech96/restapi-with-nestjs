
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'


describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    
    // define module test
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));

    // initialize app test
    await app.init();
  });

  afterAll(() => {
    // terminate app test
    app.close();
  })

  // create a test closure
  it.todo('should pass');
})