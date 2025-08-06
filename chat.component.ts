import { Component } from '@angular/core';
import { AiChatService, ChatResponse } from './ai-chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  userInput = '';
  aiResponse = '';
  files: { name: string; type: string; url: string }[] = [];
  isStreaming = false;

  constructor(private aiService: AiChatService) {}

  sendMessage() {
    this.aiResponse = '';
    this.files = [];
    this.isStreaming = false;

    // Step 1: Try HTTP first
    this.aiService.getQuickResponse(this.userInput).subscribe({
      next: (res: ChatResponse) => {
        if (res.text) {
          this.aiResponse = res.text;
        }
        if (res.files) {
          this.files = res.files;
        }

        // fallback to streaming if no quick text result
        if (!res.text) {
          this.startStreaming();
        }
      },
      error: () => this.startStreaming()
    });
  }

  private startStreaming() {
    this.isStreaming = true;
    this.aiResponse = '';
    this.aiService.getStreamResponse(this.userInput).subscribe({
      next: (chunk) => this.aiResponse += chunk,
      complete: () => this.isStreaming = false
    });
  }
}
