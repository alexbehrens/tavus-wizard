'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Settings, AlertCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ConversationWizardProps {
  apiKey: string
  selectedReplica: string
  onStateChange: (state: ConversationState) => void
  state: ConversationState
}

interface ConversationState {
  conversationName: string
  recordingEnabled: boolean
  autoEndEnabled: boolean
  maxDuration: string
  customGreeting: string
  language: string
  context: string
  pipelineMode: string
  error: string
  toolbarEnabled: boolean
  toolbarPosition: string
  toolbarActions: string[]
  replicaId: string
  personaId: string
  callbackUrl: string
  conversationUrl?: string
  conversationId?: string
  properties: {
    maxCallDuration: number
    participantLeftTimeout: number
    participantAbsentTimeout: number
    enableRecording: boolean
    enableTranscription: boolean
    applyGreenscreen: boolean
  }
}

export function ConversationWizard({ 
  apiKey, 
  selectedReplica,
  onStateChange,
  state 
}: ConversationWizardProps) {
  const [localContext, setLocalContext] = React.useState(state.context || "")
  const [localGreeting, setLocalGreeting] = React.useState(state.customGreeting || "")

  // Initialize state with default properties if not provided
  React.useEffect(() => {
    if (!state.properties) {
      updateState({
        properties: {
          maxCallDuration: 3600,
          participantLeftTimeout: 30,
          participantAbsentTimeout: 30,
          enableRecording: false,
          enableTranscription: false,
          applyGreenscreen: false
        }
      });
    }
  }, []);

  // Update state helper function
  const updateState = (updates: Partial<ConversationState>) => {
    const newState = { ...state, ...updates }
    onStateChange(newState)
  }

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "nl", label: "Dutch" },
    { value: "pl", label: "Polish" },
    { value: "ru", label: "Russian" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
  ]

  const pipelineModes = [
    { value: "full", label: "Full Pipeline" },
    { value: "speech2speech", label: "Speech to Speech" },
    { value: "audioEcho", label: "Audio Echo" },
    { value: "textEcho", label: "Text Echo" },
  ]

  const toolbarPositions = [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" }
  ]

  // Update both local and parent state
  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContext(e.target.value)
    updateState({ context: e.target.value })
  }

  const handleGreetingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalGreeting(e.target.value)
    updateState({ customGreeting: e.target.value })
  }

  const handleLanguageChange = (value: string) => {
    updateState({ language: value })
  }

  const handleMaxDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ maxDuration: e.target.value })
  }

  const handlePipelineModeChange = (value: string) => {
    updateState({ pipelineMode: value })
  }

  const handleToolbarPositionChange = (value: string) => {
    updateState({ toolbarPosition: value })
  }

  // Helper to create Tavus conversation
  const createTavusConversation = async () => {
    try {
      const response = await fetch('https://api.tavus.io/v2/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          replica_id: state.replicaId,
          persona_id: state.personaId,
          callback_url: state.callbackUrl,
          conversation_name: state.conversationName,
          conversational_context: state.context,
          custom_greeting: state.customGreeting,
          language: state.language,
          properties: {
            max_call_duration: parseInt(state.maxDuration) || 3600,
            participant_left_timeout: state.properties.participantLeftTimeout,
            participant_absent_timeout: state.properties.participantAbsentTimeout,
            enable_recording: state.properties.enableRecording,
            enable_transcription: state.properties.enableTranscription,
            apply_greenscreen: state.properties.applyGreenscreen
          }
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      // Update state with conversation URL and ID
      updateState({
        conversationUrl: data.conversation_url,
        conversationId: data.conversation_id,
        error: ''
      });
    } catch (err) {
      updateState({ error: err.message });
    }
  }

  // Add handlers for new toggles
  const handleRecordingToggle = (checked: boolean) => {
    updateState({
      properties: {
        ...(state.properties || {}),
        enableRecording: checked
      }
    });
  }

  const handleTranscriptionToggle = (checked: boolean) => {
    updateState({
      properties: {
        ...(state.properties || {}),
        enableTranscription: checked
      }
    });
  }

  const handleGreenscreenToggle = (checked: boolean) => {
    updateState({
      properties: {
        ...(state.properties || {}),
        applyGreenscreen: checked
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="conversationName">Conversation Name</Label>
        <Input
          id="conversationName"
          className="bg-[#141414] border-[#2A2A2A] rounded-xl focus:ring-pink-500 mt-1.5"
          placeholder="Enter conversation name..."
          value={state.conversationName}
          onChange={(e) => updateState({ conversationName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="context">Conversation Context</Label>
        <Textarea
          id="context"
          className="bg-[#141414] border-[#2A2A2A] rounded-xl focus:ring-pink-500 mt-1.5"
          placeholder="Enter context for the conversation..."
          value={localContext}
          onChange={handleContextChange}
        />
      </div>

      <div>
        <Label htmlFor="customGreeting">Custom Greeting</Label>
        <Input
          id="customGreeting"
          className="bg-[#141414] border-[#2A2A2A] rounded-xl focus:ring-pink-500 mt-1.5"
          placeholder="Enter custom greeting..."
          value={localGreeting}
          onChange={handleGreetingChange}
        />
      </div>

      <div>
        <Label htmlFor="language">Language</Label>
        <Select 
          value={state.language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger className="bg-[#141414] border-[#2A2A2A] rounded-xl mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
            {languageOptions.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="recordingEnabled" className="text-sm text-gray-300">
            Enable Recording
          </Label>
          <Switch
            id="recordingEnabled"
            checked={state.recordingEnabled}
            onCheckedChange={(checked) => updateState({ recordingEnabled: checked })}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="autoEndEnabled" className="text-sm text-gray-300">
            Auto End Conversation
          </Label>
          <Switch
            id="autoEndEnabled"
            checked={state.autoEndEnabled}
            onCheckedChange={(checked) => updateState({ autoEndEnabled: checked })}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="pipelineMode">Pipeline Mode</Label>
        <Select 
          value={state.pipelineMode}
          onValueChange={handlePipelineModeChange}
        >
          <SelectTrigger className="bg-[#141414] border-[#2A2A2A] rounded-xl mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
            {pipelineModes.map(mode => (
              <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="maxDuration">Max Duration</Label>
          <Input
            id="maxDuration"
            className="bg-[#141414] border-[#2A2A2A] rounded-xl focus:ring-pink-500 mt-1.5"
            placeholder="Enter max duration in seconds..."
            value={state.maxDuration}
            onChange={handleMaxDurationChange}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="toolbarEnabled" className="text-sm text-gray-300">
            Enable Interactive Toolbar
          </Label>
          <Switch
            id="toolbarEnabled"
            checked={state.toolbarEnabled}
            onCheckedChange={(checked) => updateState({ toolbarEnabled: checked })}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>

        {state.toolbarEnabled && (
          <>
            <div>
              <Label htmlFor="toolbarPosition">Toolbar Position</Label>
              <Select 
                value={state.toolbarPosition}
                onValueChange={handleToolbarPositionChange}
              >
                <SelectTrigger className="bg-[#141414] border-[#2A2A2A] rounded-xl mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
                  {toolbarPositions.map(pos => (
                    <SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="toolbarActions">Toolbar Actions</Label>
              <Textarea
                id="toolbarActions"
                className="bg-[#141414] border-[#2A2A2A] rounded-xl focus:ring-pink-500 mt-1.5"
                placeholder="Enter comma-separated list of toolbar actions..."
                value={state.toolbarActions?.join(',')}
                onChange={(e) => updateState({ 
                  toolbarActions: e.target.value.split(',').map(s => s.trim())
                })}
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="enableRecording" className="text-sm text-gray-300">
            Enable Recording
          </Label>
          <Switch
            id="enableRecording"
            checked={state.properties?.enableRecording || false}
            onCheckedChange={handleRecordingToggle}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enableTranscription" className="text-sm text-gray-300">
            Enable Transcription
          </Label>
          <Switch
            id="enableTranscription" 
            checked={state.properties?.enableTranscription || false}
            onCheckedChange={handleTranscriptionToggle}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="applyGreenscreen" className="text-sm text-gray-300">
            Apply Greenscreen
          </Label>
          <Switch
            id="applyGreenscreen"
            checked={state.properties?.applyGreenscreen || false}
            onCheckedChange={handleGreenscreenToggle}
            className="data-[state=checked]:bg-pink-500"
          />
        </div>
      </div>

      {state.error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-xl flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {state.error}
        </div>
      )}
    </div>
  )
}