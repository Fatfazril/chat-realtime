import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'

// Demo data matching the HTML design
const contactsData = {
  1: {
    name: 'Jordan Lee',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9IfaXPdB6_2qZb1tmAmkkVf1ZFfGyJZ8g5tDXy3w8qrG_GiRAMlJ5wcmCD5KtwkplZDu4AdPDWWQQnEooAu1h_G2H_CxgSDVsFPTid1QSm51hNEfwdzIE47c9KevjlSNDc3RZ0DFlNlzGyXU4I4riqlcLykrZ1p8vt7qeGmtm_T9w-RG3moKj5K84ac4JUXv9cSjoOKDDWR9rps0wBWxOr6LSzle0b4O1wM8fPm_RJx5b6bwUCev3W4ZS8-W_gYG7Uqm4mjdjKv4',
    isOnline: true,
    isTyping: true,
  },
  2: {
    name: 'Sarah Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5r52QFyfUeFGH9pogNv-UpV33U94eD9EiLmTbrLqiDeMMN98WvBrsQ3eqjqziZZyBWK2FkZ5KZ8WJoC0yjN3SjEGxCFS_ner3GJPN4Z1GA5rGdaTZKY73OQxEah9D0nrdnFxtsJ613b1WTS9f2JS7SRpplklRLMi69KHzO6EoOVESYzn2q0a1acSuhCwngFwpWEXLpWWiT60zrg_JVqhsp2U62WWoOKC4_AKsqZgSFxPRz37I2-45Cy7XDBOfJHwX3SDnBCUe-j4',
    isOnline: false,
    isTyping: false,
  },
  3: {
    name: 'Alex Rivers',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAphJCyKJmT_qkijyeB_fZHTT1Vge3jlq2q_B0zBPiWRxnOCDxMghFsvmyAWh2mUx-VAhy1RmbkWFgCJaI8vCvJREpntR4sFZZ7GkeZdsMavM5EyGwhCakv5Cb5bZQpBxn2yYbD9z8zyDCIKNrrsPFIoHz_BW38PZL6482oyit3hq-BtqFzHrzVHjK7nmFhlDL53EVshX-k_ApJN-VWvY3Z60PT0JZvH4rmm2XMCSCyWzgW90tEeQxJNZRPi15c-0DzcIq2300clUE',
    isOnline: true,
    isTyping: false,
  },
}

const initialMessages = {
  1: [
    {
      id: 1,
      text: 'Hey! Did you have a chance to look at the latest design mockups for the dashboard?',
      time: '10:12 AM',
      isOwn: false,
    },
    {
      id: 2,
      text: 'Just finished reviewing them. Overall they look great, but I think the primary button might need more contrast in dark mode.',
      time: '10:15 AM',
      isOwn: true,
      read: true,
    },
    {
      id: 3,
      text: 'Good catch! I\'ll update that now. Can you send me the color palette we used for the mobile version for comparison?',
      time: '10:16 AM',
      isOwn: false,
    },
    {
      id: 4,
      text: '',
      time: '10:18 AM',
      isOwn: false,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyGRzOiIHLD00KNK8AZxZ4GKaF3ntb0l4V9OgbTap-N6d2BOCYTttOAghnGFCOuoznZJtJ5s8ZhTPMsTzmdTs4RoPbd2lBEYsvPpKsoesP0BJFqM_aGjaj8b7UY0PlWf76m_WBrjWCMDaLN99EqyyoefSv49Zyzktu2oYr4ZkUdcNeXlPRphNGtiv0oFO6qDr7Vo6Xow2s_ixkhwIqKLGPkYeAnJG2SzCkhSWB420B-b4vKyFBp0Ts9FBOGG_XM_Gw7jKih0cJats',
      imageLabel: 'UI_Mockup_v2.png',
    },
    {
      id: 5,
      text: 'On it! 🚀',
      time: '10:20 AM',
      isOwn: true,
      read: true,
    },
  ],
  2: [
    {
      id: 1,
      text: "Let's catch up later!",
      time: 'Yesterday',
      isOwn: false,
    },
  ],
  3: [
    {
      id: 1,
      text: 'Sent a file.',
      time: 'Aug 12',
      isOwn: false,
    },
  ],
}

function App() {
  const [activeContactId, setActiveContactId] = useState(1)
  const [allMessages, setAllMessages] = useState(initialMessages)

  const activeContact = contactsData[activeContactId]
  const messages = allMessages[activeContactId] || []

  const handleSendMessage = (text) => {
    const newMsg = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
      read: false,
    }

    setAllMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }))
  }

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar
        activeContactId={activeContactId}
        onSelectContact={setActiveContactId}
      />
      <ChatArea
        contact={activeContact}
        messages={messages}
        isTyping={activeContact.isTyping}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default App
