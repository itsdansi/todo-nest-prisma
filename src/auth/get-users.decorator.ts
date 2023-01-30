import { createParamDecorator } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

export const GetUser = createParamDecorator((data, req): CreateUserDto => {
  return req.user;
});
