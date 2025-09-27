import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class TwilioVideoService {
  private twilioClient: any;
  private accountSid: string;
  private apiKeySid: string;
  private apiKeySecret: string;

  constructor(private configService: ConfigService) {
    this.accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    this.apiKeySid = this.configService.get('TWILIO_API_KEY_SID');
    this.apiKeySecret = this.configService.get('TWILIO_API_KEY_SECRET');
    
    this.twilioClient = twilio(this.accountSid, this.configService.get('TWILIO_AUTH_TOKEN'));
  }

  async createRoom(roomName: string, options?: any): Promise<any> {
    return await this.twilioClient.video.v1.rooms.create({
      uniqueName: roomName,
      type: options?.type || 'group',
      recordParticipantsOnConnect: options?.recordParticipantsOnConnect || false,
      maxParticipants: options?.maxParticipants || 10,
      mediaRegion: 'us1',
      videoCodecs: ['VP8', 'H264'],
    });
  }

  async generateAccessToken(
    roomName: string,
    identity: string,
    isHost: boolean = false,
  ): Promise<string> {
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(
      this.accountSid,
      this.apiKeySid,
      this.apiKeySecret,
      { ttl: 14400 } // 4 hours
    );

    token.identity = identity;

    const videoGrant = new VideoGrant({
      room: roomName,
    });

    token.addGrant(videoGrant);

    return token.toJwt();
  }

  async completeRoom(roomSid: string): Promise<any> {
    return await this.twilioClient.video.v1
      .rooms(roomSid)
      .update({ status: 'completed' });
  }

  async getIceServers(): Promise<any[]> {
    const token = await this.twilioClient.tokens.create();
    return token.iceServers;
  }
}
