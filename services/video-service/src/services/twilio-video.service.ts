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
    this.accountSid = this.configService.get('TWILIO_ACCOUNT_SID') || process.env.TWILIO_ACCOUNT_SID || 'AC' + 'mock';
    this.apiKeySid = this.configService.get('TWILIO_API_KEY_SID') || process.env.TWILIO_API_KEY_SID || 'SK' + 'mock';
    this.apiKeySecret = this.configService.get('TWILIO_API_KEY_SECRET') || process.env.TWILIO_API_KEY_SECRET || 'mock-secret';
    
    // Only initialize Twilio client if we have valid credentials
    if (this.accountSid.startsWith('AC') && this.apiKeySid.startsWith('SK')) {
      this.twilioClient = twilio(this.accountSid, this.configService.get('TWILIO_AUTH_TOKEN') || process.env.TWILIO_AUTH_TOKEN || 'mock-token');
    } else {
      console.warn('Twilio credentials not properly configured - video service will run in mock mode');
      this.twilioClient = null;
    }
  }

  async createRoom(roomName: string, options?: any): Promise<any> {
    if (!this.twilioClient) {
      return { sid: 'mock-room-sid', uniqueName: roomName, status: 'in-progress' };
    }
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
    if (!this.twilioClient) {
      return 'mock-jwt-token-for-testing';
    }
    
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(
      this.accountSid,
      this.apiKeySid,
      this.apiKeySecret,
      { 
        ttl: 14400, // 4 hours
        identity: identity 
      }
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
