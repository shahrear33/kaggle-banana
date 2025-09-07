import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react'
// config for agora

export const config = {mode : 'rtc', codec : 'vp8', appId : "5df7d63fb30642108563623d6fbd3969", token : process.env.NEXT_PUBLIC_AGORA_TOKEN}
export const useClient = createClient(config)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()
export const channelName = "channel1"