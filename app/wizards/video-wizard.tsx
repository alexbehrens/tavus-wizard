'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, RefreshCw, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VideoWizardProps {
  apiKey: string
  selectedReplica: string
  onScriptChange: (script: string) => void
  onStateChange: (state: VideoState) => void
  state: VideoState
}

interface VideoState {
  videoName: string
  backgroundUrl: string
  backgroundSourceUrl: string
  fastRendering: boolean
  selectedLanguage: string
  scrollSettings: {
    scroll: boolean
    scrollType: string
    scrollDepth: number
    scrollReturn: boolean
  }
}

export function VideoWizard({ 
  apiKey, 
  selectedReplica, 
  onScriptChange,
  onStateChange,
  state
}: VideoWizardProps) {
  const [localScript, setLocalScript] = React.useState("")
  
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalScript(e.target.value)
    onScriptChange(e.target.value)
  }

  const updateState = (updates: Partial<VideoState>) => {
    const newState = { ...state, ...updates }
    onStateChange(newState)
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="videoName" className="text-gray-300">Video Name</Label>
        <Input
          id="videoName"
          value={state.videoName}
          onChange={(e) => updateState({ videoName: e.target.value })}
          className="mt-1.5 bg-[#141414] border-[#2A2A2A] rounded-xl"
          placeholder="Enter video name..."
        />
      </div>

      <div>
        <Label htmlFor="videoScript" className="text-gray-300">Video Script</Label>
        <Textarea
          id="videoScript"
          value={localScript}
          onChange={handleScriptChange}
          className="mt-1.5 bg-[#141414] border-[#2A2A2A] rounded-xl"
          placeholder="Enter your video script..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="language" className="text-gray-300">Language</Label>
        <Select 
          value={state.selectedLanguage}
          onValueChange={(value) => updateState({ selectedLanguage: value })}
        >
          <SelectTrigger className="mt-1.5 bg-[#141414] border-[#2A2A2A] rounded-xl">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            {/* Add more languages as needed */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="backgroundUrl" className="text-gray-300">Background URL</Label>
        <Input
          id="backgroundUrl"
          value={state.backgroundUrl}
          onChange={(e) => updateState({ backgroundUrl: e.target.value })}
          className="mt-1.5 bg-[#141414] border-[#2A2A2A] rounded-xl"
          placeholder="Enter background URL..."
        />
      </div>

      {state.backgroundUrl && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="scroll" className="text-gray-300">Enable Scroll</Label>
            <Switch
              id="scroll"
              checked={state.scrollSettings.scroll}
              onCheckedChange={(checked) => 
                updateState({ 
                  scrollSettings: { 
                    ...state.scrollSettings, 
                    scroll: checked 
                  } 
                })
              }
            />
          </div>

          {state.scrollSettings.scroll && (
            <>
              <div>
                <Label htmlFor="scrollType" className="text-gray-300">Scroll Type</Label>
                <Select
                  value={state.scrollSettings.scrollType}
                  onValueChange={(value) => 
                    updateState({ 
                      scrollSettings: { 
                        ...state.scrollSettings, 
                        scrollType: value 
                      } 
                    })
                  }
                >
                  <SelectTrigger className="mt-1.5 bg-[#141414] border-[#2A2A2A] rounded-xl">
                    <SelectValue placeholder="Select scroll type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">Vertical</SelectItem>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="scrollDepth" className="text-gray-300">Scroll Depth</Label>
                <Input
                  id="scrollDepth"
                  type="number"
                  value={state.scrollSettings.scrollDepth}
                  onChange={(e) => 
                    updateState({ 
                      scrollSettings: { 
                        ...state.scrollSettings, 
                        scrollDepth: parseInt(e.target.value) 
                      } 
                    })
                  }
                  className="mt-1.5 bg-[#141414] border-[#2A2A2A] rounded-xl"
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label htmlFor="fastRendering" className="text-gray-300">Fast Rendering</Label>
        <Switch
          id="fastRendering"
          checked={state.fastRendering}
          onCheckedChange={(checked) => updateState({ fastRendering: checked })}
        />
      </div>
    </div>
  )
}