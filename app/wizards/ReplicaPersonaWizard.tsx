'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReplicaPersonaWizardProps {
  apiKey: string
  selectedReplica: string
  setSelectedReplica: (value: string) => void
  personaContext: string
  setPersonaContext: (value: string) => void
}

export function ReplicaPersonaWizard({ 
  apiKey, 
  selectedReplica, 
  setSelectedReplica,
  personaContext,
  setPersonaContext
}: ReplicaPersonaWizardProps) {
  return (
    <>
      <div>
        <Label htmlFor="personaContext" className="text-gray-300">Persona Context</Label>
        <Textarea
          id="personaContext"
          className="bg-[#141414] border-[#2A2A2A] rounded-xl focus:ring-pink-500 mt-1.5"
          placeholder="Enter persona context..."
          value={personaContext}
          onChange={(e) => setPersonaContext(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="selectReplica" className="text-gray-300">Select Replica</Label>
        <Select value={selectedReplica} onValueChange={setSelectedReplica}>
          <SelectTrigger className="bg-[#141414] border-[#2A2A2A] rounded-xl mt-1.5">
            <SelectValue placeholder="Select a replica" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
            <SelectItem value="rep1">Sales Rep 1</SelectItem>
            <SelectItem value="rep2">Support Rep 1</SelectItem>
            <SelectItem value="rep3">Technical Rep 1</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}