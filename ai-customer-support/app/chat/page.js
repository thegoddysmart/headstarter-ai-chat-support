'use client';
import { useState, useEffect, useRef } from 'react';
import { Avatar, InputBase, IconButton, Stack, Box, Button, Typography, Grid, Paper, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function ChatPage() {
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;  // Don't send empty messages
    setIsLoading(true)

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)
  }
	
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <>
      <Box
	width="100vw"
	height="100vh"
	sx={{
	  display: 'flex',
	  flexDirection: 'column'
	}}
      >
        <Box
	  width="100vw"
	  height="60px"
	  sx={{
	    display: 'flex',
	    alignItems: 'center',
	    p: 1.5
	  }}
        >
	  <img
            src="/images/chat_support.png" // replace with the path to your PNG image
            alt="Customer Support Logo"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover', // Optional: scales the image to cover the Box
            }}
          />
	   <Typography variant="h6" color="black">
            Support Agent 
          </Typography>
	  <Box sx={{
	      cursor: 'pointer',
	      marginLeft: 'auto'
	    }}
	  >
	    <Avatar
	      id="avatar"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
	      {...stringAvatar('Paa Kojo')} />
	  </Box>
	  <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'avatar',
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
	</Box>
	<Box
	  width="100%"
	  height="calc(100vh - 60px)"
	  sx={{
	    display: 'flex',
	    justifyContent: 'center',
	    marginLeft: 'auto',
	    marginRight: 'auto'
	  }}
	>
          <Box
	    sx={{
	      width: 712,
	      height: 'inherit',
	      display: 'flex',
	      flexDirection: 'column'
	    }}
	  >
	    <Stack
              direction={'column'}
              width="inherit"
              height="inherit"
              p={2}
              spacing={3}
            >
              <Stack
                direction={'column'}
                spacing={2}
                flexGrow={1}
                overflow="auto"
                maxHeight="100%"
              >
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent={
                      message.role === 'assistant' ? 'flex-start' : 'flex-end'
                    }
                  >
                    <Box
                      bgcolor={
                        message.role === 'assistant'
                          ? 'inherit'
                          : 'rgba(244, 244, 244, 1)'
                      }
                      borderRadius={16}
                      p={2}
                    >
                      {message.content}
                    </Box>
                  </Box>
                ))}
	        <div ref={messagesEndRef} />
              </Stack>
            </Stack>
	    <Paper
              component="form"
	      fullwidth
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mt: 'auto', mb: 2.5 }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Type here to chat with me"
                inputProps={{ 'aria-label': 'chat with AI agent' }}
	        value={message}
                onChange={(e) => setMessage(e.target.value)}
	        onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <IconButton color="primary" sx={{ p: '10px' }} aria-label="send" onClick={sendMessage} disabled={isLoading}>
                <SendIcon />
              </IconButton>
            </Paper>
	  </Box>
	</Box>
      </Box>
    </>
  );
}
