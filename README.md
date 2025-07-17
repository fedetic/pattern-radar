# Pattern Hero - Frontend

A React-based crypto pattern analysis dashboard with real-time chart visualization and pattern detection capabilities.

## Overview

The Pattern Hero frontend is a modern web application built with React, TypeScript, and Vite that provides an intuitive interface for crypto traders to analyze chart patterns. It features interactive candlestick charts, pattern highlighting, and comprehensive pattern analysis tools.

## Features

- **Interactive Charts**: Candlestick and line chart visualization with Recharts
- **Pattern Detection**: Real-time pattern highlighting and analysis
- **Authentication**: Secure user authentication via Supabase
- **Responsive Design**: Dark-themed interface optimized for extended screen time
- **Pattern Analysis**: Categorized pattern detection (Chart, Candle, Volume-Based, Price Action, Harmonic, Statistical)
- **Real-time Data**: Live market data integration with CoinGecko API
- **Pattern Highlighting**: Visual pattern overlays with confidence indicators

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Recharts** - Chart visualization library
- **Supabase** - Authentication and database
- **React Router** - Client-side routing
- **Framer Motion** - Animation library

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pattern-hero/pattern-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_PROJECT_ID=your-project-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run build-no-errors  # Build ignoring TypeScript errors
npm run preview          # Preview production build
```

### Code Quality
```bash
npm run lint             # Run ESLint
npx tsc --noEmit        # Type check without emitting files
```

### Component Development
```bash
npx tempo dev           # Start Tempo component development server
```

### Type Generation
```bash
npm run types:supabase  # Generate Supabase types
```

## Project Structure

```
pattern-radar/
├── src/
│   ├── components/          # Main application components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── ChartDisplay.tsx # Chart visualization component
│   │   ├── PatternAnalysisPanel.tsx # Pattern analysis sidebar
│   │   ├── home.tsx        # Main dashboard component
│   │   └── ...
│   ├── lib/                # Utility functions
│   │   ├── supabase.ts     # Supabase client configuration
│   │   └── utils.ts        # General utilities
│   ├── types/              # TypeScript type definitions
│   ├── stories/            # Tempo component stories
│   ├── tempobook/          # Tempo configuration
│   └── ...
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

## Key Components

### ChartDisplay.tsx
Main chart visualization component featuring:
- Candlestick and line chart modes
- Pattern highlighting with multiple coordinate types
- Time granularity selector
- Interactive pattern selection
- Real-time market data display

### PatternAnalysisPanel.tsx
Pattern analysis sidebar with:
- Categorized pattern listing
- Pattern strength indicators
- Interactive pattern selection
- Confidence scoring

### home.tsx
Main dashboard orchestrating:
- Trading pair selection
- Timeframe controls
- Component integration
- API data management

## Configuration

### Vite Configuration (vite.config.ts)
- React SWC plugin for fast builds
- Path aliases (`@` → `./src`)
- Tempo plugin for component development
- Development server configuration

### Tailwind Configuration (tailwind.config.js)
- Custom color scheme for dark theme
- Component-specific styling
- Responsive design utilities

### TypeScript Configuration (tsconfig.json)
- Strict mode disabled for easier development
- Path mapping for imports
- Project references for optimal compilation

## Environment Variables

### Required Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional Variables
- `SUPABASE_PROJECT_ID` - For type generation

## Development Workflow

### Component Development with Tempo
1. Start Tempo development server: `npx tempo dev`
2. Access component library at `http://localhost:3000/tempobook`
3. Create/modify components in `src/components/ui/`
4. Add stories in `src/stories/`
5. Test components in isolation

### Adding New Components
1. Create component in appropriate directory
2. Follow existing naming conventions
3. Add TypeScript interfaces
4. Include proper styling with Tailwind
5. Add to component exports

### Pattern Integration
1. Backend provides pattern data via `/patterns` endpoint
2. Frontend processes pattern coordinates for visualization
3. Pattern highlighting supports multiple coordinate types:
   - `pattern_range` - Multi-candle patterns
   - `candlestick_highlight` - Single candle patterns
   - `horizontal_line` - Support/resistance levels
   - `trend_lines` - Moving average indicators

## API Integration

### Backend Endpoints
- `GET /pairs` - Available trading pairs
- `GET /patterns/{coin_id}` - Pattern analysis data
- `GET /market-data/{coin_id}` - OHLCV market data

### Data Flow
1. User selects trading pair and timeframe
2. Frontend requests pattern data from backend
3. Backend analyzes patterns and returns coordinates
4. Frontend visualizes patterns on chart
5. User interacts with pattern selection

## Styling Guidelines

### Design System
- Dark theme optimized for trader focus
- High contrast elements for readability
- Consistent spacing and typography
- Responsive design for all screen sizes

### Component Styling
- Use Tailwind utility classes
- Follow shadcn/ui design patterns
- Maintain consistent color scheme
- Use backdrop blur effects for depth

## Testing

### Current Status
- No automated testing framework configured
- Manual testing via browser and Tempo stories
- Consider adding Vitest or Jest for unit testing

### Testing Recommendations
1. Add unit tests for utility functions
2. Component testing with React Testing Library
3. Integration tests for API interactions
4. E2E tests for critical user flows

## Performance Optimization

### Current Optimizations
- Vite for fast development builds
- React SWC for compilation
- Memoization in chart processing
- Efficient re-rendering patterns

### Future Improvements
- Code splitting for route-based chunks
- Image optimization for assets
- Bundle analysis and optimization
- Caching strategies for API data

## Known Limitations

### Current Issues
- TypeScript strict mode disabled
- No automated testing suite
- CORS wide open in development
- Limited error handling

### Backend Dependencies
- Requires pattern-radar-api backend
- Real pattern analysis needs ta-lib installation
- Mock data when backend unavailable

## Contributing

### Development Setup
1. Follow installation instructions
2. Create feature branch
3. Make changes following code style
4. Test changes thoroughly
5. Submit pull request

### Code Style
- Use TypeScript for type safety
- Follow existing component patterns
- Maintain consistent naming conventions
- Add comments for complex logic

## Production Deployment

### Build Process
```bash
npm run build           # Production build
npm run preview         # Test production build
```

### Deployment Checklist
- [ ] Configure production environment variables
- [ ] Set up proper CORS settings
- [ ] Configure error monitoring
- [ ] Set up analytics tracking
- [ ] Test all functionality

### Environment Setup
- Configure Supabase for production
- Set up proper authentication policies
- Configure backend API endpoints
- Set up monitoring and logging

## Support

For issues, feature requests, or questions:
1. Check existing documentation
2. Review component stories in Tempo
3. Consult backend API documentation
4. Create detailed issue reports

## License

[Add your license information here]

## Changelog

### Latest Updates
- Fixed chart type selection (candlestick/line)
- Enhanced pattern highlighting for all coordinate types
- Enabled time granularity selector
- Fixed pattern popup footer overlap
- Improved responsive design