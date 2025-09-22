# VoiceClone AI - Text-to-Speech & Voice Cloning Platform

A modern, full-featured web application for generating scripts, converting text to speech, and cloning voices using AI technology.

## 🚀 Features

### 📝 Script Generation

- **From YouTube**: Generate scripts from YouTube video content
- **From Ideas**: Create scripts based on your concepts and ideas
- **Smart Processing**: AI-powered content analysis and script creation

### 🎵 Text-to-Speech

- **Multiple Input Methods**: Type text directly or upload text files
- **Voice Selection**: Choose from various built-in voices
- **Batch Processing**: Convert multiple text blocks simultaneously
- **Audio Management**: Play, download, and manage generated audio files

### 🎤 Voice Cloning

- **Custom Voices**: Clone voices from audio samples
- **High Quality**: Support for various audio formats (MP3, WAV, FLAC)
- **Real-time Preview**: Listen to audio samples before cloning
- **Voice Management**: Organize and manage your custom voices

### 🎨 Modern UI/UX

- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode**: Full theme support with system preference detection
- **Accessible**: Built with accessibility best practices
- **Smooth Animations**: Polished user experience with smooth transitions

## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Jotai** - Atomic state management
- **Lucide React** - Beautiful icons

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/               # Main application pages
│   │   ├── page.tsx          # Script Generation
│   │   ├── tts/              # Text-to-Speech
│   │   └── voice-clone/      # Voice Cloning
│   └── layout.tsx            # Root layout
├── components/               # Reusable components
│   ├── ui/                   # shadcn/ui components
│   ├── shared/               # Shared components
│   └── theme-provider.tsx    # Theme provider
├── lib/                      # Utilities and configuration
│   ├── utils.ts              # Helper functions
│   └── store.ts              # Jotai state management
├── hooks/                    # Custom React hooks
├── services/                 # API service layer
├── types/                    # TypeScript type definitions
└── public/                   # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/voiceclone-ai.git
   cd voiceclone-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   # Add other environment variables as needed
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Usage Guide

### Script Generation

1. Navigate to the home page
2. Choose between "From YouTube" or "From Idea" tabs
3. Enter your YouTube URL or describe your idea
4. Click "Generate Script" to create content
5. Copy the script or send it directly to Text-to-Speech

### Text-to-Speech Conversion

1. Go to the TTS page (`/tts`)
2. Add text by typing or uploading files
3. Select a voice for each text block
4. Choose "Convert" for individual blocks or "Convert All" for batch processing
5. Play, download, or manage your generated audio files

### Voice Cloning

1. Visit the Voice Clone page (`/voice-clone`)
2. Enter a name for your custom voice
3. Upload a high-quality audio sample (10-30 seconds recommended)
4. Preview your audio sample
5. Click "Start Voice Cloning" to create your custom voice
6. Use your cloned voice in the TTS page

## 🔧 Development

### Code Style

- ESLint and Prettier are configured for consistent code formatting
- Run `npm run lint` to check for issues
- Run `npm run format` to format code

### Type Checking

- Full TypeScript support with strict mode enabled
- Run `npm run type-check` to validate types

### Component Development

- Uses shadcn/ui for consistent, accessible components
- Custom components follow the established patterns
- Responsive design is prioritized

## 🎨 Customization

### Themes

- Built-in dark/light mode support
- Customize colors in `tailwind.config.js`
- Theme switching handled by `next-themes`

### Components

- All UI components are customizable
- Located in `components/ui/`
- Built with Radix UI primitives for accessibility

### State Management

- Jotai atoms for reactive state management
- Global state in `lib/store.ts`
- Local state for component-specific data

## 📱 Features in Detail

### Audio Player Component

- Play/pause controls
- Progress bar with seeking
- Volume control
- Download functionality
- Responsive design

### File Upload System

- Drag and drop support
- File type validation
- Size restrictions
- Preview functionality
- Batch upload support

### Voice Management

- Voice selection interface
- Custom voice integration
- Voice preview capabilities
- Voice deletion and management

## 🔒 Security Considerations

- Input validation on all forms
- File type and size restrictions
- XSS protection
- CSRF protection (when backend is implemented)
- Secure API communication

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Docker

```bash
# Build the image
docker build -t voiceclone-ai .

# Run the container
docker run -p 3000:3000 voiceclone-ai
```

### Traditional Hosting

1. Run `npm run build`
2. Upload the `.next` folder and other necessary files
3. Configure your web server to serve the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Review the code examples

## 🎯 Roadmap

- [ ] Real-time voice synthesis
- [ ] Advanced voice effects
- [ ] Multi-language support
- [ ] Voice emotion control
- [ ] API rate limiting
- [ ] User dashboard and analytics
- [ ] Mobile app development

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
