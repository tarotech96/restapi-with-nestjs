import { UserDto } from 'src/dto/userDto';
import { AppModule } from './../src/app.module';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';

const BASE_URL = 'http://localhost:3333'

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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

    // listen app on port 3333
    await app.listen(3333);

    // Retrieve prisma instance
    prisma = app.get(PrismaService);
    // clean DB
    await prisma.cleanDb();

    // set baseUrl for request
    pactum.request.setBaseUrl(BASE_URL);
  });

  afterAll(() => {
    // terminate app test
    app.close();
  })

  describe('Auth', () => {

    // Test signup
    describe('Sign up', () => {
      const userDto: UserDto = {
        email: 'taronguyen@gmail.com',
        password: '1234',
        firstName: 'Taro',
        lastName: 'Nguyen'
      }

      // test email empty
      it.todo('Should throw exception if email empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            password: userDto.password
          })
          .expectStatus(400);
      })

      // test password empty
      it.todo('Should throw exception if password empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            email: userDto.email
          })
          .expectStatus(400)
      })

      // test no body 
      it.todo('Should throw if no body', () => {
        return pactum.spec()
          .post('/auth/signup')
          .expectStatus(400)
      })


      it.todo('Should signup', () => {
        return pactum.spec()
          .post(`${BASE_URL}/auth/signup`)
          .withBody(userDto)
          .expectStatus(200)
          .inspect()
      });



    });

    // Test signin
    describe('Signin', () => {
      const userDto: UserDto = {
        email: 'taronguyen@gmail.com',
        password: '1234'
      }


      // test user doesn't exist
      it.todo('Should throw exception if user does not exist', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: 'invalid email',
            password: '1234'
          })
          .expectStatus(404)
      })


      // test password invalid
      it.todo('Should throw exception if password is invalid', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: userDto.email,
            password: 'password invalid'
          })
          .expectStatus(403)
      })

      it.todo('Should signin', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody(userDto)
          .expectStatus(200)
          .stores('userAt', 'access_token') // store access_token from response
      });
    });

  });

  describe('User', () => {

    // Test get me
    describe('Should get current user', () => {
      return pactum.spec()
        .get('/users/me')
        .withHeaders('Authorization', 'Bearer $S{userAt}')
        .expectStatus(200)
        .inspect()
    });

    // Test edit user
    describe('Edit user', () => {

    });

  });

  describe('Bookmarks', () => {

    // Test get all bookmarks
    describe('Get all bookmarks', () => {

    });

    // Test create a new bookmark
    describe('Create a new bookmark', () => {

    });

    // Test get bookmark by id 
    describe('Get bookmark by id', () => {

    });


  })
})