'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Copy,
  Download,
  Play,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  FileVideo,
  Users,
  MessageSquare,
  Upload,
  Settings,
  Search,
  Book,
  HelpCircle,
  Github,
  Sparkles
} from "lucide-react"
import { VideoWizard } from "./wizards/video-wizard"
import { ConversationWizard } from "./wizards/ConversationWizard"
import { ReplicaPersonaWizard } from "./wizards/ReplicaPersonaWizard"
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Add this CSS to override Prism's default background
const codeBlockStyles = `
  pre[class*="language-"],
  code[class*="language-"] {
    background: #141414 !important;
  }
`;

export default function TavusDevUI() {
  const [activeWizard, setActiveWizard] = React.useState("replica-persona")
  const [apiKey, setApiKey] = React.useState("")
  const [selectedReplica, setSelectedReplica] = React.useState("")
  const [selectedPersona, setSelectedPersona] = React.useState("")
  const [videoScript, setVideoScript] = React.useState("")
  const [personaContext, setPersonaContext] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [videoState, setVideoState] = React.useState({
    videoName: "",
    backgroundUrl: "",
    backgroundSourceUrl: "",
    fastRendering: false,
    selectedLanguage: "en",
    scrollSettings: {
      scroll: false,
      scrollType: "vertical",
      scrollDepth: 100,
      scrollReturn: false
    }
  })
  const [isMounted, setIsMounted] = React.useState(false);

  const [conversationState, setConversationState] = React.useState({
    conversationName: "",
    recordingEnabled: true,
    autoEndEnabled: true,
    maxDuration: "300",
    customGreeting: "",
    language: "en",
    context: "",
    pipelineMode: "full",
    isProcessing: false,
    error: "",
    activeConversationId: "",
  })

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      // Highlight immediately on mount
      Prism.highlightAll();
      
      // Set up a small delay to ensure the code is rendered
      const timer = setTimeout(() => {
        Prism.highlightAll();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  // Define getCodeSnippet first
  const getCodeSnippet = () => {
    if (activeWizard === 'replica-persona') {
      return `// Replica and Persona Management
const tavus = new TavusClient({
  apiKey: '${apiKey || 'ffvfdvfdvdg'}',
});

const createReplica = async () => {
  const replica = await tavus.replicas.create({
    name: 'New Replica',
    trainingVideo: './video.mp4'
  });
  console.log('Created replica:', replica);
};`
    } else if (activeWizard === 'conversation') {
      return `// Conversation Management
const tavus = new TavusClient({
  apiKey: '${apiKey || 'ffvfdvfdvdg'}',
});

const startConversation = async () => {
  const conversation = await tavus.conversations.create({
    replica_id: '${selectedReplica}',
    name: '${conversationState.conversationName}',
    settings: {
      recording_enabled: ${conversationState.recordingEnabled},
      auto_end: ${conversationState.autoEndEnabled},
      max_duration: ${parseInt(conversationState.maxDuration) || 300},
      language: '${conversationState.language || 'en'}',
      pipeline_mode: '${conversationState.pipelineMode || 'full'}',
      custom_greeting: ${conversationState.customGreeting ? `'${conversationState.customGreeting}'` : 'undefined'},
      context: ${conversationState.context ? `'${conversationState.context}'` : 'undefined'}
    }
  });
  console.log('Started conversation:', conversation);
};

const endConversation = async (conversationId) => {
  await tavus.conversations.end(conversationId);
  console.log('Ended conversation:', conversationId);
};

// Example usage:
startConversation()
  .then(() => console.log('Conversation started successfully'))
  .catch(console.error);`
    } else {
      return `// Video Generation
const tavus = new TavusClient({
  apiKey: '${apiKey || 'ffvfdvfdvdg'}',
});

const generateVideo = async () => {
  const video = await tavus.videos.generate({
    replicaId: '${selectedReplica}',
    script: \`${videoScript}\`,
    videoName: '${videoState.videoName}',
    backgroundUrl: ${videoState.backgroundUrl ? `'${videoState.backgroundUrl}'` : 'undefined'},
    backgroundSourceUrl: ${videoState.backgroundSourceUrl ? `'${videoState.backgroundSourceUrl}'` : 'undefined'},
    fast: ${videoState.fastRendering},
    language: '${videoState.selectedLanguage}',
    properties: ${videoState.backgroundUrl ? `{
      background_scroll: ${videoState.scrollSettings.scroll},
      background_scroll_type: '${videoState.scrollSettings.scrollType}',
      background_scroll_depth: ${videoState.scrollSettings.scrollDepth},
      background_scroll_return: ${videoState.scrollSettings.scrollReturn},
    }` : 'undefined'}
  });
  console.log('Generated video:', video);
};`
    }
  };

  // Then use it in useMemo
  const codeSnippet = React.useMemo(() => getCodeSnippet(), [
    apiKey,
    selectedReplica,
    videoScript,
    videoState,
    conversationState,
    activeWizard
  ]);

  React.useEffect(() => {
    if (isMounted) {
      Prism.highlightAll();
    }
  }, [isMounted, codeSnippet]);

  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] text-white">
      {/* Add the styles to the document */}
      <style>{codeBlockStyles}</style>
      
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#141414] border-b border-[#2A2A2A]">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-semibold text-white flex items-center gap-3">
            <img src="/tavus.png" alt="Tavus" className="h-6" />
            <span className="text-sm px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400">
              Wizard 🧙
            </span>
          </h1>
          
          <div className="h-6 w-px bg-[#2A2A2A]" />
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                activeWizard === "replica-persona"
                  ? "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 hover:text-pink-400"
                  : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              }`}
              onClick={() => setActiveWizard("replica-persona")}
            >
              <Users className="w-4 h-4 mr-2" />
              Replica/Persona
            </Button>
            <Button
              variant="ghost"
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                activeWizard === "conversation"
                  ? "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 hover:text-pink-400"
                  : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              }`}
              onClick={() => setActiveWizard("conversation")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Conversation
            </Button>
            <Button
              variant="ghost"
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                activeWizard === "video"
                  ? "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 hover:text-pink-400"
                  : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
              }`}
              onClick={() => setActiveWizard("video")}
            >
              <FileVideo className="w-4 h-4 mr-2" />
              Video Generation
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white hover:bg-pink-500/20 hover:text-pink-400 rounded-xl"
            onClick={() => window.open('https://docs.tavus.io/sections/introduction', '_blank')}
          >
            <Book className="w-4 h-4 mr-2" />
            Docs
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white hover:bg-pink-500/20 hover:text-pink-400 rounded-xl"
            onClick={() => window.open('https://www.tavus.io/support', '_blank')}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white hover:bg-pink-500/20 hover:text-pink-400 rounded-xl"
            onClick={() => window.open('https://github.com/Tavus-Engineering/tavus-examples', '_blank')}
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Settings Panel */}
          <div className="w-80 border-r border-[#2A2A2A] bg-[#141414] overflow-hidden">
            <ScrollArea className="h-[calc(100vh-64px)]">
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-pink-400" />
                      Configuration
                    </h2>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" className="rounded-xl hover:bg-pink-500/20 hover:text-pink-400">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
                    <div className="flex justify-center mb-4">
                      <Tabs defaultValue="api">
                        <TabsList className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-full p-1">
                          <TabsTrigger 
                            value="api" 
                            className="data-[state=active]:text-pink-400 data-[state=active]:bg-pink-500/20 rounded-full px-4"
                          >
                            API
                          </TabsTrigger>
                          <TabsTrigger 
                            value="implementation" 
                            className="data-[state=active]:text-pink-400 data-[state=active]:bg-pink-500/20 rounded-full px-4"
                          >
                            Implementation
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div>
                      <Label htmlFor="apiKey" className="text-gray-300">API Key</Label>
                      <Input
                        id="apiKey"
                        className="mt-1.5 bg-[#141414] border-[#2A2A2A] rounded-xl focus:ring-pink-500 focus:ring-offset-0"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>
                    
                    {activeWizard === "replica-persona" && (
                      <ReplicaPersonaWizard 
                        apiKey={apiKey}
                        selectedReplica={selectedReplica}
                        setSelectedReplica={setSelectedReplica}
                        personaContext={personaContext}
                        setPersonaContext={setPersonaContext}
                      />
                    )}
                    
                    {activeWizard === "video" && (
                      <VideoWizard 
                        apiKey={apiKey} 
                        selectedReplica={selectedReplica}
                        onScriptChange={setVideoScript}
                        onStateChange={setVideoState}
                        state={videoState}
                      />
                    )}

                    {activeWizard === "conversation" && (
                      <ConversationWizard 
                        apiKey={apiKey}
                        selectedReplica={selectedReplica}
                        state={conversationState}
                        onStateChange={setConversationState}
                      />
                    )}

                    <div className="pt-4 border-t border-[#2A2A2A]">
                      <h3 className="text-sm font-semibold text-gray-400 mb-3">Features</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="webhooks" className="text-sm text-gray-300">
                            Webhook Notifications
                          </Label>
                          <Switch id="webhooks" className="data-[state=checked]:bg-pink-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="customTTS" className="text-sm text-gray-300">
                            Custom TTS
                          </Label>
                          <Switch id="customTTS" className="data-[state=checked]:bg-pink-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="customLLM" className="text-sm text-gray-300">
                            Custom LLM
                          </Label>
                          <Switch id="customLLM" className="data-[state=checked]:bg-pink-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Code Preview */}
          <div className="flex-1 flex flex-col bg-[#0F0F0F]">
            <Tabs defaultValue="code" className="flex-1">
              <TabsContent value="code" className="flex-1 p-4">
                <div className="relative h-[calc(100vh-8rem)] rounded-xl border border-[#2A2A2A] bg-[#141414]">
                  <Button 
                    variant="ghost" 
                    className="absolute top-4 right-4 z-10 rounded-xl text-gray-400 transition-colors hover:bg-pink-500/20 hover:text-pink-400"
                    onClick={() => {
                      const codeElement = document.querySelector('pre code');
                      if (codeElement) {
                        navigator.clipboard.writeText(codeElement.textContent || '');
                      }
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <ScrollArea className="h-full w-full">
                    <div className="p-4">
                      <pre className="text-sm font-mono">
                        <code 
                          className={`${isMounted ? 'language-javascript' : ''} whitespace-pre-wrap break-words block`}
                          style={{ background: 'transparent' }}
                        >
                          {getCodeSnippet()}
                        </code>
                      </pre>
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="preview" className="flex-1 p-4">
                <div className="h-full rounded-xl border border-[#2A2A2A] bg-[#141414]">
                  {/* Preview content would go here */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}