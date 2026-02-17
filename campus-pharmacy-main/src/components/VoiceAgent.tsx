import React from 'react';

const VoiceAgent: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <elevenlabs-convai 
        agent-id="agent_01jx5fv1kbech895mwad5nx8wb"
        avatar-orb-style="icon"
      ></elevenlabs-convai>
    </div>
  );
};

export default VoiceAgent;
