import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { signUpDto } from './dto/signUp.dto';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: signUpDto): Promise<signUpDto> {
    const { name, email, password } = signUpDto;
    const userExist = await this.userModel.findOne({ email });
    if (userExist) {
      throw new UnauthorizedException('User is already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async login(loginDto: loginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.jwtService.sign({
        name: user.name,
        email: user.email,
        id: user.id,
      });
      return { token };
    } else {
      throw new NotFoundException('Wrong email or password');
    }
  }
}
