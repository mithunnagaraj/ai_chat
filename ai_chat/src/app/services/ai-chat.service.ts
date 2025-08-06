import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ChatResponse {
  text?: string;
  files?: { name: string; type: string; url: string }[];
}

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private socket?: WebSocket;

  constructor(private http: HttpClient) {}

  /** HTTP call for quick responses */
  getQuickResponse(prompt: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>('http://localhost:3000/ai-response', { prompt })
      .pipe(map(res => res));
  }

  /** WebSocket call for streaming */
  getStreamResponse(prompt: string): Observable<string> {
    const subject = new Subject<string>();
    this.socket = new WebSocket('ws://localhost:3000');

    this.socket.onopen = () => {
      this.socket?.send(JSON.stringify({ prompt }));
    };

    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.event === 'chunk') {
        subject.next(msg.data);
      }
      if (msg.event === 'done') {
        subject.complete();
        this.socket?.close();
      }
    };

    return subject.asObservable();
  }
}
