import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { Request } from "express";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from 'src/auth/public-metadata';
import { Payload } from "src/services/types/auth.service";
import { WsException } from "@nestjs/websockets";


@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector,
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // Checking if the route is public or not
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);

    if (gqlContext.getType() === 'graphql') {
      return this.handleGraphqlRequest(context);
    } else if (context.getType() === 'ws') {
      this.handleWsRequest(context);
    } else {
      return this.handleRestRequest(context);
    }
  }

  async handleWsRequest(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token;

    if (!token) {
      client.disconnect('Unauthorized: Token missing');
      return false; // Return false instead of throwing an exception
    }

    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      client.user = user; // Attach user information to the client
      return true;
    } catch (error) {
      client.disconnect('Unauthorized: Invalid token');
      return false; // Return false if verification fails
    }
  }

  private async handleGraphqlRequest(
    context: ExecutionContext,
  ): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.jwtService.verifyAsync<Payload>(token, {
        secret: jwtConstants.secret,
      });
      req['id'] = user.sub;
      req['user'] = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async handleRestRequest(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.jwtService.verifyAsync<Payload>(token, {
        secret: jwtConstants.secret,
      });
      request['id'] = user.sub;
      request['user'] = user;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: {
    headers: { authorization?: string };
  }): string | undefined {
    if (!request || !request.headers) {
      return undefined;
    }

    const [type, token]: string[] =
      request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
