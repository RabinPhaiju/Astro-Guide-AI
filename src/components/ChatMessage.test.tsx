import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatMessage from './ChatMessage';

// Mock SpeechSynthesis API
const mockSpeak = jest.fn();
const mockCancel = jest.fn();
let mockUtteranceInstance: {
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
  text: string;
} | null = null;

// We need to be able to capture the onend and onerror handlers
const mockSpeechSynthesisUtterance = jest.fn().mockImplementation((text: string) => {
  mockUtteranceInstance = {
    onend: null,
    onerror: null,
    text: text,
  };
  return mockUtteranceInstance;
});

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: mockSpeak,
    cancel: mockCancel,
    speaking: false, // You might need to mock this if your component uses it
  },
  writable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: mockSpeechSynthesisUtterance,
  writable: true,
});

describe('ChatMessage Component', () => {
  beforeEach(() => {
    // Clear mock call history and reset any state between tests
    mockSpeak.mockClear();
    mockCancel.mockClear();
    mockSpeechSynthesisUtterance.mockClear();
    mockUtteranceInstance = null;
    // Reset the speaking state for window.speechSynthesis if needed
    // (Object.defineProperty(window, 'speechSynthesis', { value: { ...window.speechSynthesis, speaking: false }, writable: true });)
  });

  // Test 1: "Listen" button visibility
  test('renders Listen button for assistant messages and not for user messages', () => {
    // Assistant message
    render(<ChatMessage message="Hello from assistant" isUser={false} />);
    expect(screen.getByRole('button', { name: /Listen to message/i })).toBeInTheDocument();

    // User message
    render(<ChatMessage message="Hello from user" isUser={true} />);
    // Check if any buttons with that accessible name exist
    const listenButtonsForUser = screen.queryAllByRole('button', { name: /Listen to message/i });
    expect(listenButtonsForUser.length).toBe(0);
  });

  // Test 2: Clicking the "Listen" button
  test('calls speechSynthesis.speak and updates button when Listen is clicked', () => {
    const assistantMessage = "This is a test message from the assistant.";
    render(<ChatMessage message={assistantMessage} isUser={false} />);

    const listenButton = screen.getByRole('button', { name: /Listen to message/i });
    fireEvent.click(listenButton);

    expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(assistantMessage);
    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(mockSpeak).toHaveBeenCalledWith(mockUtteranceInstance);
    expect(screen.getByRole('button', { name: /Stop listening to message/i })).toBeInTheDocument();
    expect(screen.queryByText(/Listen/i)).not.toBeInTheDocument(); // Original "Listen" text should be gone
    expect(screen.getByText(/Stop/i)).toBeInTheDocument(); // "Stop" text should be visible
  });

  // Test 3: Clicking the "Stop" button
  test('calls speechSynthesis.cancel and updates button when Stop is clicked', () => {
    render(<ChatMessage message="Test stop" isUser={false} />);

    const listenButton = screen.getByRole('button', { name: /Listen to message/i });
    fireEvent.click(listenButton); // Click to "Listen" -> this calls mockCancel once already

    // Clear mock history before clicking "Stop" to isolate the cancel call for "Stop"
    mockCancel.mockClear(); 

    // Now it should be a "Stop" button
    const stopButton = screen.getByRole('button', { name: /Stop listening to message/i });
    fireEvent.click(stopButton); // Click to "Stop"

    expect(mockCancel).toHaveBeenCalledTimes(1); // Should now pass
    // The button should revert to "Listen" state
    expect(screen.getByRole('button', { name: /Listen to message/i })).toBeInTheDocument();
    expect(screen.queryByText(/Stop/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Listen/i)).toBeInTheDocument();
  });

  // Test 4: Speech ending naturally
  test('button reverts to Listen state when speech ends naturally', () => {
    render(<ChatMessage message="Test speech end" isUser={false} />);

    const listenButton = screen.getByRole('button', { name: /Listen to message/i });
    fireEvent.click(listenButton); // Click to "Listen"

    // Ensure an utterance instance was created and onend is available
    expect(mockUtteranceInstance).not.toBeNull();
    act(() => {
      if (mockUtteranceInstance && mockUtteranceInstance.onend) {
        mockUtteranceInstance.onend(); // Manually trigger onend
      } else {
        throw new Error("mockUtteranceInstance or onend handler is not set up correctly for onend test");
      }
    });

    // The button should revert to "Listen" state
    expect(screen.getByRole('button', { name: /Listen to message/i })).toBeInTheDocument();
    expect(screen.queryByText(/Stop/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Listen/i)).toBeInTheDocument();
    // Ensure speak was called once, and cancel was not (unless it's part of initial setup)
    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  // Test 5: Speech error
  test('button reverts to Listen state on speech error', () => {
    render(<ChatMessage message="Test speech error" isUser={false} />);

    const listenButton = screen.getByRole('button', { name: /Listen to message/i });
    fireEvent.click(listenButton); // Click to "Listen"
    
    expect(mockUtteranceInstance).not.toBeNull();
    act(() => {
      if (mockUtteranceInstance && mockUtteranceInstance.onerror) {
        mockUtteranceInstance.onerror(new Event('error')); // Manually trigger onerror
      } else {
        throw new Error("mockUtteranceInstance or onerror handler is not set up correctly for onerror test");
      }
    });

    expect(screen.getByRole('button', { name: /Listen to message/i })).toBeInTheDocument();
    expect(screen.queryByText(/Stop/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Listen/i)).toBeInTheDocument();
  });
});
