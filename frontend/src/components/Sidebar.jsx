import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ContactItem from './ContactItem'

const contacts = [
// ... existing contacts ...
  {
    id: 1,
    name: 'Jordan Lee',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9IfaXPdB6_2qZb1tmAmkkVf1ZFfGyJZ8g5tDXy3w8qrG_GiRAMlJ5wcmCD5KtwkplZDu4AdPDWWQQnEooAu1h_G2H_CxgSDVsFPTid1QSm51hNEfwdzIE47c9KevjlSNDc3RZ0DFlNlzGyXU4I4riqlcLykrZ1p8vt7qeGmtm_T9w-RG3moKj5K84ac4JUXv9cSjoOKDDWR9rps0wBWxOr6LSzle0b4O1wM8fPm_RJx5b6bwUCev3W4ZS8-W_gYG7Uqm4mjdjKv4',
    time: '12:45 PM',
    lastMessage: 'Hey! Did you have a chance...',
    isOnline: true,
    isTyping: true,
  },
// ... remaining unchanged lines ...
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5r52QFyfUeFGH9pogNv-UpV33U94eD9EiLmTbrLqiDeMMN98WvBrsQ3eqjqziZZyBWK2FkZ5KZ8WJoC0yjN3SjEGxCFS_ner3GJPN4Z1GA5rGdaTZKY73OQxEah9D0nrdnFxtsJ613b1WTS9f2JS7SRpplklRLMi69KHzO6EoOVESYzn2q0a1acSuhCwngFwpWEXLpWWiT60zrg_JVqhsp2U62WWoOKC4_AKsqZgSFxPRz37I2-45Cy7XDBOfJHwX3SDnBCUe-j4',
    time: 'Yesterday',
    lastMessage: "Let's catch up later!",
    isOnline: false,
    isTyping: false,
  },
  {
    id: 3,
    name: 'Alex Rivers',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAphJCyKJmT_qkijyeB_fZHTT1Vge3jlq2q_B0zBPiWRxnOCDxMghFsvmyAWh2mUx-VAhy1RmbkWFgCJaI8vCvJREpntR4sFZZ7GkeZdsMavM5EyGwhCakv5Cb5bZQpBxn2yYbD9z8zyDCIKNrrsPFIoHz_BW38PZL6482oyit3hq-BtqFzHrzVHjK7nmFhlDL53EVshX-k_ApJN-VWvY3Z60PT0JZvH4rmm2XMCSCyWzgW90tEeQxJNZRPi15c-0DzcIq2300clUE',
    time: 'Aug 12',
    lastMessage: 'Sent a file.',
    isOnline: true,
    isTyping: false,
  },
]

const currentUser = {
  name: 'Marcus Smith',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGMR1_-vmOuseHJA8_KEcUhdJI8N-Leb_nyJprIPrwCAsf6JMcyOuywYtg8btva8rmODRwvZKtQJrYjXK9XvmlglBsFS4IwApQJ3mIzJd7AuHPszC2jPijSdBc8CK-MSW9hgHRQzJ7WvuriGdZlSoB3B4bZVFRLLs9Q36xPkXBIulNrYR9fR88tBvtT3zYSXwSld3QldbRTlkXU-qmVau_VY6-34eoEi0aMawCbB1CKkZXPsVbiKLHq2PEYKD3Eg-oahOrnze6EiU',
}

function Sidebar({ activeContactId, onSelectContact }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="w-20 lg:w-64 border-r border-slate-200 dark:border-primary/20 flex flex-col bg-background-light dark:bg-background-dark shrink-0">
      {/* Logo / Header */}
      <Link to="/rooms" className="p-4 border-b border-slate-200 dark:border-primary/20 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors cursor-pointer group">
        <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 group-hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h1 className="hidden lg:block font-bold text-xl tracking-tight">Main App</h1>
      </Link>

      {/* Search */}
      <div className="p-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            className="w-full bg-slate-100 dark:bg-primary/10 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            placeholder="Search chats..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts List */}
      <nav className="flex-1 overflow-y-auto space-y-1 px-2">
        {filteredContacts.map((contact) => (
          <div key={contact.id} onClick={() => onSelectContact(contact.id)}>
            <ContactItem
              name={contact.name}
              avatar={contact.avatar}
              time={contact.time}
              lastMessage={contact.lastMessage}
              isActive={contact.id === activeContactId}
              isOnline={contact.isOnline}
              isTyping={contact.isTyping}
            />
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200 dark:border-primary/20 flex items-center gap-3">
        <div
          className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 avatar"
          style={{ backgroundImage: `url('${currentUser.avatar}')` }}
        />
        <div className="hidden lg:block flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{currentUser.name}</p>
          <p className="text-xs text-slate-500">Active now</p>
        </div>
        <button className="hidden lg:block text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
