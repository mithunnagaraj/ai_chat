import { Injectable } from '@angular/core';
import { Observable, of, from, interval } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { ChatResponse } from './ai-chat.service';

@Injectable()
export class MockAiChatService {
  getQuickResponse(prompt: string): Observable<ChatResponse> {
    if (prompt.includes('file')) {
      return of({
        text: "Here's the document you requested.",
        files: [
          { name: 'manual.pdf', type: 'pdf', url: '/assets/mock/manual.pdf' },
          { name: 'image1.png', type: 'image/png', url: '/assets/mock/image1.png' },
          { name: 'video.mp4', type: 'video/mp4', url: '/assets/mock/video.mp4' }
        ]
      });
    }
    return of({ text: '', files: [] }); // fallback to streaming
  }

  getStreamResponse(prompt: string): Observable<string> {
    const chunks = ['Hello ', 'this ', 'is ', 'a ', 'mock ', 'streamed ', 'response.'];
    return from(chunks).pipe(
      concatMap(chunk => interval(200).pipe(take(1), concatMap(() => [chunk])))
    );
  }
}
