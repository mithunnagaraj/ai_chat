import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';
import { AiChatService } from './ai-chat.service';
import { MockAiChatService } from './mock-ai-chat.service';

describe('ChatComponent', () => {
  let fixture: ComponentFixture<ChatComponent>;
  let component: ChatComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent],
      imports: [FormsModule],
      providers: [
        { provide: AiChatService, useClass: MockAiChatService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display mock files when file prompt is given', () => {
    component.userInput = 'Show me file';
    component.sendMessage();
    fixture.detectChanges();

    expect(component.files.length).toBeGreaterThan(0);
    expect(component.files[0].type).toBe('pdf');
  });

  it('should stream text chunks progressively', fakeAsync(() => {
    component.userInput = 'Hello';
    component.sendMessage();

    tick(200); fixture.detectChanges();
    expect(component.aiResponse).toContain('Hello');

    tick(1000); fixture.detectChanges();
    expect(component.aiResponse).toContain('mock streamed response.');
  }));
});
