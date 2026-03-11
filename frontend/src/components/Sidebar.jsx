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
    <aside className="w-20 lg:w-[400px] border-r border-slate-200 dark:border-[#313d45] flex flex-col bg-white dark:bg-[#111b21] shrink-0">
      {/* Header */}
      <div className="h-[59px] px-4 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between shrink-0">
        <div
          className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 avatar cursor-pointer"
          style={{ backgroundImage: `url('${currentUser.avatar}')` }}
        />
        <div className="flex items-center gap-3 text-[#54656f] dark:text-[#aebac1]">
          <Link to="/rooms" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">groups</span>
          </Link>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">donut_large</span>
          </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">chat</span>
          </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">more_vert</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 bg-white dark:bg-[#111b21] border-b border-slate-200 dark:border-[#222d34]">
        <div className="relative group flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 focus-within:bg-white dark:focus-within:bg-[#202c33] transition-colors shadow-sm">
          <span className="material-symbols-outlined shrink-0 text-[#54656f] dark:text-[#8696a0] w-6 text-sm group-focus-within:hidden transition-all">
            search
          </span>
          <span className="material-symbols-outlined shrink-0 text-[#00a884] dark:text-[#00a884] w-6 text-sm hidden group-focus-within:block transition-all">
            arrow_back
          </span>
          <input
            className="w-full bg-transparent border-none pl-3 py-1 text-[15px] focus:ring-0 text-[#111b21] dark:text-[#e9edef] placeholder:text-[#54656f] dark:placeholder:text-[#8696a0] outline-none"
            placeholder="Search or start new chat"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts List */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-[#111b21]">
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
    </aside>
  )
}

export default Sidebar
