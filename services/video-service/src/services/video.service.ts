import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoSession, SessionStatus } from '../entities/video-session.entity';
import { VideoParticipant } from '../entities/video-participant.entity';
import { TwilioVideoService } from './twilio-video.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoSession)
    private sessionRepository: Repository<VideoSession>,
    @InjectRepository(VideoParticipant)
    private participantRepository: Repository<VideoParticipant>,
    private twilioService: TwilioVideoService,
  ) {}

  async createSession(data: {
    appointmentId: string;
    hostId: string;
    participantIds: string[];
    scheduledStart: Date;
    scheduledEnd: Date;
  }): Promise<VideoSession> {
    const roomName = `room_${uuidv4()}`;
    const twilioRoom = await this.twilioService.createRoom(roomName, {
      recordParticipantsOnConnect: true,
      maxParticipants: data.participantIds.length + 1,
      type: 'group',
    });

    const session = this.sessionRepository.create({
      appointmentId: data.appointmentId,
      roomName,
      roomSid: twilioRoom.sid,
      hostId: data.hostId,
      scheduledStart: data.scheduledStart,
      scheduledEnd: data.scheduledEnd,
      status: SessionStatus.CREATED,
    });

    const savedSession = await this.sessionRepository.save(session);

    for (const participantId of [data.hostId, ...data.participantIds]) {
      await this.participantRepository.save({
        session: savedSession,
        userId: participantId,
        isHost: participantId === data.hostId,
      });
    }

    return savedSession;
  }

  async joinSession(sessionId: string, userId: string): Promise<{
    token: string;
    roomName: string;
    iceServers: any[];
  }> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['participants'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const participant = session.participants.find(p => p.userId === userId);
    if (!participant) {
      throw new BadRequestException('Not authorized to join this session');
    }

    const token = await this.twilioService.generateAccessToken(
      session.roomName,
      userId,
      participant.isHost,
    );

    participant.joinedAt = new Date();
    await this.participantRepository.save(participant);

    if (session.status === SessionStatus.CREATED) {
      session.status = SessionStatus.WAITING;
      session.actualStart = new Date();
      await this.sessionRepository.save(session);
    }

    return {
      token,
      roomName: session.roomName,
      iceServers: await this.twilioService.getIceServers(),
    };
  }
}
