// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { UserRepository } from './auth.repository';
// import { JwtPayload } from './jwt-payload.interface';
// import { User } from './user.entity';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(UserRepository)
//     private userRepository: UserRepository,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: 'topSecret',
//     });
//   }

//   async validate(payload: JwtPayload) {
//     const { username } = payload;
//     const user = await User.findOne({ where: { username } });
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
