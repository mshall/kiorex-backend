import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly tagLength = 16;

  async encrypt(text: string): Promise<string> {
    const key = crypto.randomBytes(this.keyLength);
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine iv, tag, and encrypted data
    const combined = iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
    
    return combined;
  }

  async decrypt(encryptedText: string, keyId?: string): Promise<string> {
    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const tag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      // In a real implementation, you would retrieve the key using keyId
      const key = crypto.randomBytes(this.keyLength); // This should be retrieved from key management
      
      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  async getCurrentKeyId(): Promise<string> {
    // In a real implementation, this would return the current encryption key ID
    return 'key-' + Date.now();
  }

  async rotateKey(): Promise<string> {
    // In a real implementation, this would rotate the encryption key
    const newKeyId = 'key-' + Date.now();
    // Store new key in key management system
    return newKeyId;
  }
}
